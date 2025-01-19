import  jwt  from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOTP } from '../utils/otpService';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';

export const sendOtp : RequestHandler = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const  phone  = req.body.phoneNumber;


    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const user = await User.findOneAndUpdate(
            { phone },
            { otp, otpExpires: new Date(Date.now() + 10 * 60 * 1000) },
            { upsert: true, new: true }
        );

        if(!user){
            await User.create(
                { phone },
                { otp, otpExpires: new Date(Date.now() + 10 * 60 * 1000) },
            { upsert: true, new: true }
            );
        }
 
        if (!phone) 
            return console.log('Phone number is required  1.' );
        await sendOTP(phone, otp);

        res.status(200).json({ 
            success: true,
            message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        next(error);
        res.status(500).json({ error: 'Error sending OTP' });
    }
});

export const verifyOtp : RequestHandler = (async (req: Request, res: Response, next: NextFunction) => {
    const phone  = req.body.phoneNumber;
    const otp  = req.body.otp;
    try {
        const user = await User.findOne({ phone, otp });

        if (!user) {
            return console.log('User not found' );
        }

        //@ts-ignore
        if (!user || user.otp !== otp || new Date() > user.otpExpires) {
             res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // JWT generation logic here
        res.status(200).json({ 
            success: true,
            message: 'OTP verified successfully',
             token: 'JWT_TOKEN',
            userId : user._id });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        next(error)
        res.status(500).json({ error: 'Error verifying OTP' });
    }
});
