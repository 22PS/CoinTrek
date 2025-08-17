const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      throw Error('All fields are required!');
    }

    const exists = await User.findOne({ email });

    if (exists) {
      throw Error('Email already exists!');
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = createToken(user._id);

    res.status(200).json({ name, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw Error('All fields are required!');
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw Error('Incorrect password!');
    }

    const token = createToken(user._id);
    const name = user.name;

    res.status(200).json({ name, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };
