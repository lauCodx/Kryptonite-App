import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: String,
  otp: {
     type: String, 
     required: true },
  createdAt: { 
    type: Date, expires: '5m', 
    default: Date.now } // OTP expires after 5 minutes
});

export const Otp = mongoose.model('Otp', otpSchema);
