import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { useState, useEffect } from "react";
import { API_URL } from "@/config";

const defaultTestimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechFlow",
    content: "BrandLoom transformed our digital presence completely. Within 6 months, we saw a 300% increase in qualified leads. Their strategic approach is unmatched.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Founder, GreenEats",
    content: "As a local restaurant owner going digital, I was overwhelmed. BrandLoom made everything simple and our online orders tripled in the first quarter.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "CMO, ScaleUp SaaS",
    content: "The ROI we've seen from BrandLoom's ad campaigns is incredible. They truly understand how to convert digital traffic into paying customers.",
    rating: 5,
  },
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
    fetchCompanies();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_URL}/api/testimonials`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setTestimonials(data.data);
      } else {
        setTestimonials(defaultTestimonials);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials(defaultTestimonials);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${API_URL}/api/companies`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setCompanies(data.data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompanies([]);
    }
  };

  if (loading) {
    return (
      <section className="py-24 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* First Section - Companies */}
      <section className="py-24 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <SectionHeading className="text-3xl md:text-4xl lg:text-5xl brush-stroke-heading">
                Loved by <span className="text-gradient">Businesses</span>
              </SectionHeading>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Don't just take our word for it—hear from the businesses we've helped grow.
            </motion.p>
          </div>

          {/* Trusted by Companies */}
          {companies.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">Trusted by Companies</p>
              
              {/* Desktop View - Static Grid */}
              <div className="hidden md:flex flex-wrap justify-center items-center gap-10 lg:gap-16">
                {companies.map((company, index) => (
                  <div
                    key={company._id || index}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-mono-100 to-mono-50 border-2 border-mono-200 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-md">
                      {company.logo ? (
                        <img 
                          src={company.logo} 
                          alt={company.name}
                          className="w-full h-full object-fit"
                        />
                      ) : (
                        <span className="text-3xl font-heading font-bold text-foreground/70 group-hover:text-foreground transition-colors">
                          {company.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-base font-heading font-bold text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                      {company.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mobile View - Infinite Carousel */}
              <div className="md:hidden relative overflow-hidden">
                <div className="flex animate-scroll">
                  {/* First set of logos */}
                  {companies.map((company, index) => (
                    <div
                      key={`first-${company._id || index}`}
                      className="flex flex-col items-center gap-3 flex-shrink-0 mx-6"
                    >
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-mono-100 to-mono-50 border-2 border-mono-200 flex items-center justify-center overflow-hidden shadow-md">
                        {company.logo ? (
                          <img 
                            src={company.logo} 
                            alt={company.name}
                            className="w-full h-full object-fit"
                          />
                        ) : (
                          <span className="text-2xl font-heading font-bold text-foreground/70">
                            {company.name.substring(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-heading font-bold text-muted-foreground/70">
                        {company.name}
                      </span>
                    </div>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {companies.map((company, index) => (
                    <div
                      key={`second-${company._id || index}`}
                      className="flex flex-col items-center gap-3 flex-shrink-0 mx-6"
                    >
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-mono-100 to-mono-50 border-2 border-mono-200 flex items-center justify-center overflow-hidden shadow-md">
                        {company.logo ? (
                          <img 
                            src={company.logo} 
                            alt={company.name}
                            className="w-full h-full object-fit"
                          />
                        ) : (
                          <span className="text-2xl font-heading font-bold text-foreground/70">
                            {company.name.substring(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-heading font-bold text-muted-foreground/70">
                        {company.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Full Width FOCUS Image */}
      <section className="relative w-full h-[300px] md:h-[400px] lg:h-[550px] overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: 'url(/FOCUS.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      </section>

      {/* Second Section - Testimonials */}
      <section className="py-24 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-2 bg-black text-white px-4 py-1.5 rounded-full font-medium text-sm uppercase tracking-wider"
            >
              Testimonials
            </motion.span>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              The feedback we got from our Clients.
            </motion.p>
          </div>

          {/* Show grid if 3 or less testimonials, carousel if more */}
          {testimonials.length <= 3 ? (
            <>
              {/* Desktop View - Grid */}
              <div className="hidden md:grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative p-6 lg:p-8 rounded-2xl bg-card border border-border"
                  >
                    {/* Quote Icon */}
                    <Quote className="w-8 h-8 text-primary/30 mb-4" />

                    {/* Content */}
                    <p className="text-foreground mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold text-sm">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mobile View - Always Carousel */}
              <div className="md:hidden relative overflow-hidden">
                <div className="flex animate-scroll-slow gap-6">
                  {/* First set */}
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={`mobile-first-${index}`}
                      className="relative p-6 rounded-2xl bg-card border border-border flex-shrink-0 w-[280px]"
                    >
                      <Quote className="w-6 h-6 text-primary/30 mb-3" />
                      <p className="text-foreground text-sm mb-4 leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      <div className="flex gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                          <span className="text-primary-foreground font-semibold text-xs">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground text-sm">{testimonial.name}</div>
                          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Duplicate set */}
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={`mobile-second-${index}`}
                      className="relative p-6 rounded-2xl bg-card border border-border flex-shrink-0 w-[280px]"
                    >
                      <Quote className="w-6 h-6 text-primary/30 mb-3" />
                      <p className="text-foreground text-sm mb-4 leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      <div className="flex gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                          <span className="text-primary-foreground font-semibold text-xs">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground text-sm">{testimonial.name}</div>
                          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="relative overflow-hidden">
              <div className="flex animate-scroll-slow gap-6">
                {/* First set of testimonials */}
                {testimonials.map((testimonial, index) => (
                  <div
                    key={`first-${index}`}
                    className="relative p-6 lg:p-8 rounded-2xl bg-card border border-border flex-shrink-0 w-[280px] md:w-[350px]"
                  >
                    {/* Quote Icon */}
                    <Quote className="w-6 h-6 md:w-8 md:h-8 text-primary/30 mb-3 md:mb-4" />

                    {/* Content */}
                    <p className="text-foreground text-sm md:text-base mb-4 md:mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    {/* Rating */}
                    <div className="flex gap-1 mb-3 md:mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-primary text-primary" />
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold text-xs md:text-sm">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm md:text-base">{testimonial.name}</div>
                        <div className="text-xs md:text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {testimonials.map((testimonial, index) => (
                  <div
                    key={`second-${index}`}
                    className="relative p-6 lg:p-8 rounded-2xl bg-card border border-border flex-shrink-0 w-[280px] md:w-[350px]"
                  >
                    {/* Quote Icon */}
                    <Quote className="w-6 h-6 md:w-8 md:h-8 text-primary/30 mb-3 md:mb-4" />

                    {/* Content */}
                    <p className="text-foreground text-sm md:text-base mb-4 md:mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    {/* Rating */}
                    <div className="flex gap-1 mb-3 md:mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-primary text-primary" />
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold text-xs md:text-sm">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm md:text-base">{testimonial.name}</div>
                        <div className="text-xs md:text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
