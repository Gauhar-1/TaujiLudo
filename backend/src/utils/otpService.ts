import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOTP = async (phone: string, otp: string) => {
    if (phone) 
         console.log('Phone number is passed.' );
    try {
        await client.messages.create({
            to: phone,
            from: process.env.TWILIO_PHONE_NUMBER,
            body: `Your OTP is ${otp}`,
        });
        console.log('OTP sent successfully');
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};
