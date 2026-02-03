import { motion } from "framer-motion";
import { Target, Lightbulb, Handshake, Award } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description: "Every strategy we deploy is focused on measurable outcomes that impact your bottom line.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We stay ahead of digital trends to give your business a competitive edge.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    description: "We work as an extension of your team, invested in your long-term success.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Quality in everything we do—from strategy to execution to reporting.",
  },
];

const processSteps = [
  { step: "01", title: "Discovery", description: "We dive deep into your business, goals, and market." },
  { step: "02", title: "Strategy", description: "Custom digital roadmap tailored to your objectives." },
  { step: "03", title: "Execute", description: "Launch campaigns with precision and continuous optimization." },
  { step: "04", title: "Scale", description: "Double down on what works and accelerate growth." },
];

export function About() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Mission Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-primary font-medium text-sm uppercase tracking-wider mb-4"
          >
            About Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Your Growth is Our{" "}
            <span className="text-gradient">Mission</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg leading-relaxed"
          >
            BrandLoom was founded with a simple belief: every business deserves access to 
            world-class digital marketing. We combine data-driven strategies with creative 
            excellence to help startups and growing businesses achieve their full potential online.
          </motion.p>
        </div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-card border border-border"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                <value.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Process Section */}
        <div className="max-w-4xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-2xl md:text-3xl font-bold text-center mb-12"
          >
            Our Process
          </motion.h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-5xl font-heading font-bold text-primary/20 mb-4">
                  {item.step}
                </div>
                <h4 className="font-heading text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
