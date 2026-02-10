const mongoose = require('mongoose');

const heroStatsSchema = new mongoose.Schema({
  stats: [{
    icon: {
      type: String,
      required: true,
      enum: ['Users', 'TrendingUp', 'Sparkles'],
      default: 'Users'
    },
    value: {
      type: String,
      required: true,
      trim: true
    },
    label: {
      type: String,
      required: true,
      trim: true
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('HeroStats', heroStatsSchema);
