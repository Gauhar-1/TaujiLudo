import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    otp: { type: String, required: false },
    otpExpires: { type: Date, required: false },
});

const User = mongoose.model('User', userSchema);

export default User;
