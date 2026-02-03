import { motion } from "framer-motion";
import { Code, Target, Megaphone, TrendingUp, Rocket } from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description: "High-converting websites, landing pages, and e-commerce stores built for performance.",
    features: ["Business Websites", "Landing Pages", "E-commerce", "SEO Optimization"],
  },
  {
    icon: Target,
    title: "Lead Generation",
    description: "Turn visitors into qualified leads with strategic funnels and automation.",
    features: ["Funnel Design", "Landing Optimization", "CRM Integration", "Email Automation"],
  },
  {
    icon: Megaphone,
    title: "Online Advertising",
    description: "Data-driven ad campaigns across Google, Meta, and LinkedIn that deliver ROI.",
    features: ["Google Ads", "Meta Ads", "LinkedIn Ads", "Campaign Tracking"],
  },
  {
    icon: TrendingUp,
    title: "Business Scaling",
    description: "Strategic growth planning to take your business from startup to market leader.",
    features: ["Growth Strategy", "CRO", "Sales Funnels", "Retargeting"],
  },
  {
    icon: Rocket,
    title: "Sales Boosting",
    description: "Maximize conversions with optimized offers, copy, and data-driven testing.",
    features: ["Offer Positioning", "Copywriting", "Analytics", "A/B Testing"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Services() {
  return (
    <section id="services" className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-primary font-medium text-sm uppercase tracking-wider mb-4"
          >
            What We Do
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            End-to-End Digital{" "}
            <span className="text-gradient">Solutions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Everything you need to build, grow, and scale your online presence—all under one roof.
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-6 lg:p-8 rounded-2xl bg-gradient-card border border-border hover:border-primary/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary mb-6">
                <service.icon className="w-6 h-6 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-heading text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
