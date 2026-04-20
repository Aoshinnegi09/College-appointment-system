const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    availabilitySlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Availability', required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    bookedAt: { type: Date, default: Date.now },
    cancelledAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);