// import { Types } from "mongoose";
// import crypto from "crypto";
import userRepo from '../../user/repository/user.repo';
import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';
import { google } from 'googleapis';
// import { sendMail } from '../../mailjet/mailjet.controller';

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
        await userRepo.create({
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            role: data.role,
            password: await bcrypt.hash(data.password, 12),
        });
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

        await userRepo.create({
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            google_login: true,
            role: data.role,
            status: 'verified',
            password: await bcrypt.hash(password, 12),
        });

        return {
            message: "Signup successful"
        }
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
            message: "Success",
            url
        }
    }
}

export default new SignupService();
