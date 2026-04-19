const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const { isValidObjectId } = require('../utils/validators');

const getAvailableAppointments = async (req, res) => {
  const filter = { isBooked: false };

  if (req.query.professorId) {
    if (!isValidObjectId(req.query.professorId)) {
      return res.status(400).json({ message: 'Invalid professorId' });
    }

    filter.professorId = req.query.professorId;
  }

  const slots = await Availability.find(filter)
    .populate('professorId', 'name email role')
    .sort({ startTime: 1 });

  return res.status(200).json({ slots });
};

const bookAppointment = async (req, res) => {
  const { availabilitySlotId } = req.body;

  if (!availabilitySlotId || !isValidObjectId(availabilitySlotId)) {
    return res.status(400).json({ message: 'Valid availabilitySlotId is required' });
  }

  const slot = await Availability.findOneAndUpdate(
    { _id: availabilitySlotId, isBooked: false },
    { $set: { isBooked: true } },
    { new: true }
  );

  if (!slot) {
    return res.status(409).json({ message: 'Slot is unavailable or already booked' });
  }

  let appointment;

  try {
    appointment = await Appointment.create({
      studentId: req.user._id,
      professorId: slot.professorId,
      availabilitySlotId: slot._id,
      status: 'pending',
    });
  } catch (error) {
    await Availability.findByIdAndUpdate(slot._id, { isBooked: false });
    throw error;
  }

  const populated = await Appointment.findById(appointment._id)
    .populate('studentId', 'name email role')
    .populate('professorId', 'name email role')
    .populate('availabilitySlotId');

  return res.status(201).json({ message: 'Appointment booked', appointment: populated });
};

const getMyAppointments = async (req, res) => {
  const query = req.user.role === 'professor' ? { professorId: req.user._id } : { studentId: req.user._id };

  const appointments = await Appointment.find(query)
    .populate('studentId', 'name email role')
    .populate('professorId', 'name email role')
    .populate('availabilitySlotId')
    .sort({ bookedAt: -1 });

  return res.status(200).json({ appointments });
};

const getAppointmentById = async (req, res) => {
  const { appointmentId } = req.params;

  if (!isValidObjectId(appointmentId)) {
    return res.status(400).json({ message: 'Invalid appointmentId' });
  }

  const appointment = await Appointment.findById(appointmentId)
    .populate('studentId', 'name email role')
    .populate('professorId', 'name email role')
    .populate('availabilitySlotId');

  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  const isProfessorOwner =
    req.user.role === 'professor' && appointment.professorId._id.toString() === req.user._id.toString();
  const isStudentOwner =
    req.user.role === 'student' && appointment.studentId._id.toString() === req.user._id.toString();

  if (!isProfessorOwner && !isStudentOwner) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return res.status(200).json({ appointment });
};

const cancelAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  if (!isValidObjectId(appointmentId)) {
    return res.status(400).json({ message: 'Invalid appointmentId' });
  }

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  const isProfessorOwner =
    req.user.role === 'professor' && appointment.professorId.toString() === req.user._id.toString();
  const isStudentOwner =
    req.user.role === 'student' && appointment.studentId.toString() === req.user._id.toString();

  if (!isProfessorOwner && !isStudentOwner) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (appointment.status === 'cancelled') {
    return res.status(400).json({ message: 'Appointment already cancelled' });
  }

  appointment.status = 'cancelled';
  appointment.cancelledAt = new Date();
  await appointment.save();

  await Availability.findByIdAndUpdate(appointment.availabilitySlotId, { isBooked: false });

  return res.status(200).json({ message: 'Appointment cancelled', appointment });
};

const listAppointments = async (req, res) => {
  const appointments = await Appointment.find({ professorId: req.user._id })
    .populate('studentId', 'name email role')
    .populate('professorId', 'name email role')
    .populate('availabilitySlotId')
    .sort({ bookedAt: -1 });

  return res.status(200).json({ appointments });
};

module.exports = {
  getAvailableAppointments,
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  listAppointments,
};
