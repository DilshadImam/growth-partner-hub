const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const Lead = require('../models/Lead');
const emailService = require('../services/emailService');
const router = express.Router();

// Rate limiting for contact form (stricter than general API)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: {
    success: false,
    message: 'Too many contact form submissions. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules for contact form
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .escape(),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Company name cannot exceed 200 characters')
    .escape(),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
    .escape(),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters')
    .escape(),
  body('servicesInterested')
    .optional()
    .isArray()
    .withMessage('Services interested must be an array'),
  body('budget')
    .optional()
    .isIn(['Under $5K', '$5K-$15K', '$15K-$30K', '$30K-$50K', '$50K+', 'Not sure'])
    .withMessage('Invalid budget range'),
  body('timeline')
    .optional()
    .isIn(['ASAP', '1-3 months', '3-6 months', '6+ months', 'Just exploring'])
    .withMessage('Invalid timeline'),
  body('industry')
    .optional()
    .isIn(['Retail', 'SaaS', 'Local Services', 'E-commerce', 'Healthcare', 'Education', 'Real Estate', 'Other'])
    .withMessage('Invalid industry'),
  body('businessStage')
    .optional()
    .isIn(['Startup', 'Growing SME', 'Established Business', 'Enterprise'])
    .withMessage('Invalid business stage')
];

// @route   POST /api/contact
// @desc    Handle contact form submission
// @access  Public
router.post('/', contactLimiter, contactValidation, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please check your form data',
        errors: errors.array()
      });
    }

    const {
      name,
      email,
      phone,
      company,
      message,
      subject,
      servicesInterested,
      budget,
      timeline,
      industry,
      businessStage,
      utmSource,
      utmMedium,
      utmCampaign
    } = req.body;

    // Check for existing lead with same email
    let existingLead = await Lead.findOne({ email });
    
    if (existingLead) {
      // Update existing lead with new information
      existingLead.name = name;
      if (phone) existingLead.phone = phone;
      if (company) existingLead.company = company;
      if (industry) existingLead.industry = industry;
      if (businessStage) existingLead.businessStage = businessStage;
      if (servicesInterested) existingLead.servicesInterested = servicesInterested;
      if (budget) existingLead.budget = budget;
      if (timeline) existingLead.timeline = timeline;
      
      // Add new message as a note
      existingLead.notes.push({
        content: `New contact form submission: ${message}`,
        addedAt: new Date()
      });
      
      // Update tracking data
      existingLead.utmSource = utmSource || existingLead.utmSource;
      existingLead.utmMedium = utmMedium || existingLead.utmMedium;
      existingLead.utmCampaign = utmCampaign || existingLead.utmCampaign;
      existingLead.lastContactDate = new Date();
      
      await existingLead.save();
      
      // Send updated lead notification
      try {
        await emailService.sendLeadUpdateNotification(existingLead, message);
      } catch (emailError) {
        console.error('Failed to send lead update notification:', emailError);
      }
      
      return res.status(200).json({
        success: true,
        message: 'Thank you for your message! We\'ll get back to you soon.',
        data: {
          leadId: existingLead._id,
          isExisting: true
        }
      });
    }

    // Create new lead
    const trackingData = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer'),
      utmSource,
      utmMedium,
      utmCampaign
    };

    const leadData = {
      name,
      email,
      phone,
      company,
      message,
      industry: industry || 'Other',
      businessStage: businessStage || 'Startup',
      servicesInterested: servicesInterested || [],
      budget: budget || 'Not sure',
      timeline: timeline || 'Just exploring',
      source: 'Website Contact Form',
      ...trackingData
    };

    const newLead = new Lead(leadData);
    await newLead.save();

    // Send notification emails
    try {
      await Promise.all([
        emailService.sendLeadNotification(newLead, subject),
        emailService.sendLeadConfirmation(newLead)
      ]);
    } catch (emailError) {
      console.error('Failed to send contact form emails:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
      data: {
        leadId: newLead._id,
        isExisting: false,
        score: newLead.score
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again or contact us directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/contact/consultation
// @desc    Handle free consultation booking
// @access  Public
router.post('/consultation', contactLimiter, [
  body('name').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('phone').optional().trim().matches(/^[\+]?[1-9][\d]{0,15}$/),
  body('company').optional().trim().isLength({ max: 200 }).escape(),
  body('preferredDate').optional().isISO8601().toDate(),
  body('preferredTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('timezone').optional().trim(),
  body('goals').optional().trim().isLength({ max: 500 }).escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please check your booking details',
        errors: errors.array()
      });
    }

    const {
      name,
      email,
      phone,
      company,
      preferredDate,
      preferredTime,
      timezone,
      goals
    } = req.body;

    // Create lead with consultation request
    const trackingData = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer')
    };

    const leadData = {
      name,
      email,
      phone,
      company,
      message: `Free consultation request. Goals: ${goals || 'Not specified'}`,
      source: 'Free Consultation',
      priority: 'High', // Consultation requests are high priority
      status: 'New',
      ...trackingData
    };

    // Add consultation-specific data as notes
    const consultationDetails = {
      preferredDate: preferredDate ? new Date(preferredDate).toLocaleDateString() : 'Flexible',
      preferredTime: preferredTime || 'Flexible',
      timezone: timezone || 'Not specified',
      goals: goals || 'Not specified'
    };

    leadData.notes = [{
      content: `Consultation booking details: ${JSON.stringify(consultationDetails, null, 2)}`,
      addedAt: new Date()
    }];

    const lead = new Lead(leadData);
    await lead.save();

    // Send consultation booking emails
    try {
      await Promise.all([
        emailService.sendConsultationNotification(lead, consultationDetails),
        emailService.sendConsultationConfirmation(lead, consultationDetails)
      ]);
    } catch (emailError) {
      console.error('Failed to send consultation emails:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Consultation request received! We\'ll contact you within 2 hours to schedule your free session.',
      data: {
        leadId: lead._id,
        consultationDetails
      }
    });

  } catch (error) {
    console.error('Consultation booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error booking your consultation. Please try again or contact us directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/contact/newsletter
// @desc    Newsletter subscription
// @access  Public
router.post('/newsletter', rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Too many newsletter subscription attempts' }
}), [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('name').optional().trim().isLength({ max: 100 }).escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
        errors: errors.array()
      });
    }

    const { email, name } = req.body;

    // Check if already subscribed
    const existingLead = await Lead.findOne({ email });
    
    if (existingLead) {
      // Add newsletter subscription note
      existingLead.notes.push({
        content: 'Subscribed to newsletter',
        addedAt: new Date()
      });
      await existingLead.save();
    } else {
      // Create minimal lead for newsletter subscriber
      const leadData = {
        name: name || 'Newsletter Subscriber',
        email,
        source: 'Newsletter Subscription',
        message: 'Newsletter subscription',
        status: 'Nurturing',
        ipAddress: req.ip || req.connection.remoteAddress
      };

      const lead = new Lead(leadData);
      await lead.save();
    }

    // Send welcome email
    try {
      await emailService.sendNewsletterWelcome(email, name);
    } catch (emailError) {
      console.error('Failed to send newsletter welcome email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to our newsletter!'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;