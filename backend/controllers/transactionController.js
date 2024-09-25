const Transaction = require('../models/transactionModel');
const mongoose = require('mongoose');

const createTransaction = async (req, res) => {
  const { title, amount, type, note } = req.body;

  if (amount < 0) {
    return res.status(400).json({ error: "Amount can't be negative!" });
  }

  let emptyFields = [];
  if (!title) emptyFields.push('title');
  if (!amount) emptyFields.push('amount');

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: 'Please fill in all the fields', emptyFields });
  }

  try {
    const user_id = req.user._id;
    const transaction = await Transaction.create({
      title,
      amount,
      type,
      note,
      user_id,
    });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTransactions = async (req, res) => {
  const user_id = req.user._id;
  const transactions = await Transaction.find({ user_id }).sort({
    createdAt: -1,
  });

  res.status(200).json(transactions);
};

const getTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such transaction' });
  }

  const transaction = await Transaction.findById(id);

  if (!transaction) {
    return res.status(404).json({ error: 'No such transaction' });
  }

  res.status(200).json(transaction);
};

const updateTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No such transaction' });
  }

  const transaction = await Transaction.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!transaction) {
    return res.status(400).json({ error: 'No such transaction' });
  }

  res.status(200).json(transaction);
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No such transaction' });
  }

  const transaction = await Transaction.findOneAndDelete({ _id: id });

  if (!transaction) {
    return res.status(400).json({ error: 'No such transaction' });
  }

  res.status(200).json(transaction);
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
