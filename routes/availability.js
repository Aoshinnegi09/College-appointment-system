const express = require('express');
const { createSlot, getSlots, updateSlot, deleteSlot } = require('../controllers/availabilityController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('professor'), createSlot);
router.get('/:professorId', getSlots);
router.put('/:slotId', protect, authorize('professor'), updateSlot);
router.delete('/:slotId', protect, authorize('professor'), deleteSlot);

module.exports = router;