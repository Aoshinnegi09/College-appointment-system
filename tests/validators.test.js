const test = require('node:test');
const assert = require('node:assert/strict');

const {
  isValidObjectId,
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

test('validateLoginPayload rejects missing password', () => {
  const result = validateLoginPayload({ email: 'student@example.com' });
  assert.equal(result, 'email and password are required');
});

test('validateRegisterPayload rejects invalid role', () => {
  const result = validateRegisterPayload({
    email: 'user@example.com',
    password: 'secret123',
    name: 'User',
    role: 'admin',
  });

  assert.equal(result, 'role must be student or professor');
});

test('validateRegisterPayload rejects short password', () => {
  const result = validateRegisterPayload({
    email: 'user@example.com',
    password: '123',
    name: 'User',
    role: 'student',
  });

  assert.equal(result, 'password must be at least 6 characters');
});

test('validateRegisterPayload rejects missing fields', () => {
  const result = validateRegisterPayload({
    email: 'user@example.com',
    password: 'secret123',
    role: 'student',
  });

  assert.equal(result, 'email, password, name, and role are required');
});

test('validateTimeSlot rejects inverted date range', () => {
  const result = validateTimeSlot({
    startTime: '2026-01-01T11:00:00.000Z',
    endTime: '2026-01-01T10:00:00.000Z',
  });

  assert.equal(result, 'startTime must be earlier than endTime');
});

test('validateTimeSlot rejects invalid date values', () => {
  const result = validateTimeSlot({
    startTime: 'not-a-date',
    endTime: '2026-01-01T10:00:00.000Z',
  });

  assert.equal(result, 'Invalid date format');
});

test('isValidObjectId returns false for malformed id', () => {
  assert.equal(isValidObjectId('invalid-id'), false);
});
