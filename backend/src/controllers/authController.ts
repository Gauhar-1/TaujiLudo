import  jwt, { JwtPayload }  from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOTP } from '../utils/otpService';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import dotenv from 'dotenv';
import expressAsyncHandler from 'express-async-handler';
import axios from 'axios';
import Profile from '../models/Profile.js';
import { faker } from "@faker-js/faker";
import crypto from 'crypto';

dotenv.config();

export const sendOtp : RequestHandler = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const  phone  = req.body.phoneNumber;

    if (!phone) 
        return console.log('Phone number is required.' );


    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {

        const resendAvailableAt = new Date(Date.now() + 30 * 1000);

        const user = await User.findOneAndUpdate(
            { phone },
            { otp, status: "active",  otpExpires: new Date(Date.now() + 10 * 60 * 1000), resendAvailableAt  },
            { upsert: true, new: true }
        );

        if(!user){
            await User.create(
                { phone },
                { otp,status: "active", otpExpires: new Date(Date.now() + 10 * 60 * 1000), resendAvailableAt },
            { upsert: true, new: true },
            );
        }

        const URL = `https://sms.renflair.in/V1.php?API=${process.env.API_KEY}&PHONE=${phone}&OTP=${otp}`;
        const response = await axios.get(URL);


        res.status(200).json({ 
            success: true,
            message: 'OTP sent successfully',
            resendAfter: resendAvailableAt 
        },
        );
    } catch (error) {
        console.error('Error sending OTP:', error);
        next(error);
        res.status(500).json({ error: 'Error sending OTP' });
    }
});


export const verifyOtp  = (async (req: any, res: any, next: any) => {
    const phone  = req.body.phoneNumber;
    const otp  = req.body.otp;
    const ref  = req.body.ref || "";
    try {

        const user = await User.findOne({ phone, otp });

        if (!user) {
            return console.log('User not found' );
        }

        //@ts-ignore
        if (!user || user.otp !== otp || new Date() > user.otpExpires) {
             res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        let profile = await Profile.findOne({
            userId : user._id
        })

        if(!profile){

            const Referal = crypto.randomBytes(5).toString('hex');

            console.log("Referal: "+ Referal);
        
            const referalLink = `https://taujiludo.in/?ref=${Referal}`;
        
            const randomName = faker.person.firstName(); // Generates a random first name
        const randomEmail = `${randomName.toLowerCase()}${Math.floor(Math.random() * 1000)}@gmail.com`; // Generates a unique email
        
             profile = await Profile.create({
              userId: user._id,
              name: randomName,
              email: randomEmail,
              phoneNumber : phone,
              amount: 5,
              imgUrl: "image",
              status: "active",
              cashWon: 0,
              BattlePlayed: 0,
              Referal,
              referalLink,
              gameWon: 0, // Corrected field name
              gameLost: 0, // Corrected field name
              "kycDetails.status" : "pending",
            });

            let referredByUser = null;
            if (ref) {
                referredByUser = await Profile.findOne({ Referal: ref });
        
                if (referredByUser) {
                    referredByUser.referrals.push({  phoneNumber : phone, timestamp: new Date(), referalEarning: 0 }); // Example earning amount
                    await referredByUser.save();
            
                    profile.referredBy = referredByUser.phoneNumber;
                    await profile.save();
            
                }
        }
    }
    
        // JWT generation logic here
        const token = jwt.sign(
            { userId: user._id, phoneNumber: user.phone, name : profile.name },
            process.env.JWT_SECRET as string, // Ensure JWT_SECRET is set in env
            { expiresIn: "7d" } // Token valid for 7 days
        );

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: true, // Use only in HTTPS
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

        res.status(200).json({ 
            success: true,
            message: 'OTP verified successfully',
             token,
            userId : user._id,
            name : profile.name
         });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        next(error)
        res.status(500).json({ error: 'Error verifying OTP' });
    }
});

export const autoLogin = async(req:any, res:any)=>{
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });
  
    try {
      const decoded = jwt.verify(token,  process.env.JWT_SECRET as string)  as JwtPayload;
      const user = await Profile.findOne(decoded.userId);
      if (!user) return res.status(401).json({ success: false, message: "User not found" });
  
      res.json({ success: true, user });
    } catch (err) {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
}

export const logOut = async (req: any, res: any)=>{
    res.clearCookie("token");
    res.json({ success: true, message: "Logged out successfully" });
}