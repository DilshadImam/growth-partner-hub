const express = require('express');
const router = express.Router();
const HeroStats = require('../models/HeroStats');

/**
 * @route   GET /api/hero/stats
 * @desc    Get hero stats
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    let heroStats = await HeroStats.findOne();
    
    // If no stats exist, create default ones
    if (!heroStats) {
      heroStats = await HeroStats.create({
        stats: [
          { icon: 'Users', value: '500+', label: 'Happy Clients' },
          { icon: 'TrendingUp', value: '3x', label: 'Average Growth' },
          { icon: 'Sparkles', value: '95%', label: 'Success Rate' }
        ]
      });
    }

    res.status(200).json({
      success: true,
      data: heroStats.stats
    });
  } catch (error) {
    console.error('Get hero stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero stats',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/hero/stats
 * @desc    Update hero stats
 * @access  Public (should be Admin only in production)
 */
router.put('/stats', async (req, res) => {
  try {
    const { stats } = req.body;

    if (!stats || !Array.isArray(stats)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid stats array'
      });
    }

    let heroStats = await HeroStats.findOne();

    if (!heroStats) {
      heroStats = await HeroStats.create({ stats });
    } else {
      heroStats.stats = stats;
      await heroStats.save();
    }

    res.status(200).json({
      success: true,
      message: 'Hero stats updated successfully',
      data: heroStats.stats
    });
  } catch (error) {
    console.error('Update hero stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hero stats',
      error: error.message
    });
  }
});

module.exports = router;
