const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');
const { authenticateAccessToken } = require('./utils/jwt')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json())

// Import routes
const authRoutes = require('./routes/auth');
const budgetRoutes = require('./routes/budget');
const goalsRoutes = require('./routes/goals');
const incomeRoutes = require('./routes/income');
const investmentsRoutes = require('./routes/investments');
const regularExpensesRoutes = require('./routes/regularExpenses');
const upcomingExpensesRoutes = require('./routes/upcomingExpenses');
const userRoutes = require('./routes/user');
const creditCardsRoutes = require('./routes/creditCards');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/budget', authenticateAccessToken, budgetRoutes);
app.use('/api/goals', authenticateAccessToken, goalsRoutes);
app.use('/api/income', authenticateAccessToken, incomeRoutes);
app.use('/api/investments', authenticateAccessToken, investmentsRoutes);
app.use('/api/regular-expenses', authenticateAccessToken, regularExpensesRoutes);
app.use('/api/upcoming-expenses', authenticateAccessToken, upcomingExpensesRoutes);
app.use('/api/user', authenticateAccessToken, userRoutes);
app.use('/api/creditCards', creditCardsRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://${process.env.HOST}:${process.env.PORT}/`);
});

