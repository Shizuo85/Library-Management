import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

import { encrypt } from '../../aes/aes.service';

import userRepo from '../../user/repository/user.repo';
import { sendMail } from '../../mailjet/mailjet.controller';

class SignupService {
    async emailSignup(data: any) {
        const check = await userRepo.findOne({ email: { $eq: data.email } });
        if (check) {
            const err: any = new Error(
                'An account with this email already exists'
            );
            err.status = 400;
            throw err;
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });

        const new_user: any = await userRepo.create({
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            role: data.role,
            password: await bcrypt.hash(data.password, 12),
            verification_code: await bcrypt.hash(otp, 12),
            verification_exp: new Date(Date.now() + +process.env.OTP_DURATION!),
        });

        const token = encrypt(
            jwt.sign(
                { user: new_user._id, action: 'verify_jwt' },
                process.env.JWT_SECRET!,
                { expiresIn: process.env.VERIFY_JWT_EXPIRY }
            )
        );

        sendMail(
            { email: data.email },
            'Account verification',
            process.env.TEMPLATEID_ACCOUNT_VERIFICATION,
            {
                email: data.email,
                token: otp,
                verify_url: `/${process.env.SIGNUP_VERIFICATION_EXT}?user=${token}&email=${data.email}`,
                base_url: process.env.WEB_URL,
            },
            'Account verification'
        );

        return {
            message: `Account created, verification code has been sent to ${data.email}`,
            data: { email: data.email, token },
        };
    }

    async googleSignup(data: any) {
        const check = await userRepo.findOne({ email: { $eq: data.email } });
        if (check) {
            const err: any = new Error(
                'An account with this email already exists'
            );
            err.status = 400;
            throw err;
        }
        const password = otpGenerator.generate(20, {
            upperCaseAlphabets: true,
            specialChars: true,
            lowerCaseAlphabets: true,
        });

        const new_user: any = await userRepo.create({
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            google_login: true,
            role: data.role,
            status: 'verified',
            password: await bcrypt.hash(password, 12),
        });

        const token: string = encrypt(
            jwt.sign(
                {
                    user: new_user._id,
                    action: 'login_jwt',
                },
                process.env.JWT_SECRET!,
                { expiresIn: process.env.LOGIN_JWT_EXPIRY }
            )
        );

        const refreshToken = encrypt(
            jwt.sign(
                {
                    user: new_user._id,
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
                user: new_user.first_name,
            },
            'Login Notification'
        );

        sendMail(
            { email: new_user.email },
            'Welcome',
            process.env.TEMPLATEID_ACCOUNT_WELCOME,
            {
                base_url: process.env.WEB_URL,
            },
            'Welcome'
        );

        return {
            message: 'Signup Successful',
            data: {
                access_token: token,
                refresh_token: refreshToken,
            },
        };
    }

    async googleApiUrl(dat: any) {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_LOGIN_REDIRECT_URL
        );
        const url = oauth2Client.generateAuthUrl({
            scope: [
                'openid',
                'https://www.googleapis.com/auth/contacts.readonly',
                'https://www.googleapis.com/auth/user.emails.read',
                'email',
                'profile',
            ],
        });

        return {
            message: 'Success',
            url,
        };
    }
}

export default new SignupService();
