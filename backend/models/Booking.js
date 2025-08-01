const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  email: { type: String, required: true },
});

module.exports = mongoose.model('Booking', bookingSchema); 