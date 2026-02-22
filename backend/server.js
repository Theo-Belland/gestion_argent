const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);

const app = express();


// Middleware CORS (autorise explicitement le domaine frontend et localhost)
app.use(cors({
  origin: [
    'https://geretonbudget.theobelland.fr',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/incomes', require('./routes/incomes'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/savings', require('./routes/savings'));
app.use('/api/credits', require('./routes/credits'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/metrics', require('./routes/metrics'));
app.use('/api/blog', require('./routes/blog'));

app.use('/api/goals', require('./routes/goals'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/notifications', require('./routes/notifications'));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
