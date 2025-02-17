const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patientName: String,
    contactEmail: String,
    bloodType: String,
    emergencyContact: String,
    hospitalLocation: String,
    additionalDetails: String,
    requestDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema); 