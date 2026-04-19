const express = require('express');
const {
  getAvailableAppointments,
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  listAppointments,
} = require('../controllers/appointmentController');
const { auth, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/available', getAvailableAppointments);
router.post('/', auth, authorizeRoles('student'), bookAppointment);
router.get('/my-appointments', auth, getMyAppointments);
router.get('/:appointmentId', auth, getAppointmentById);
router.delete('/:appointmentId', auth, cancelAppointment);
router.get('/', auth, authorizeRoles('professor'), listAppointments);

module.exports = router;
