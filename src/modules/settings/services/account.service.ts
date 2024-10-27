import bcrypt from 'bcrypt';
import otpGenerator from 'otp-generator';
import { Types } from "mongoose";

import userRepo from '../../user/repository/user.repo';
import { sendMail } from '../../mailjet/mailjet.controller';

class AccountService {
    async changePassword(data: any) {
        const user = await userRepo.findOneSelect(
            { _id: { $eq: data.user } },
            '+password'
        );

        if (!user) {
            const err: any = new Error('This account does not exist');
            err.status = 400;
            throw err;
        }

        const check = await bcrypt.compare(data.oldPassword, user.password);
        if (!check) {
            const err: any = new Error('Current Password is Incorrect');
            err.status = 400;
            throw err;
        }

        if (data.newPassword != data.confirmPassword) {
            const err: any = new Error('Password mismatch');
            err.status = 422;
            throw err;
        }

        const check2 = await bcrypt.compare(data.newPassword, user.password);
        if (check2) {
            const err: any = new Error(
                'New password must differ from the old one.'
            );
            err.status = 400;
            throw err;
        }

        user.password = await bcrypt.hash(data.newPassword, 12);

        await user.save();

        return {
            message: `Password changed successfully`,
        };
    }

    async changeEmail(data: any) {
        const user = await userRepo.findOne({
            email: { $eq: data.email },
        });

        if (user) {
            const err: any = new Error(
                'An account with this email exists already'
            );
            err.status = 400;
            throw err;
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });
        const hashedToken = await bcrypt.hash(otp, 12);

        await Promise.all([
            sendMail(
                { email: data.email },
                'Email Change Verification',
                process.env.TEMPLATEID_EMAIL_VERIFICATION,
                {
                    action: 'personal',
                    email: data.email,
                    token: otp,
                },
                'Email Change Verification'
            ),
            userRepo.updateOne(
                { _id: { $eq: data.user } },
                {
                    temp_email: data.email,
                    email_code: hashedToken,
                    email_code_exp: new Date(
                        Date.now() + +process.env.OTP_DURATION!
                    ),
                }
            ),
        ]);
        return {
            message: `Verification code has been sent to ${data.email}`,
            data: data.email,
        };
    }

    async changeEmailCode(data: any) {
        const user = await userRepo.findOne({ _id: { $eq: data.user } });

        if (!user) {
            const err: any = new Error('User not found');
            err.status = 400;
            throw err;
        }

        const check = await bcrypt.compare(
            data.otp,
            user.email_code ? user.email_code : ''
        );

        if (!check || new Date() > (user?.email_code_exp || 0)) {
            const err: any = new Error('Invalid or expired code');
            err.status = 400;
            throw err;
        }

        const userCheck = await userRepo.findOne({
            email: { $eq: user.temp_email },
        });

        if (userCheck) {
            const err: any = new Error(
                'An account with this email exists already'
            );
            err.status = 400;
            throw err;
        }

        const newEmail = user.temp_email || user.email;

        await Promise.all([
            userRepo.updateOne(
                { _id: { $eq: data.user } },
                {
                    $set: {
                        email: newEmail,
                        google_login: false,
                    },
                    $unset: {
                        temp_email: '',
                        email_code: '',
                    },
                }
            ),
            sendMail(
                { email: newEmail },
                'Email Changed Succesfully',
                process.env.TEMPLATEID_EMAIL_CHANGE_SUCCESFUL,
                {
                    email: newEmail,
                    user: user.first_name,
                    base_url: process.env.WEB_URL,
                },
                'Email Changed Succesfully'
            )
        ]);

        return {
            message: `Email updated successfully`,
            data: data.email,
        };
    }

    async resendEmailCode(data: any) {
        if (!data.email) {
            const err: any = new Error('No pending email to verify');
            err.status = 400;
            throw err;
        }
        const user = await userRepo.findOne({
            email: { $eq: data.email },
        });

        if (user) {
            const err: any = new Error(
                'An account with this email exists already'
            );
            err.status = 400;
            throw err;
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });
        const hashedToken = await bcrypt.hash(otp, 12);

        await Promise.all([
            sendMail(
                { email: data.email },
                'Email Change Verification',
                process.env.TEMPLATEID_EMAIL_VERIFICATION,
                {
                    action: 'personal',
                    email: data.email,
                    token: otp,
                },
                'Email Change Verification'
            ),
            userRepo.updateOne(
                { _id: { $eq: data.user } },
                {
                    temp_email: data.email,
                    email_code: hashedToken,
                    email_code_exp: new Date(
                        Date.now() + +process.env.OTP_DURATION!
                    ),
                }
            ),
        ]);
        return {
            message: `Verification code has been sent to ${data.email}`,
            data: data.email,
        };
    }

    async updateLoginWithGoogle(data: any) {
        await userRepo.updateOne(
            { _id: { $eq: data.user } },
            { google_login: data.google_login }
        );
        return {
            message: `Google login ${
                data.google_login ? "enabled" : "disabled"
            }`,
        };
    }

    async fetchProfile(data: any) {
        const user = await userRepo.fetchUser(
            {
                _id: { $eq: new Types.ObjectId(data.user) },
            }
        );

        return {
            message: 'success',
            data: {
                user,
            },
        };
    }

    async updateProfile(data: any) {
        const { role, user, ...update } = data;
        
        await userRepo.updateOne(
            {
                _id: { $eq: user },
            },
            update
        );

        return {
            message: 'success',
        };
    }
}

export default new AccountService();
