const express = require('express');
const { body, validationResult } = require('express-validator');
const Lead = require('../models/Lead');
const { protect, auth } = require('../middleware/auth');
const permission = require('../middleware/permission');
const emailService = require('../services/emailService');
const router = express.Router();

// Validation rules for lead creation
const leadValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Company name cannot exceed 200 characters'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters')
];

// @route   POST /api/leads
// @desc    Create a new lead (public endpoint)
// @access  Public
router.post('/', leadValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check for duplicate email
    const existingLead = await Lead.findOne({ email: req.body.email });
    if (existingLead) {
      return res.status(409).json({
        success: false,
        message: 'A lead with this email already exists'
      });
    }

    // Extract tracking data from headers
    const trackingData = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer'),
      utmSource: req.body.utmSource,
      utmMedium: req.body.utmMedium,
      utmCampaign: req.body.utmCampaign
    };

    // Create new lead
    const leadData = {
      ...req.body,
      ...trackingData,
      source: req.body.source || 'Website Contact Form'
    };

    const lead = new Lead(leadData);
    await lead.save();

    // Send notification email to business
    try {
      await emailService.sendLeadNotification(lead);
    } catch (emailError) {
      console.error('Failed to send lead notification email:', emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to lead
    try {
      await emailService.sendLeadConfirmation(lead);
    } catch (emailError) {
      console.error('Failed to send lead confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: {
        id: lead._id,
        name: lead.name,
        email: lead.email,
        score: lead.score,
        status: lead.status
      }
    });

  } catch (error) {
    console.error('Lead creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create lead',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/leads
// @desc    Get all leads with filtering and pagination
// @access  Public (temporarily for testing)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 100,
      status,
      priority,
      industry,
      businessStage,
      assignedTo,
      source,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (industry) filter.industry = industry;
    if (businessStage) filter.businessStage = businessStage;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (source) filter.source = source;
    
    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('assignedTo', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Lead.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: leads,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/leads/:id
// @desc    Get single lead by ID
// @access  Private (requires view_leads permission)
router.get('/:id', auth, permission('view_leads'), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      data: lead
    });

  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lead',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/leads/:id
// @desc    Update lead
// @access  Private (requires edit_leads permission)
router.put('/:id', auth, permission('edit_leads'), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Update fields
    const allowedUpdates = [
      'status', 'priority', 'assignedTo', 'nextFollowUp',
      'businessStage', 'industry', 'servicesInterested',
      'budget', 'timeline', 'phone', 'company'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        lead[field] = req.body[field];
      }
    });

    // Update last contact date if status changed to contacted
    if (req.body.status === 'Contacted' && lead.status !== 'Contacted') {
      lead.lastContactDate = new Date();
    }

    await lead.save();

    res.json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });

  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lead',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/leads/:id/notes
// @desc    Add note to lead
// @access  Private (requires edit_leads permission)
router.post('/:id/notes', auth, permission('edit_leads'), async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }

    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    lead.notes.push({
      content: content.trim(),
      addedBy: req.user.id,
      addedAt: new Date()
    });

    await lead.save();

    // Populate the new note
    await lead.populate('notes.addedBy', 'name');

    res.json({
      success: true,
      message: 'Note added successfully',
      data: lead.notes[lead.notes.length - 1]
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/leads/:id
// @desc    Soft delete lead
// @access  Private (requires delete_leads permission)
router.delete('/:id', auth, permission('delete_leads'), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    lead.isActive = false;
    await lead.save();

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });

  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/leads/stats/overview
// @desc    Get lead statistics overview
// @access  Private (requires view_analytics permission)
router.get('/stats/overview', auth, permission('view_analytics'), async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const [
      totalLeads,
      newLeads,
      qualifiedLeads,
      convertedLeads,
      averageScore,
      leadsByStatus,
      leadsBySource,
      topPerformers
    ] = await Promise.all([
      Lead.countDocuments({ isActive: true }),
      Lead.countDocuments({ 
        isActive: true, 
        createdAt: { $gte: startDate } 
      }),
      Lead.countDocuments({ 
        isActive: true, 
        status: { $in: ['Qualified', 'Proposal Sent', 'Negotiating'] } 
      }),
      Lead.countDocuments({ 
        isActive: true, 
        convertedToClient: true 
      }),
      Lead.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, avgScore: { $avg: '$score' } } }
      ]),
      Lead.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Lead.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$source', count: { $sum: 1 } } }
      ]),
      Lead.aggregate([
        { $match: { isActive: true, assignedTo: { $exists: true } } },
        { $group: { 
          _id: '$assignedTo', 
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
          converted: { $sum: { $cond: ['$convertedToClient', 1, 0] } }
        }},
        { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }},
        { $sort: { converted: -1, avgScore: -1 } },
        { $limit: 5 }
      ])
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalLeads,
          newLeads,
          qualifiedLeads,
          convertedLeads,
          averageScore: averageScore[0]?.avgScore || 0,
          conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0
        },
        distribution: {
          byStatus: leadsByStatus,
          bySource: leadsBySource
        },
        topPerformers,
        timeframe
      }
    });

  } catch (error) {
    console.error('Get lead stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lead statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;