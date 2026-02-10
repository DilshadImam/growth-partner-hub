const express = require('express');
const router = express.Router();

/**
 * @route   POST /api/analytics/track-visitor
 * @desc    Track website visitor
 * @access  Public
 */
router.post('/track-visitor', async (req, res) => {
  try {
    const { visitorId, timestamp, userAgent, language, screenResolution, referrer, currentPage } = req.body;
    const Lead = require('../models/Lead');

    // Check if this visitor already has a lead (by visitorId in metadata)
    const existingLead = await Lead.findOne({ 
      'metadata.visitorId': visitorId,
      'metadata.visitorType': 'anonymous'
    });

    if (existingLead) {
      // Update existing lead with new visit info
      existingLead.metadata.lastVisit = timestamp;
      existingLead.metadata.visitCount = (existingLead.metadata.visitCount || 1) + 1;
      existingLead.metadata.pages = existingLead.metadata.pages || [];
      
      // Add current page if not already in the list
      if (!existingLead.metadata.pages.includes(currentPage)) {
        existingLead.metadata.pages.push(currentPage);
      }
      
      existingLead.message = `Visited ${existingLead.metadata.visitCount} times\nLast visit: ${currentPage}\nPages: ${existingLead.metadata.pages.join(', ')}\nDevice: ${screenResolution}`;
      
      await existingLead.save();
      
      console.log(`✅ Updated existing visitor lead: ${existingLead._id}`);
      
      return res.status(200).json({
        success: true,
        message: 'Visitor updated',
        leadId: existingLead._id
      });
    }

    // Generate unique visitor email
    const visitorEmail = `visitor${Date.now()}@anonymous.com`;
    
    // Determine source based on referrer
    let source = 'Direct Visit';
    if (referrer && referrer !== 'Direct') {
      if (referrer.includes('google')) {
        source = 'Other';
      } else if (referrer.includes('facebook') || referrer.includes('instagram')) {
        source = 'Social Media';
      } else {
        source = 'Referral';
      }
    }

    // Create new anonymous lead entry
    const newLead = await Lead.create({
      name: 'Anonymous Visitor',
      email: visitorEmail,
      source: source,
      status: 'New',
      priority: 'Low',
      score: 20,
      message: `First visit: ${currentPage}\nDevice: ${screenResolution}\nLanguage: ${language}`,
      referrer: referrer || 'Direct',
      userAgent: userAgent,
      metadata: {
        visitorId,
        timestamp,
        firstVisit: timestamp,
        lastVisit: timestamp,
        visitCount: 1,
        pages: [currentPage],
        userAgent,
        language,
        screenResolution,
        referrer,
        currentPage,
        visitorType: 'anonymous'
      }
    });

    console.log(`✅ Created new visitor lead: ${newLead._id}`);

    res.status(200).json({
      success: true,
      message: 'Visitor tracked',
      leadId: newLead._id
    });

  } catch (error) {
    console.error('Visitor tracking error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({
      success: false,
      message: 'Tracking failed',
      error: error.message
    });
  }
});

// Placeholder route - implement as needed
router.get('/', (req, res) => {
  res.json({ success: true, data: [] });
});

module.exports = router;
