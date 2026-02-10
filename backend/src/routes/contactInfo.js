const express = require('express');
const router = express.Router();
const ContactInfo = require('../models/ContactInfo');

// Get contact info
router.get('/', async (req, res) => {
  try {
    let contactInfo = await ContactInfo.findOne();
    
    // If no contact info exists, create default
    if (!contactInfo) {
      contactInfo = new ContactInfo({
        email: 'dilshadimam21@gmail.com',
        phone: '+1 (555) 123-4567',
        address: 'San Francisco, CA',
        scheduleCallLink: '#'
      });
      await contactInfo.save();
    }
    
    res.json({
      success: true,
      data: contactInfo
    });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact info'
    });
  }
});

// Update contact info
router.put('/', async (req, res) => {
  try {
    const { email, phone, address, scheduleCallLink } = req.body;
    
    let contactInfo = await ContactInfo.findOne();
    
    if (!contactInfo) {
      contactInfo = new ContactInfo({
        email,
        phone,
        address,
        scheduleCallLink
      });
    } else {
      contactInfo.email = email;
      contactInfo.phone = phone;
      contactInfo.address = address;
      contactInfo.scheduleCallLink = scheduleCallLink;
    }
    
    await contactInfo.save();
    
    res.json({
      success: true,
      message: 'Contact info updated successfully',
      data: contactInfo
    });
  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact info'
    });
  }
});

module.exports = router;
