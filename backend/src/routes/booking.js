const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ContactInfo = require('../models/ContactInfo');
const Booking = require('../models/Booking');

// Book service endpoint
router.post('/', async (req, res) => {
  try {
    const { userName, userEmail, userPhone, serviceName, description } = req.body;

    // Save booking to database
    const booking = new Booking({
      userName,
      userEmail,
      userPhone,
      serviceName,
      description,
      status: 'Pending'
    });
    await booking.save();

    // Get contact email from database
    let contactInfo = await ContactInfo.findOne();
    const businessEmail = contactInfo?.email || process.env.BUSINESS_EMAIL || 'dilshadimam21@gmail.com';

    // Try to send email, but don't fail if email service is not configured
    try {
      // Check if email is configured
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Create email transporter
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.EMAIL_PORT) || 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        // Simple email text
        const emailText = `
New Service Booking Request

Service: ${serviceName}

Customer Details:
Name: ${userName}
Email: ${userEmail}
Phone: ${userPhone}

Description:
${description}

---
This is an automated message from your website.
        `.trim();

        // Send email
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: businessEmail,
          subject: `New Booking: ${serviceName}`,
          text: emailText
        });

        console.log('Booking email sent successfully');
      } else {
        console.log('Email not configured, skipping email notification');
      }
    } catch (emailError) {
      console.error('Email sending failed (non-critical):', emailError.message);
      // Continue even if email fails
    }

    res.json({
      success: true,
      message: 'Booking request sent successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error processing booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send booking request'
    });
  }
});

// Get all bookings (admin)
router.get('/all', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
});

// Get user bookings by email
router.get('/user/:email', async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
});

// Update booking status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking status'
    });
  }
});

module.exports = router;
