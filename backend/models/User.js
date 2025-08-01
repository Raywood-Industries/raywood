const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  email: { type: String, required: true },
});

module.exports = mongoose.model('UserIDs', usersSchema); 