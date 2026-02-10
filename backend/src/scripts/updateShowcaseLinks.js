const mongoose = require('mongoose');
require('dotenv').config();

const ShowcaseImage = require('../models/ShowcaseImage');

const updateShowcaseLinks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all showcase images
    const images = await ShowcaseImage.find();
    console.log(`Found ${images.length} showcase images`);

    // Update each image with a default link if it doesn't have one
    for (const image of images) {
      if (!image.link || image.link === '') {
        image.link = 'https://example.com'; // Default link
        await image.save();
        console.log(`Updated image: ${image.title} with default link`);
      } else {
        console.log(`Image: ${image.title} already has link: ${image.link}`);
      }
    }

    console.log('All images updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating showcase links:', error);
    process.exit(1);
  }
};

updateShowcaseLinks();
