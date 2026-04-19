const Availability = require('../models/Availability');
const { isValidObjectId, validateTimeSlot } = require('../utils/validators');

const setAvailability = async (req, res) => {
  const validationError = validateTimeSlot(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const { startTime, endTime } = req.body;

  const overlap = await Availability.findOne({
    professorId: req.user._id,
    startTime: { $lt: new Date(endTime) },
    endTime: { $gt: new Date(startTime) },
  });

  if (overlap) {
    return res.status(409).json({ message: 'Time slot overlaps with an existing slot' });
  }

  const slot = await Availability.create({
    professorId: req.user._id,
    startTime,
    endTime,
  });

  return res.status(201).json({ message: 'Availability created', slot });
};

const getProfessorAvailability = async (req, res) => {
  const { professorId } = req.params;

  if (!isValidObjectId(professorId)) {
    return res.status(400).json({ message: 'Invalid professorId' });
  }

  const slots = await Availability.find({ professorId, isBooked: false }).sort({ startTime: 1 });
  return res.status(200).json({ slots });
};

const updateAvailability = async (req, res) => {
  const { slotId } = req.params;

  if (!isValidObjectId(slotId)) {
    return res.status(400).json({ message: 'Invalid slotId' });
  }

  const validationError = validateTimeSlot(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const slot = await Availability.findOne({ _id: slotId, professorId: req.user._id });

  if (!slot) {
    return res.status(404).json({ message: 'Slot not found' });
  }

  if (slot.isBooked) {
    return res.status(400).json({ message: 'Booked slot cannot be updated' });
  }

  const { startTime, endTime } = req.body;

  const overlap = await Availability.findOne({
    _id: { $ne: slotId },
    professorId: req.user._id,
    startTime: { $lt: new Date(endTime) },
    endTime: { $gt: new Date(startTime) },
  });

  if (overlap) {
    return res.status(409).json({ message: 'Time slot overlaps with an existing slot' });
  }

  slot.startTime = startTime;
  slot.endTime = endTime;
  await slot.save();

  return res.status(200).json({ message: 'Availability updated', slot });
};

const deleteAvailability = async (req, res) => {
  const { slotId } = req.params;

  if (!isValidObjectId(slotId)) {
    return res.status(400).json({ message: 'Invalid slotId' });
  }

  const slot = await Availability.findOne({ _id: slotId, professorId: req.user._id });

  if (!slot) {
    return res.status(404).json({ message: 'Slot not found' });
  }

  if (slot.isBooked) {
    return res.status(400).json({ message: 'Booked slot cannot be deleted' });
  }

  await slot.deleteOne();
  return res.status(200).json({ message: 'Availability deleted' });
};

module.exports = {
  setAvailability,
  getProfessorAvailability,
  updateAvailability,
  deleteAvailability,
};
