// Example User schema, add these fields
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, required: true }, // e.g., 'User'
    isVerified: { type: Boolean, default: false }, // New: to check if email is verified
    otp: String,        // New: Store the current OTP
    otpExpires: Date,   // New: OTP expiration timestamp
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);