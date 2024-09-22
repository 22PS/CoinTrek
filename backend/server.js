require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const transactionRoutes = require('./routes/transactions');
const userRoutes = require('./routes/user');
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/transactions', transactionRoutes);
app.use('/api/user', userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
