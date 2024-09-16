import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { encrypt } from '../../aes/aes.service';

import userRepo from '../../user/repository/user.repo';
import { sendMail } from '../../mailjet/mailjet.controller';

class SignupService {
    async verifyCode(data: any) {
        const user: any = await userRepo.findOne({ _id: { $eq: data.id } });
        if (!user) {
            const err: any = new Error('Account not found');
            err.status = 400;
            throw err;
        }
        if (user.status == 'verified') {
            const err: any = new Error('Account has been verified already');
            err.status = 400;
            throw err;
        }
        if (user.status == 'suspended') {
            const err: any = new Error('Account has been suspended');
            err.status = 400;
            throw err;
        }
        const check = await bcrypt.compare(
            `${data.code}`,
            user.verification_code
        );

        if (!check || user.verification_exp < new Date()) {
            const err: any = new Error('Invalid or expired token');
            err.status = 400;
            throw err;
        }

        await userRepo.updateOne(
            { _id: { $eq: user._id } },
            { status: 'verified' }
        );

        const token = encrypt(
            jwt.sign(
                {
                    user: user._id,
                    action: 'login_jwt',
                },
                process.env.JWT_SECRET!,
                { expiresIn: process.env.VERIFY_JWT_EXPIRY }
            )
        );

        sendMail(
            { email: user.email },
            'Welcome',
            process.env.TEMPLATEID_ACCOUNT_WELCOME,
            {
                base_url: process.env.WEB_URL,
            },
            'Welcome'
        );

        return {
            message: 'Account verified successfully',
            data: token,
        };
    }

    async resendCode(data: any) {
        const user = await userRepo.findOne({
            email: { $eq: data.email },
            status: { $eq: 'unverified' },
        });
        if (!user) {
            const err: any = new Error('Unverified account not found');
            err.status = 400;
            throw err;
        }
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });
        const token = encrypt(
            jwt.sign(
                { user: user._id, action: 'verify_jwt' },
                process.env.JWT_SECRET!
            )
        );
        await Promise.all([
            userRepo.updateOne(
                { email: { $eq: data.email }, status: { $eq: 'unverified' } },
                {
                    verification_exp: new Date(
                        Date.now() + +process.env.OTP_DURATION!
                    ),
                    verification_code: await bcrypt.hash(otp, 12),
                }
            ),
            sendMail(
                { email: data.email },
                'Resend Verification Code',
                process.env.TEMPLATEID_ACCOUNT_VERIFICATION,
                {
                    email: data.email,
                    token: otp,
                    verify_url: `/${process.env.SIGNUP_VERIFICATION_EXT}?user=${token}&email=${data.email}`,
                    base_url: process.env.WEB_URL,
                },
                'Resend Verification Code'
            ),
        ]);
        return {
            message: `Verification code has been resent to ${data.email}`,
            data: { email: data.email, token },
        };
    }
}

export default new SignupService();
