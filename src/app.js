const express = require('express');

const dotenv = require('dotenv');
dotenv.config();
const { Database } = require('./config/db');

const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
  res.send('thanks visiting us');
});
module.exports = app;
