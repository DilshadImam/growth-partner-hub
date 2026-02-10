import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";

export function AboutHome() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center"
            >
              <SectionHeading className="mb-8 text-5xl md:text-6xl lg:text-7xl">
                About Us
              </SectionHeading>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  We are a team of passionate digital growth experts dedicated to transforming businesses through innovative strategies and cutting-edge solutions. With years of experience in the industry, we understand what it takes to drive real, measurable results.
                </p>
                <p>
                  Our mission is to empower businesses of all sizes to reach their full potential in the digital landscape. We combine data-driven insights with creative excellence to deliver solutions that not only meet but exceed expectations.
                </p>
                <p>
                  From startups to established enterprises, we've helped countless clients achieve their growth objectives through personalized strategies, expert guidance, and unwavering commitment to their success.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              
              {/* Overlay Text */}
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-white text-xl font-semibold">
                  Building the future, one project at a time
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
