const express = require('express');

const dotenv = require('dotenv');
dotenv.config();
const { Database } = require('./config/db');

const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { authRoutes, adminRoutes } = require('./routes');
const { authMiddleware } = require('./middlewares/authMiddleware');
const { roleMiddleware } = require('./middlewares/roleMiddleware ');

const app = express();

// middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', authMiddleware, roleMiddleware(['admin']), adminRoutes);

app.get('/', (req, res) => {
  res.send('thanks visiting us');
});
module.exports = app;
