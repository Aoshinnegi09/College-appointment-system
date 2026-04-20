const Availability = require('../models/availability');

exports.createSlot = async (req, res) => {
    try {
        const { startTime, endTime } = req.body;
        const slot = await Availability.create({ professorId: req.user.id, startTime, endTime });
        res.status(201).json({ success: true, slot });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getSlots = async (req, res) => {
    try {
        const { professorId } = req.params;
        const slots = await Availability.find({ professorId }).populate('professorId', 'name email');
        res.json({ success: true, slots });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateSlot = async (req, res) => {
    try {
        const { slotId } = req.params;
        const slot = await Availability.findByIdAndUpdate(slotId, req.body, { new: true });
        res.json({ success: true, slot });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteSlot = async (req, res) => {
    try {
        const { slotId } = req.params;
        await Availability.findByIdAndDelete(slotId);
        res.json({ success: true, message: 'Slot deleted' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};