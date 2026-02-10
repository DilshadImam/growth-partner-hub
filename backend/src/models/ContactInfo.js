const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  scheduleCallLink: {
    type: String,
    default: '#'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
