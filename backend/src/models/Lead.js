const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  // Contact Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{9,15}$/, 'Please enter a valid phone number (10-16 digits)']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  
  // Business Information
  industry: {
    type: String,
    enum: ['Retail', 'SaaS', 'Local Services', 'E-commerce', 'Healthcare', 'Education', 'Real Estate', 'Other'],
    default: 'Other'
  },
  businessStage: {
    type: String,
    enum: ['Startup', 'Growing SME', 'Established Business', 'Enterprise'],
    default: 'Startup'
  },
  monthlyRevenue: {
    type: String,
    enum: ['Under $10K', '$10K-$50K', '$50K-$100K', '$100K-$500K', '$500K+', 'Prefer not to say'],
    default: 'Prefer not to say'
  },
  
  // Service Interest
  servicesInterested: [{
    type: String,
    enum: ['Web Development', 'Lead Generation', 'Online Advertising', 'Business Scaling', 'Sales Boosting']
  }],
  budget: {
    type: String,
    enum: ['Under $5K', '$5K-$15K', '$15K-$30K', '$30K-$50K', '$50K+', 'Not sure'],
    default: 'Not sure'
  },
  timeline: {
    type: String,
    enum: ['ASAP', '1-3 months', '3-6 months', '6+ months', 'Just exploring'],
    default: 'Just exploring'
  },
  
  // Lead Details
  message: {
    type: String,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  source: {
    type: String,
    enum: ['Website Contact Form', 'Free Consultation', 'WhatsApp', 'Phone Call', 'Referral', 'Social Media', 'Website Registration', 'Direct Visit', 'Other'],
    default: 'Website Contact Form'
  },
  
  // Lead Scoring & Status
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiating', 'Won', 'Lost', 'Nurturing'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  
  // Assignment & Follow-up
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  nextFollowUp: {
    type: Date
  },
  lastContactDate: {
    type: Date
  },
  
  // Tracking & Analytics
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,
  referrer: String,
  ipAddress: String,
  userAgent: String,
  
  // Notes & Communication
  notes: [{
    content: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Conversion Tracking
  convertedToClient: {
    type: Boolean,
    default: false
  },
  conversionDate: Date,
  dealValue: {
    type: Number,
    min: 0
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ score: -1 });
leadSchema.index({ assignedTo: 1 });

// Virtual for lead age in days
leadSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to calculate lead score
leadSchema.methods.calculateScore = function() {
  let score = 0;
  
  // Business stage scoring
  const stageScores = {
    'Startup': 20,
    'Growing SME': 40,
    'Established Business': 60,
    'Enterprise': 80
  };
  score += stageScores[this.businessStage] || 0;
  
  // Budget scoring
  const budgetScores = {
    'Under $5K': 10,
    '$5K-$15K': 25,
    '$15K-$30K': 40,
    '$30K-$50K': 60,
    '$50K+': 80,
    'Not sure': 15
  };
  score += budgetScores[this.budget] || 0;
  
  // Timeline urgency
  const timelineScores = {
    'ASAP': 30,
    '1-3 months': 25,
    '3-6 months': 15,
    '6+ months': 5,
    'Just exploring': 5
  };
  score += timelineScores[this.timeline] || 0;
  
  // Services interested (more services = higher intent)
  score += this.servicesInterested.length * 5;
  
  // Company provided (shows seriousness)
  if (this.company) score += 10;
  
  // Phone provided (higher intent)
  if (this.phone) score += 15;
  
  // Message length (detailed message = higher intent)
  if (this.message && this.message.length > 100) score += 10;
  
  this.score = Math.min(score, 100); // Cap at 100
  return this.score;
};

// Pre-save middleware to calculate score
leadSchema.pre('save', function(next) {
  if (this.isNew || this.isModified(['businessStage', 'budget', 'timeline', 'servicesInterested', 'company', 'phone', 'message'])) {
    this.calculateScore();
  }
  next();
});

module.exports = mongoose.model('Lead', leadSchema);