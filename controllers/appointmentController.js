const Appointment = require('../models/appointment');
const Availability = require('../models/availability');

exports.getAvailableSlots = async (req, res) => {
    try {
        const { professorId } = req.query;
        const query = { isBooked: false };
        if (professorId) query.professorId = professorId;
        const slots = await Availability.find(query).populate('professorId', 'name email');
        res.json({ success: true, slots });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.bookAppointment = async (req, res) => {
    try {
        const { availabilitySlotId } = req.body;
        const slot = await Availability.findById(availabilitySlotId);
        if (slot.isBooked) return res.status(400).json({ success: false, message: 'Slot already booked' });
        
        const appointment = await Appointment.create({
            studentId: req.user.id,
            professorId: slot.professorId,
            availabilitySlotId,
            status: 'confirmed'
        });
        slot.isBooked = true;
        await slot.save();
        res.status(201).json({ success: true, appointment });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ 
            $or: [{ studentId: req.user.id }, { professorId: req.user.id }] 
        }).populate('studentId professorId availabilitySlotId');
        res.json({ success: true, appointments });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId)
            .populate('studentId professorId availabilitySlotId');
        res.json({ success: true, appointment });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const appointment = await Appointment.findById(appointmentId);
        appointment.status = 'cancelled';
        appointment.cancelledAt = new Date();
        await appointment.save();
        
        const slot = await Availability.findById(appointment.availabilitySlotId);
        slot.isBooked = false;
        await slot.save();
        res.json({ success: true, message: 'Appointment cancelled' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};