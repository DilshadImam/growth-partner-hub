const express = require('express');
const Service = require('../models/Service');
const router = express.Router();

// @route   GET /api/services
// @desc    Get all active services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
});

// @route   POST /api/services
// @desc    Create new service
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { title, description, features, icon } = req.body;

    const service = await Service.create({
      title,
      description,
      features: Array.isArray(features) ? features : [],
      icon: icon || 'Briefcase',
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
});

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { title, description, features, icon, isActive } = req.body;

    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Update fields
    if (title !== undefined) service.title = title;
    if (description !== undefined) service.description = description;
    if (features !== undefined) {
      service.features = Array.isArray(features) ? features : [];
    }
    if (icon !== undefined) service.icon = icon;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete service (soft delete)
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    service.isActive = false;
    await service.save();

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
});

module.exports = router;
