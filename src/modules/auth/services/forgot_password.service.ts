import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";

import { encrypt } from "../../aes/aes.service";
import { sendMail } from "../../mailjet/mailjet.controller";

import userRepo from "../../user/repository/user.repo";

class NewPasswordService {
    async forgotPassword(data: any) {
        const user = await userRepo.findOne({ email: { $eq: data.email } });

        const resetToken: string = crypto.randomBytes(32).toString("hex");

        const otp: string = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });

        if (!user) {
            return {
                message:
                    "A password reset email has been sent to your registered address.",
                    data: { token: resetToken },
            };
        }

        if (user.status == "suspended") {
            const err: any = new Error("This User has been suspended");
            err.status = 400;
            throw err;
        }

        user.password_reset_token = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        user.password_reset_exp = new Date(Date.now() + 15 * 60 * 1000);
        user.password_reset_otp = await bcrypt.hash(otp, 12);

        await user.save();

        await sendMail(
            { email: data.email },
            "Password Reset Request",
            process.env.TEMPLATEID_PASSWORD_RESET!,
            {
                email: data.email,
                reset_link: `${process.env.WEB_URL}/forgot-password/verify?token=${resetToken}&otp=${otp}&email=${data.email}`,
                token: otp,
                user: user.first_name,
            },
            "Password Reset Request"
        );

        return {
            message:
                "A password reset email has been sent to your registered address.",
            data: { token: resetToken },
        };
    }

    async forgotPasswordVerify(data: any) {
        const hashedToken: string = crypto
            .createHash("sha256")
            .update(data.token)
            .digest("hex");

        const user = await userRepo.findOne({
            password_reset_token: { $eq: hashedToken },
            password_reset_exp: { $gt: Date.now() },
        });

        if (!user) {
            const err: any = new Error("Token is invalid or has expired");
            err.status = 400;
            throw err;
        }

        const check = await bcrypt.compare(
            data.otp,
            user.password_reset_otp ? user.password_reset_otp : ""
        );

        if (!check) {
            const err: any = new Error("Invalid code");
            err.status = 400;
            throw err;
        }

        const token = encrypt(
            jwt.sign(
                {
                    user: user._id,
                    action: "reset_jwt",
                },
                process.env.JWT_SECRET!,
                { expiresIn: process.env.JWT_EXPIRY }
            )
        );

        return {
            message: `Code verified`,
            data: { token },
        };
    }

    async resetPassword(data: any) {
        const user = await userRepo.updateOne(
            {
                _id: { $eq: data.user },
            },
            {
                password: await bcrypt.hash(data.newPassword, 12)
            }
        );
        
        if (!user) {
            const err: any = new Error("User not found");
            err.status = 404;
            throw err;
        }

        await sendMail(
            { email: user.email },
            "Password Reset Successful",
            process.env.TEMPLATEID_PASSWORD_RESET_SUCCESSFUL!,
            {
                user: user.first_name,
                base_url: process.env.WEB_URL,
            },
            "Password Reset Successful"
        );

        return {
            message: `Password reset successfully`,
        };
    }
}

export default new NewPasswordService();
