const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

// Get all testimonials (public - only active)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials'
    });
  }
});

// Get all testimonials including inactive (for admin)
router.get('/all', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching all testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials'
    });
  }
});

// Get single testimonial
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    res.json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonial'
    });
  }
});

// Create new testimonial
router.post('/', async (req, res) => {
  try {
    const { name, role, company, content, rating, image, order, active } = req.body;

    const newTestimonial = new Testimonial({
      name,
      role,
      company: company || '',
      content,
      rating: rating || 5,
      image: image || '',
      order: order || 0,
      active: active !== undefined ? active : true
    });

    await newTestimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: newTestimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating testimonial'
    });
  }
});

// Update testimonial
router.put('/:id', async (req, res) => {
  try {
    const { name, role, company, content, rating, image, order, active } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        name,
        role,
        company,
        content,
        rating,
        image,
        order,
        active
      },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating testimonial'
    });
  }
});

// Delete testimonial
router.delete('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting testimonial'
    });
  }
});

module.exports = router;
