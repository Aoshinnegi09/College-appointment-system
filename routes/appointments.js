const express = require('express');
const { getAvailableSlots, bookAppointment, getMyAppointments, getAppointmentById, cancelAppointment } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/available', getAvailableSlots);
router.post('/', protect, authorize('student'), bookAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.get('/:appointmentId', getAppointmentById);
router.delete('/:appointmentId', protect, cancelAppointment);

module.exports = router;