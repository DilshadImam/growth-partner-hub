const mongoose = require('mongoose');

const showcaseImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an image title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  link: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  cloudinaryPublicId: {
    type: String,
    required: false
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
showcaseImageSchema.index({ order: 1, isActive: 1 });

module.exports = mongoose.model('ShowcaseImage', showcaseImageSchema);
