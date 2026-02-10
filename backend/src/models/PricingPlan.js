const mongoose = require('mongoose');

const pricingPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true
  },
  period: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'Zap'
  },
  popular: {
    type: Boolean,
    default: false
  },
  features: [{
    type: String
  }],
  cta: {
    type: String,
    default: 'Get Started'
  },
  color: {
    type: String,
    default: 'from-mono-50/80 to-mono-100/60'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PricingPlan', pricingPlanSchema);
