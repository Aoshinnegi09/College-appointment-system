const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegisterPayload, validateLoginPayload } = require('../utils/validators');

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required in environment variables');
  }

  return process.env.JWT_SECRET;
};

const createToken = (id, role) =>
  jwt.sign({ id, role }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

const register = async (req, res) => {
  const validationError = validateRegisterPayload(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const { email, password, name, role } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const user = await User.create({ email, password, name, role });

  return res.status(201).json({
    message: 'User registered successfully',
    token: createToken(user._id, user.role),
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

const login = async (req, res) => {
  const validationError = validateLoginPayload(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.status(200).json({
    token: createToken(user._id, user.role),
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

const profile = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

module.exports = {
  register,
  login,
  profile,
};
