const express = require('express');
const {
  setAvailability,
  getProfessorAvailability,
  updateAvailability,
  deleteAvailability,
} = require('../controllers/availabilityController');
const { auth, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, authorizeRoles('professor'), setAvailability);
router.get('/:professorId', getProfessorAvailability);
router.put('/:slotId', auth, authorizeRoles('professor'), updateAvailability);
router.delete('/:slotId', auth, authorizeRoles('professor'), deleteAvailability);

module.exports = router;
