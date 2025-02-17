const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    phoneNumber: String,
    bloodType: String,
    location: {
        lat: Number,
        lng: Number
    },
    isAvailable: { type: Boolean, default: true },
    registrationDate: { type: Date, default: Date.now },
    preferredHospital: String
});

module.exports = mongoose.model('Donor', donorSchema); 