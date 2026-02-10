const mongoose = require('mongoose');
require('dotenv').config();

const Testimonial = require('../models/Testimonial');

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO",
    company: "TechFlow",
    content: "BrandLoom transformed our digital presence completely. Within 6 months, we saw a 300% increase in qualified leads. Their strategic approach is unmatched.",
    rating: 5,
    order: 0
  },
  {
    name: "Marcus Johnson",
    role: "Founder",
    company: "GreenEats",
    content: "As a local restaurant owner going digital, I was overwhelmed. BrandLoom made everything simple and our online orders tripled in the first quarter.",
    rating: 5,
    order: 1
  },
  {
    name: "Emily Rodriguez",
    role: "CMO",
    company: "ScaleUp SaaS",
    content: "The ROI we've seen from BrandLoom's ad campaigns is incredible. They truly understand how to convert digital traffic into paying customers.",
    rating: 5,
    order: 2
  }
];

async function seedTestimonials() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Testimonial.deleteMany({});
    console.log('Cleared existing testimonials');

    await Testimonial.insertMany(testimonials);
    console.log('Testimonials seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    process.exit(1);
  }
}

seedTestimonials();
