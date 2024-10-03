const mongoose = require('mongoose');

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(process.env.MONGODB_CONNECTION_STRING)
      .then(() => {
        console.log('database connection successful');
      })
      .catch((err) => {
        console.log('database connection error ' + err);
      });
  }
}

module.exports = new Database();
