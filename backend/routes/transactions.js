const express = require('express');
const {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();
router.use(requireAuth);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/:id', getTransaction);
router.patch('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
