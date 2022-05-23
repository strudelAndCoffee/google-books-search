const mongoose = require('mongoose');

// og = mongodb://localhost/googlebooks
// different = mongodb://127.0.0.1:27017/googlebooks

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;