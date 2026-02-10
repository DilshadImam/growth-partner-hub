const mongoose = require('mongoose');

const caseStudySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Case study title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  // Client Information
  client: {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      maxlength: [100, 'Client name cannot exceed 100 characters']
    },
    industry: {
      type: String,
      required: [true, 'Client industry is required'],
      enum: ['Retail', 'SaaS', 'Local Services', 'E-commerce', 'Healthcare', 'Education', 'Real Estate', 'Other']
    },
    size: {
      type: String,
      enum: ['Startup', 'Small Business', 'Medium Business', 'Enterprise'],
      default: 'Small Business'
    },
    location: String,
    website: String,
    logo: String
  },
  
  // Project Overview
  summary: {
    type: String,
    required: [true, 'Case study summary is required'],
    maxlength: [300, 'Summary cannot exceed 300 characters']
  },
  challenge: {
    type: String,
    required: [true, 'Challenge description is required'],
    maxlength: [1000, 'Challenge cannot exceed 1000 characters']
  },
  solution: {
    type: String,
    required: [true, 'Solution description is required'],
    maxlength: [1500, 'Solution cannot exceed 1500 characters']
  },
  
  // Services Provided
  servicesProvided: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    description: String
  }],
  
  // Project Timeline
  duration: {
    type: String,
    required: [true, 'Project duration is required'],
    enum: ['1-2 weeks', '2-4 weeks', '1-2 months', '2-3 months', '3-6 months', '6+ months']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  
  // Results & Metrics
  results: {
    primary: [{
      metric: {
        type: String,
        required: true,
        maxlength: [100, 'Metric name cannot exceed 100 characters']
      },
      before: {
        type: String,
        required: true
      },
      after: {
        type: String,
        required: true
      },
      improvement: {
        type: String,
        required: true
      },
      unit: {
        type: String,
        enum: ['%', '$', 'leads', 'visitors', 'conversions', 'sales', 'other'],
        default: '%'
      }
    }],
    secondary: [{
      metric: String,
      value: String,
      description: String
    }]
  },
  
  // Key Achievements
  achievements: [{
    type: String,
    maxlength: [200, 'Achievement cannot exceed 200 characters']
  }],
  
  // Process & Methodology
  methodology: [{
    phase: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      maxlength: [500, 'Phase description cannot exceed 500 characters']
    },
    duration: String,
    deliverables: [String]
  }],
  
  // Tools & Technologies Used
  toolsUsed: [{
    category: {
      type: String,
      enum: ['Analytics', 'Marketing', 'Development', 'Design', 'CRM', 'Other']
    },
    tools: [String]
  }],
  
  // Media & Assets
  featuredImage: {
    url: String,
    alt: String,
    caption: String
  },
  images: [{
    url: String,
    alt: String,
    caption: String,
    type: {
      type: String,
      enum: ['before', 'after', 'process', 'result', 'other'],
      default: 'other'
    }
  }],
  video: {
    url: String,
    thumbnail: String,
    title: String,
    description: String
  },
  
  // Client Testimonial
  testimonial: {
    quote: {
      type: String,
      maxlength: [500, 'Testimonial quote cannot exceed 500 characters']
    },
    author: {
      name: String,
      position: String,
      company: String,
      avatar: String
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // SEO & Marketing
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  keywords: [String],
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  inquiriesGenerated: {
    type: Number,
    default: 0
  },
  
  // Status & Visibility
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  
  // Publishing
  publishedAt: Date,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
caseStudySchema.index({ slug: 1 });
caseStudySchema.index({ status: 1 });
caseStudySchema.index({ 'client.industry': 1 });
caseStudySchema.index({ isFeatured: 1 });
caseStudySchema.index({ publishedAt: -1 });

// Virtual for project duration in days
caseStudySchema.virtual('projectDurationDays').get(function() {
  if (!this.endDate) return null;
  return Math.floor((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Virtual for ROI calculation
caseStudySchema.virtual('roi').get(function() {
  const revenueResult = this.results.primary.find(r => r.unit === '$');
  if (!revenueResult) return null;
  
  const before = parseFloat(revenueResult.before.replace(/[^0-9.-]+/g, ''));
  const after = parseFloat(revenueResult.after.replace(/[^0-9.-]+/g, ''));
  
  if (before && after && before > 0) {
    return (((after - before) / before) * 100).toFixed(2);
  }
  return null;
});

// Pre-save middleware to generate slug
caseStudySchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Method to increment views
caseStudySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment shares
caseStudySchema.methods.incrementShares = function() {
  this.shares += 1;
  return this.save();
};

// Method to increment inquiries generated
caseStudySchema.methods.incrementInquiries = function() {
  this.inquiriesGenerated += 1;
  return this.save();
};

module.exports = mongoose.model('CaseStudy', caseStudySchema);