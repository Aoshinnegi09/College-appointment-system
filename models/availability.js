const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isBooked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Availability', availabilitySchema);