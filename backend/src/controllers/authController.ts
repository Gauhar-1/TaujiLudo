import  jwt  from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOTP } from '../utils/otpService';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import dotenv from 'dotenv';
import expressAsyncHandler from 'express-async-handler';
import axios from 'axios';
import Profile from '../models/Profile.js';

dotenv.config();

export const sendOtp : RequestHandler = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const  phone  = req.body.phoneNumber;

    if (!phone) 
        return console.log('Phone number is required  0.' );


    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const user = await User.findOneAndUpdate(
            { phone },
            { otp, status: "active",  otpExpires: new Date(Date.now() + 10 * 60 * 1000) },
            { upsert: true, new: true }
        );

        if(!user){
            await User.create(
                { phone },
                { otp,status: "active", otpExpires: new Date(Date.now() + 10 * 60 * 1000) },
            { upsert: true, new: true }
            );
        }
 
        if (!phone) 
            return console.log('Phone number is required  1.' );

        const URL = `https://sms.renflair.in/V1.php?API=${process.env.API_KEY}&PHONE=${phone}&OTP=${otp}`;
        const response = await axios.get(URL);


        res.status(200).json({ 
            success: true,
            message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        next(error);
        res.status(500).json({ error: 'Error sending OTP' });
    }
});


export const verifyOtp  = (async (req: any, res: any, next: any) => {
    const phone  = req.body.phoneNumber;
    const otp  = req.body.otp;
    const ref  = req.body.ref;
    try {
        const user = await User.findOne({ phone, otp });

        if (!user) {
            return console.log('User not found' );
        }

        //@ts-ignore
        if (!user || user.otp !== otp || new Date() > user.otpExpires) {
             res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        const profile = await Profile.findOne({
            userId : user._id
        })

        if(profile){
            let referredByUser = null;
            if (ref) {
                referredByUser = await Profile.findOne({ Referal: ref });
        
                if (referredByUser) {
                    // Increment referral count
                    referredByUser.referrals += 1;
                    await referredByUser.save();
        
                    // Assign referrer to the new user
                    profile.referredBy = referredByUser.phoneNumber;
                    await user.save();
                }
        }

         // Check if referral code exists
  
    }
        // JWT generation logic here
        // const token = jwt.sign(
        //     { userId: user._id, phoneNumber: user.phone },
        //     process.env.JWT_SECRET as string, // Ensure JWT_SECRET is set in env
        //     { expiresIn: "7d" } // Token valid for 7 days
        // );

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
