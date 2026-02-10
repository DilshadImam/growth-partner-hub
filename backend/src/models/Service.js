const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [100, 'Service title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  features: [{
    type: String,
    trim: true
  }],
  icon: {
    type: String,
    default: 'Briefcase'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ order: 1 });

module.exports = mongoose.model('Service', serviceSchema);
