const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'sales', 'marketing', 'visitor', 'user'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    enum: ['Sales', 'Marketing', 'Operations', 'Management'],
    default: 'Sales'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  permissions: [{
    type: String,
    enum: [
      'view_leads',
      'create_leads',
      'edit_leads',
      'delete_leads',
      'view_analytics',
      'manage_users',
      'manage_content',
      'manage_services',
      'view_reports'
    ]
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance (email index already defined in schema)
userSchema.index({ role: 1 });

// Virtual for assigned leads count
userSchema.virtual('assignedLeadsCount', {
  ref: 'Lead',
  localField: '_id',
  foreignField: 'assignedTo',
  count: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has permission
userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission) || this.role === 'admin';
};

// Set default permissions based on role
userSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('role')) {
    const rolePermissions = {
      admin: [
        'view_leads', 'create_leads', 'edit_leads', 'delete_leads',
        'view_analytics', 'manage_users', 'manage_content', 
        'manage_services', 'view_reports'
      ],
      manager: [
        'view_leads', 'create_leads', 'edit_leads',
        'view_analytics', 'manage_content', 'view_reports'
      ],
      sales: [
        'view_leads', 'create_leads', 'edit_leads'
      ],
      marketing: [
        'view_leads', 'create_leads', 'view_analytics', 'manage_content'
      ],
      visitor: [],
      user: []
    };
    
    this.permissions = rolePermissions[this.role] || [];
  }
  next();
});

module.exports = mongoose.model('User', userSchema);