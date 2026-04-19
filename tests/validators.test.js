const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validateRegisterPayload,
  validateLoginPayload,
  validateTimeSlot,
} = require('../utils/validators');

test('validateRegisterPayload returns null for valid payload', () => {
  const result = validateRegisterPayload({
    email: 'student@example.com',
    password: 'secret123',
    name: 'Student One',
    role: 'student',
  });

  assert.equal(result, null);
});

test('validateLoginPayload requires credentials', () => {
  const result = validateLoginPayload({ email: '' });
  assert.equal(result, 'email and password are required');
});

test('validateTimeSlot rejects inverted date range', () => {
  const result = validateTimeSlot({
    startTime: '2026-01-01T11:00:00.000Z',
    endTime: '2026-01-01T10:00:00.000Z',
  });

  assert.equal(result, 'startTime must be earlier than endTime');
});
