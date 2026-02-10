const mongoose = require('mongoose');
require('dotenv').config();

const PricingPlan = require('../models/PricingPlan');

const pricingPlans = [
  {
    name: "Starter",
    price: "$2,999",
    period: "one-time",
    description: "Perfect for new businesses getting started online",
    icon: "Zap",
    popular: false,
    features: [
      "Professional website design",
      "Basic SEO optimization",
      "Contact form integration",
      "Mobile responsive design",
      "3 months support",
      "Google Analytics setup",
      "Social media integration",
      "Basic branding package"
    ],
    cta: "Get Started",
    color: "from-mono-50/80 to-mono-100/60",
    order: 0
  },
  {
    name: "Growth",
    price: "$5,999",
    period: "one-time + monthly",
    description: "For businesses ready to scale their online presence",
    icon: "Star",
    popular: true,
    features: [
      "Everything in Starter",
      "Lead generation system",
      "Email marketing automation",
      "Advanced analytics dashboard",
      "CRM integration",
      "6 months support",
      "Monthly optimization",
      "A/B testing setup",
      "Conversion tracking",
      "Priority support"
    ],
    cta: "Most Popular",
    color: "from-primary/10 to-primary/5",
    order: 1
  },
  {
    name: "Scale",
    price: "$12,999",
    period: "comprehensive package",
    description: "Complete digital transformation for growing companies",
    icon: "Crown",
    popular: false,
    features: [
      "Everything in Growth",
      "Custom web application",
      "Advanced advertising campaigns",
      "Multi-platform integration",
      "Advanced conversion optimization",
      "12 months support",
      "Dedicated account manager",
      "Custom reporting dashboard",
      "API integrations",
      "White-label solutions"
    ],
    cta: "Contact Sales",
    color: "from-mono-100/60 to-mono-50/80",
    order: 2
  }
];

async function seedPricing() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing pricing plans
    await PricingPlan.deleteMany({});
    console.log('Cleared existing pricing plans');

    // Insert new pricing plans
    await PricingPlan.insertMany(pricingPlans);
    console.log('Pricing plans seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding pricing plans:', error);
    process.exit(1);
  }
}

seedPricing();
