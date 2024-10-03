const path = require('path');
const express = require('express');
const app = require('./src/app');

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
