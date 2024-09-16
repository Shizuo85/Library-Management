import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import userRepo from '../../user/repository/user.repo';
import { sendMail } from '../../mailjet/mailjet.controller';
import { encrypt } from '../../aes/aes.service';

class LoginService {
    async emailLogin(data: any) {
        const user = await userRepo.findOneSelect(
            { email: { $eq: data.email } },
            '+password'
        );

        if (!user) {
            const err: any = new Error('This account does not exist');
            err.status = 400;
            throw err;
        }

        const check = await bcrypt.compare(data.password, user.password);
        if (!check) {
            const err: any = new Error('Incorrect Email or Password');
            err.status = 400;
            throw err;
        }

        if (user.status == 'suspended') {
            const err: any = new Error('This User has been suspended');
            err.status = 400;
            throw err;
        }

        if (user.status == 'unverified') {
            const otp: string = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
            });
    
            const hashed: string = await bcrypt.hash(otp, 12);

            user.verification_code = hashed;
            user.verification_exp = new Date(
                Date.now() + +process.env.OTP_DURATION!
            );

            await user.save();

            const token: string = encrypt(
                jwt.sign(
                    { user: user._id, action: 'verify_jwt' },
                    process.env.JWT_SECRET!,
                    { expiresIn: process.env.VERIFY_JWT_EXPIRY }
                )
            );

            await sendMail(
                { email: data.email },
                'Account verification',
                process.env.TEMPLATEID_ACCOUNT_VERIFICATION!,
                {
                    token: otp,
                    email: data.email,
                    verify_url: `/${process.env.SIGNUP_VERIFICATION_EXT}?user=${token}&email=${data.email}`,
                    base_url: process.env.WEB_URL,
                },
                'Account verification'
            );

            return {
                message: `Your account is unverified. A verification code has been sent to ${data.email} `,
                data: { email: data.email, token },
            };
        } else {
            const token: string = encrypt(
                jwt.sign(
                    {
                        user: user._id,
                        action: 'login_jwt',
                    },
                    process.env.JWT_SECRET!,
                    { expiresIn: process.env.LOGIN_JWT_EXPIRY }
                )
            );

            const refreshToken = encrypt(
                jwt.sign(
                    {
                        user: user._id,
                        action: 'refresh_jwt',
                    },
                    process.env.JWT_SECRET!,
                    { expiresIn: process.env.REFRESH_JWT_EXPIRY }
                )
            );

            await sendMail(
                { email: data.email },
                'Login Notification',
                process.env.TEMPLATEID_LOGIN!,
                {
                    ip: data.ip,
                    time: new Date().toUTCString(),
                    email: data.email,
                    user: user.first_name,
                },
                'Login Notification'
            );

            return {
                message: 'Login Successful',
                data: {
                    access_token: token,
                    refresh_token: refreshToken,
                },
            };
        }
    }

    async googleLogin(data: any) {
        const user = await userRepo.findOne({
            email: { $eq: data.email },
            googleLogin: { $eq: true },
        });

        if (!user) {
            const err: any = new Error(
                'No google account associated with this email'
            );
            err.status = 400;
            throw err;
        }

        if (user.status == 'suspended') {
            const err: any = new Error('This User has been suspended');
            err.status = 400;
            throw err;
        }

        const token: string = encrypt(
            jwt.sign(
                {
                    user: user._id,
                    action: 'login_jwt',
                },
                process.env.JWT_SECRET!,
                { expiresIn: process.env.LOGIN_JWT_EXPIRY }
            )
        );

        const refreshToken = encrypt(
            jwt.sign(
                {
                    user: user._id,
                    action: 'refresh_jwt',
                },
                process.env.JWT_SECRET!,
                { expiresIn: process.env.REFRESH_JWT_EXPIRY }
            )
        );

        await sendMail(
            { email: data.email },
            'Login Notification',
            process.env.TEMPLATEID_LOGIN!,
            {
                time: new Date().toUTCString(),
                email: data.email,
                user: user.first_name,
            },
            'Login Notification'
        );

        return {
            message: 'Login Successful',
            data: {
                access_token: token,
                refresh_token: refreshToken,
            },
        };
    }
}

export default new LoginService();
