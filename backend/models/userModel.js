const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.signup = async function (name, email, password) {
  if (!name || !email || !password) {
    throw Error('All fields are required!');
  }

  if (!validator.isAlpha(name)) {
    throw Error('Only first name required!');
  }

  if (!validator.isEmail(email)) {
    throw Error('Email is not valid!');
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('Email already exists!');
  }

  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ name, email, password: hash });

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error('All fields are required!');
  }

  if (!validator.isEmail(email)) {
    throw Error('Email is not valid!');
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error('Incorrect email');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error('Incorrect password!');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
