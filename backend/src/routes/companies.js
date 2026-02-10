const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const Company = require('../models/Company');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching companies'
    });
  }
});

// Get all companies (including inactive for admin)
router.get('/all', async (req, res) => {
  try {
    const companies = await Company.find().sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error('Error fetching all companies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching companies'
    });
  }
});

// Create new company
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const { name, order } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Logo image is required'
      });
    }

    // Upload to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'companies',
      resource_type: 'auto'
    });

    const newCompany = new Company({
      name,
      logo: result.secure_url,
      order: order || 0
    });

    await newCompany.save();

    res.status(201).json({
      success: true,
      message: 'Company added successfully',
      data: newCompany
    });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating company'
    });
  }
});

// Update company
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const { name, order, active } = req.body;
    
    const updateData = {
      name,
      order,
      active
    };

    // If new logo is uploaded
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'companies',
        resource_type: 'auto'
      });

      updateData.logo = result.secure_url;
    }

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating company'
    });
  }
});

// Delete company
router.delete('/:id', async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting company'
    });
  }
});

module.exports = router;
