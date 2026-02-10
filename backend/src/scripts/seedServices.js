const mongoose = require('mongoose');
require('dotenv').config();

const Service = require('../models/Service');

const services = [
  {
    title: "Web Development",
    description: "High-converting websites, landing pages, and e-commerce stores built for performance.",
    features: ["Business Websites", "Landing Pages", "E-commerce", "SEO Optimization"],
    icon: "Code",
    isActive: true,
    order: 1
  },
  {
    title: "Lead Generation",
    description: "Turn visitors into qualified leads with strategic funnels and automation.",
    features: ["Funnel Design", "Landing Optimization", "CRM Integration", "Email Automation"],
    icon: "Target",
    isActive: true,
    order: 2
  },
  {
    title: "Online Advertising",
    description: "Data-driven ad campaigns across Google, Meta, and LinkedIn that deliver ROI.",
    features: ["Google Ads", "Meta Ads", "LinkedIn Ads", "Campaign Tracking"],
    icon: "Megaphone",
    isActive: true,
    order: 3
  },
  {
    title: "Business Scaling",
    description: "Strategic growth planning to take your business from startup to market leader.",
    features: ["Growth Strategy", "CRO", "Sales Funnels", "Retargeting"],
    icon: "TrendingUp",
    isActive: true,
    order: 4
  },
  {
    title: "Sales Boosting",
    description: "Maximize conversions with optimized offers, copy, and data-driven testing.",
    features: ["Offer Positioning", "Copywriting", "Analytics", "A/B Testing"],
    icon: "Rocket",
    isActive: true,
    order: 5
  }
];

async function seedServices() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Drop the collection to remove old indexes
    try {
      await mongoose.connection.db.dropCollection('services');
      console.log('🗑️  Dropped services collection');
    } catch (err) {
      console.log('ℹ️  Services collection does not exist, creating new one');
    }

    // Insert new services
    const createdServices = await Service.insertMany(services);
    console.log(`✅ Created ${createdServices.length} services`);

    console.log('\n📋 Services:');
    createdServices.forEach(service => {
      console.log(`  - ${service.title} (ID: ${service._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    process.exit(1);
  }
}

seedServices();
