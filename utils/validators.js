const mongoose = require('mongoose');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const validateRegisterPayload = ({ email, password, name, role }) => {
  if (!email || !password || !name || !role) {
    return 'email, password, name, and role are required';
  }

  if (!['student', 'professor'].includes(role)) {
    return 'role must be student or professor';
  }

  if (password.length < 6) {
    return 'password must be at least 6 characters';
  }

  return null;
};

const validateLoginPayload = ({ email, password }) => {
  if (!email || !password) {
    return 'email and password are required';
  }

  return null;
};

const validateTimeSlot = ({ startTime, endTime }) => {
  if (!startTime || !endTime) {
    return 'startTime and endTime are required';
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Invalid date format';
  }

  if (start >= end) {
    return 'startTime must be earlier than endTime';
  }

  return null;
};

module.exports = {
  isValidObjectId,
  validateRegisterPayload,
  validateLoginPayload,
  validateTimeSlot,
};
