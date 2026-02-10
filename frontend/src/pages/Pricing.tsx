import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Star, Crown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import { API_URL } from "@/config";
import { SectionHeading } from "@/components/ui/section-heading";

const faqs = [
  {
    question: "What's included in the support?",
    answer: "All plans include email support, regular updates, and access to our knowledge base. Higher tiers include phone support and dedicated account management."
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Yes! You can upgrade your plan at any time. We'll credit your existing investment toward the higher tier."
  },
  {
    question: "Do you offer custom solutions?",
    answer: "Absolutely. For enterprise clients or unique requirements, we create custom packages tailored to your specific needs and budget."
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 30-day money-back guarantee. If you're not satisfied with our work, we'll refund your investment."
  },
  {
    question: "How long does implementation take?",
    answer: "Starter projects typically take 2-4 weeks, Growth projects 4-8 weeks, and Scale projects 8-16 weeks depending on complexity."
  },
  {
    question: "Do you provide training?",
    answer: "Yes, all plans include comprehensive training on how to use and maintain your new digital systems."
  }
];

const Pricing = () => {
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const fetchPricingPlans = async () => {
    try {
      const response = await fetch(`${API_URL}/api/pricing`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setPricingPlans(data.data);
      } else {
        setPricingPlans([]);
      }
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      setPricingPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatures = (planId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'Zap': return Zap;
      case 'Star': return Star;
      case 'Crown': return Crown;
      default: return Zap;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-8 bg-gradient-to-br from-mono-50/20 via-background to-mono-100/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
             <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-2 bg-black text-white px-4 py-1.5 rounded-full font-medium text-sm uppercase tracking-wider"
          >
            Pricing
          </motion.span>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <SectionHeading className="text-2xl md:text-3xl lg:text-5xl">
                            Choose Your Personal{" "}
                            <span className="text-gradient">Growth</span>
                          </SectionHeading>
              <p className="text-xl text-muted-foreground pt-8 leading-relaxed max-w-2xl mx-auto">
                Select the perfect package to scale your business and dominate your market
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {pricingPlans.map((plan, index) => {
              const IconComponent = getIcon(plan.icon);
              return (
              <motion.div
                key={plan._id || plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.8 }}
                className={`relative rounded-2xl border border-mono-200 p-6 bg-gradient-to-br ${plan.color} hover:shadow-xl transition-all duration-500 hover:scale-[1.02] flex flex-col ${
                  plan.popular ? 'ring-2 ring-primary/20 shadow-lg' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-mono-100/80 border border-mono-200/60 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-foreground/70" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.period}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-heading font-bold text-foreground mb-2">
                    {plan.price}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-2 mb-6 flex-grow">
                  {(expandedCards[plan._id] ? plan.features : plan.features.slice(0, 4)).map((feature: string, featureIndex: number) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-xs">
                      <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 4 && (
                    <li>
                      <button
                        onClick={() => toggleFeatures(plan._id)}
                        className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 mt-2"
                      >
                        {expandedCards[plan._id] ? 'Show Less' : `+ ${plan.features.length - 4} more features`}
                      </button>
                    </li>
                  )}
                </ul>
              </motion.div>
            )}
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;