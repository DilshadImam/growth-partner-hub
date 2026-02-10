const express = require('express');
const router = express.Router();
const PricingPlan = require('../models/PricingPlan');

// Get all pricing plans
router.get('/', async (req, res) => {
  try {
    const plans = await PricingPlan.find().sort({ order: 1 });
    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pricing plans'
    });
  }
});

// Get single pricing plan
router.get('/:id', async (req, res) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Pricing plan not found'
      });
    }
    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Error fetching pricing plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pricing plan'
    });
  }
});

// Create new pricing plan
router.post('/', async (req, res) => {
  try {
    const { name, price, period, description, icon, popular, features, cta, color, order } = req.body;

    const newPlan = new PricingPlan({
      name,
      price,
      period,
      description,
      icon: icon || 'Zap',
      popular: popular || false,
      features: features || [],
      cta: cta || 'Get Started',
      color: color || 'from-mono-50/80 to-mono-100/60',
      order: order || 0
    });

    await newPlan.save();

    res.status(201).json({
      success: true,
      message: 'Pricing plan created successfully',
      data: newPlan
    });
  } catch (error) {
    console.error('Error creating pricing plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating pricing plan'
    });
  }
});

// Update pricing plan
router.put('/:id', async (req, res) => {
  try {
    const { name, price, period, description, icon, popular, features, cta, color, order } = req.body;

    const plan = await PricingPlan.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        period,
        description,
        icon,
        popular,
        features,
        cta,
        color,
        order
      },
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Pricing plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Pricing plan updated successfully',
      data: plan
    });
  } catch (error) {
    console.error('Error updating pricing plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating pricing plan'
    });
  }
});

// Delete pricing plan
router.delete('/:id', async (req, res) => {
  try {
    const plan = await PricingPlan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Pricing plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Pricing plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting pricing plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting pricing plan'
    });
  }
});

module.exports = router;
