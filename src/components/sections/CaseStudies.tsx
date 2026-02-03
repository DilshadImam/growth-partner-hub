import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, Users, DollarSign } from "lucide-react";

const caseStudies = [
  {
    title: "E-commerce Brand",
    industry: "Retail",
    description: "Scaled an online store from $50K to $500K monthly revenue in 8 months.",
    metrics: [
      { icon: TrendingUp, value: "10x", label: "Revenue Growth" },
      { icon: Users, value: "450%", label: "Traffic Increase" },
      { icon: DollarSign, value: "3.2x", label: "ROAS" },
    ],
    gradient: "from-primary/20 to-accent/10",
  },
  {
    title: "SaaS Startup",
    industry: "Technology",
    description: "Generated 2,000+ qualified leads in 6 months through targeted campaigns.",
    metrics: [
      { icon: Users, value: "2,000+", label: "Leads Generated" },
      { icon: DollarSign, value: "65%", label: "Lower CPL" },
      { icon: TrendingUp, value: "180%", label: "Conversion Lift" },
    ],
    gradient: "from-accent/20 to-primary/10",
  },
  {
    title: "Local Restaurant Chain",
    industry: "Food & Beverage",
    description: "Tripled online orders and built a loyal customer base through digital marketing.",
    metrics: [
      { icon: TrendingUp, value: "3x", label: "Online Orders" },
      { icon: Users, value: "15K+", label: "New Customers" },
      { icon: DollarSign, value: "250%", label: "ROI" },
    ],
    gradient: "from-primary/15 to-accent/15",
  },
];

export function CaseStudies() {
  return (
    <section id="case-studies" className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-primary font-medium text-sm uppercase tracking-wider mb-4"
          >
            Results That Speak
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Client <span className="text-gradient">Success Stories</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Real results from real businesses. See how we've helped companies like yours grow.
          </motion.p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300"
            >
              {/* Gradient Header */}
              <div className={`h-32 bg-gradient-to-br ${study.gradient}`} />

              {/* Content */}
              <div className="p-6 lg:p-8">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground mb-4">
                  {study.industry}
                </span>
                <h3 className="font-heading text-xl font-bold mb-3 text-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                  {study.title}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-muted-foreground mb-6">{study.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  {study.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="text-center">
                      <metric.icon className="w-4 h-4 text-primary mx-auto mb-2" />
                      <div className="font-heading text-lg font-bold text-foreground">
                        {metric.value}
                      </div>
                      <div className="text-xs text-muted-foreground">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
