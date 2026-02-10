const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const ShowcaseImage = require('../models/ShowcaseImage');
const { protect, authorize } = require('../middleware/auth');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

/**
 * @route   GET /api/showcase
 * @desc    Get all showcase images
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const images = await ShowcaseImage.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .select('-__v');
    
    console.log('GET /api/showcase - Images found:', images.length);
    if (images.length > 0) {
      console.log('First image data:', images[0]);
    }

    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    console.error('Get showcase images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch showcase images',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/showcase
 * @desc    Create new showcase image with upload
 * @access  Public (temporarily - should be Admin only in production)
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, link } = req.body;
    
    console.log('POST /api/showcase - Request body:', { title, link });

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image title'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'growth-partner-hub/showcase',
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Get the highest order number
    const lastImage = await ShowcaseImage.findOne().sort({ order: -1 });
    const order = lastImage ? lastImage.order + 1 : 1;

    // Create showcase image in database
    const showcaseImage = await ShowcaseImage.create({
      title,
      imageUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      link: link || '',
      order
    });
    
    console.log('Showcase image created:', showcaseImage);

    res.status(201).json({
      success: true,
      message: 'Showcase image created successfully',
      data: showcaseImage
    });

  } catch (error) {
    console.error('Create showcase image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create showcase image',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/showcase/:id
 * @desc    Update showcase image
 * @access  Public (temporarily - should be Admin only in production)
 */
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, order, link } = req.body;
    
    console.log('PUT /api/showcase/:id - Request body:', { title, order, link, id: req.params.id });
    
    let showcaseImage = await ShowcaseImage.findById(req.params.id);

    if (!showcaseImage) {
      return res.status(404).json({
        success: false,
        message: 'Showcase image not found'
      });
    }

    // Update fields
    if (title) showcaseImage.title = title;
    if (order !== undefined) showcaseImage.order = parseInt(order);
    if (link !== undefined) showcaseImage.link = link;

    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (showcaseImage.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(showcaseImage.cloudinaryPublicId);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      // Upload new image
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'growth-partner-hub/showcase',
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      showcaseImage.imageUrl = result.secure_url;
      showcaseImage.cloudinaryPublicId = result.public_id;
    }

    await showcaseImage.save();
    
    console.log('Showcase image updated:', showcaseImage);

    res.status(200).json({
      success: true,
      message: 'Showcase image updated successfully',
      data: showcaseImage
    });

  } catch (error) {
    console.error('Update showcase image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update showcase image',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/showcase/:id
 * @desc    Delete showcase image
 * @access  Public (temporarily - should be Admin only in production)
 */
router.delete('/:id', async (req, res) => {
  try {
    const showcaseImage = await ShowcaseImage.findById(req.params.id);

    if (!showcaseImage) {
      return res.status(404).json({
        success: false,
        message: 'Showcase image not found'
      });
    }

    // Delete from Cloudinary
    if (showcaseImage.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(showcaseImage.cloudinaryPublicId);
      } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
      }
    }

    // Delete from database
    await showcaseImage.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Showcase image deleted successfully'
    });

  } catch (error) {
    console.error('Delete showcase image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete showcase image',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/showcase/:id/toggle
 * @desc    Toggle showcase image active status
 * @access  Public (temporarily - should be Admin only in production)
 */
router.put('/:id/toggle', async (req, res) => {
  try {
    const showcaseImage = await ShowcaseImage.findById(req.params.id);

    if (!showcaseImage) {
      return res.status(404).json({
        success: false,
        message: 'Showcase image not found'
      });
    }

    showcaseImage.isActive = !showcaseImage.isActive;
    await showcaseImage.save();

    res.status(200).json({
      success: true,
      message: `Showcase image ${showcaseImage.isActive ? 'activated' : 'deactivated'} successfully`,
      data: showcaseImage
    });

  } catch (error) {
    console.error('Toggle showcase image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle showcase image',
      error: error.message
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size is too large. Maximum size is 10MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  next(error);
});

module.exports = router;
