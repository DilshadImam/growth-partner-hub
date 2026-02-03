import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    description: "Perfect for new businesses getting started online.",
    price: "$1,499",
    period: "/month",
    features: [
      "Professional Website Design",
      "Basic SEO Setup",
      "Social Media Setup",
      "Monthly Performance Report",
      "Email Support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    description: "For businesses ready to scale their digital presence.",
    price: "$2,999",
    period: "/month",
    features: [
      "Everything in Starter",
      "Lead Generation Funnels",
      "Google & Meta Ads Management",
      "CRM Integration",
      "Weekly Strategy Calls",
      "A/B Testing & Optimization",
    ],
    cta: "Start Growing",
    popular: true,
  },
  {
    name: "Scale",
    description: "Enterprise-level solutions for maximum growth.",
    price: "$5,999",
    period: "/month",
    features: [
      "Everything in Growth",
      "Multi-Platform Advertising",
      "Advanced Analytics Dashboard",
      "Dedicated Account Manager",
      "Priority Support",
      "Custom Integrations",
      "Quarterly Growth Reviews",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-primary font-medium text-sm uppercase tracking-wider mb-4"
          >
            Pricing Plans
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Invest in Your{" "}
            <span className="text-gradient">Growth</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Transparent pricing with no hidden fees. Choose the plan that fits your goals.
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 lg:p-8 ${
                plan.popular
                  ? "bg-gradient-card border-2 border-primary shadow-glow"
                  : "bg-card border border-border"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-primary">
                    <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                    <span className="text-xs font-semibold text-primary-foreground">Most Popular</span>
                  </div>
                </div>
              )}

              {/* Plan Info */}
              <div className="mb-6">
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <span className="font-heading text-4xl lg:text-5xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.popular ? "hero" : "outline"}
                size="lg"
                className="w-full"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Custom Pricing Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground mt-12"
        >
          Need a custom solution?{" "}
          <a href="#contact" className="text-primary hover:underline">
            Contact us
          </a>{" "}
          for tailored pricing.
        </motion.p>
      </div>
    </section>
  );
}
