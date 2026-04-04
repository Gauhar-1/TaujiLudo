import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User.js';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import dotenv from 'dotenv';
import expressAsyncHandler from 'express-async-handler';
import Profile from '../models/Profile.js';
import { faker } from "@faker-js/faker";
import crypto from 'crypto';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);


export const sendOtp: RequestHandler = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const phone = req.body.phoneNumber;
    const email = req.body.email;

    if (!phone || !email) {
        res.status(400).json({ success: false, message: 'Phone and Email are required.' });
        return;
    }

    try {
        let user = await User.findOne({ phone });

        if (user?.status === "blocked") {
            res.status(403).json({ success: false, message: "Your account is blocked. Contact support." });
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        const resendAvailableAt = new Date(Date.now() + 30 * 1000);

        if (user) {
            user.otp = otp;
            user.status = "active";
            user.otpExpires = otpExpires;
            user.resendAvailableAt = resendAvailableAt;
            await user.save();
        } else {
            await User.create({
                phone,
                otp,
                status: "active",
                otpExpires,
                resendAvailableAt
            });
        }

        // ✅ NEW: Send via Resend API (HTTPS Port 443 - Not blocked by Render!)
        const { data, error } = await resend.emails.send({
            from: 'TaujiLudo <noreply@taujiludo.qzz.io>', // Use your verified domain here later
            to: email,
            subject: 'TaujiLudo login verification code',
            // Example email body:
            html: `<p>Click here to login: <a href="https://taujiludo.qzz.io/verify?token=${otp}">Login to TaujiLudo</a></p>`
        });

        if (error) {
            console.error('Resend Error:', error);
            res.status(500).json({ error: 'Failed to send email' });
            return;
        }


        // 3. Return a more detailed response to the frontend if you want
        res.status(200).json({
            success: true,
            message: 'OTP sent to your email successfully',
            resendAfter: resendAvailableAt,
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });

    } catch (error) {
        console.error('❌ Error sending OTP:', error);
        next(error);
    }
});




export const verifyOtp = (async (req: any, res: any, next: any) => {
    const phone = req.body.phoneNumber;
    const otp = req.body.otp;
    const ref = req.body.ref || "";
    try {

        const user = await User.findOne({ phone, otp });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found or invalid OTP' });
        }

        //@ts-ignore
        if (!user || user.otp !== otp || new Date() > user.otpExpires) {
            res.status(400).json({ error: 'Invalid or expired OTP' });
            return; // Add this line!
        }

        let profile = await Profile.findOne({
            userId: user._id
        })

        if (!profile) {

            const Referal = crypto.randomBytes(5).toString('hex');

            console.log("Referal: " + Referal);

            const referalLink = `https://taujiludo.in/?ref=${Referal}`;

            const randomName = faker.person.firstName(); // Generates a random first name
            const randomEmail = `${randomName.toLowerCase()}${Math.floor(Math.random() * 1000)}@gmail.com`; // Generates a unique email

            profile = await Profile.create({
                userId: user._id,
                name: randomName,
                email: randomEmail,
                phoneNumber: phone,
                amount: 500,
                imgUrl: "image",
                status: "active",
                cashWon: 0,
                BattlePlayed: 0,
                Referal,
                referalLink,
                gameWon: 0, // Corrected field name
                gameLost: 0, // Corrected field name
                "kycDetails.status": "pending",
            });

            let referredByUser = null;
            if (ref) {
                referredByUser = await Profile.findOne({ Referal: ref });

                if (referredByUser) {
                    referredByUser.referrals.push({ phoneNumber: phone, timestamp: new Date(), referalEarning: 0 }); // Example earning amount
                    await referredByUser.save();

                    profile.referredBy = referredByUser.phoneNumber;
                    await profile.save();

                }
            }
        }

        const accessToken = jwt.sign(
            { userId: user._id, phoneNumber: user.phone, name: profile.name },
            process.env.JWT_ACCESS_SECRET as string, // Add this to your .env
            { expiresIn: "15m" } // Short-lived!
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET as string, // Add this to your .env
            { expiresIn: "30d" } // Long-lived for Auto-Login
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // Assuming your site is HTTPS
            sameSite: "None",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            // domain: ".taujiludo.in" // Uncomment if using subdomains, but keep it consistent!
        });

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            accessToken,
            userId: user._id,
            name: profile.name
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Error verifying OTP' });
    }
});

export const autoLogin = async (req: any, res: any) => {
    // Look for the Refresh Token cookie
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: "No refresh token found, please login." });
    }

    try {
        // Verify the long-lived refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as JwtPayload & { userId: string };

        const user = await Profile.findOne({ userId: decoded.userId });

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        // Issue a brand new Access Token for the session
        const newAccessToken = jwt.sign(
            { userId: user.userId, phoneNumber: user.phoneNumber, name: user.name },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: "15m" }
        );

        res.json({
            success: true,
            accessToken: newAccessToken,
            user
        });

    } catch (err) {
        console.error("🛑 Refresh Token Verification Failed:", err);
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            // domain: ".taujiludo.in" // Must match verifyOtp!
        });
        return res.status(401).json({ success: false, message: "Session expired, please login again." });
    }
};

export const logOut = async (req: any, res: any) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        // domain: ".taujiludo.in" // Only use this if you used it in verifyOtp
    });

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ success: true, message: "Logged out successfully." });
};
