import { motion } from "framer-motion";
import { ArrowRight, Users, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "@/config";
import { FlipWords } from "@/components/ui/flip-words";

export function Hero() {
  const navigate = useNavigate();
  const words = ["Platform", "Solution", "Service", "Impression"];
  const [stats, setStats] = useState([
    { icon: "Users", value: "500+", label: "Happy Clients" },
    { icon: "TrendingUp", value: "3x", label: "Average Growth" },
    { icon: "Sparkles", value: "95%", label: "Success Rate" },
  ]);

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/hero/stats`);
        const data = await response.json();
        if (data.success && data.data) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'Users': return Users;
      case 'TrendingUp': return TrendingUp;
      case 'Sparkles': return Sparkles;
      default: return Users;
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-bw-50/20 via-background to-bw-100/30 pt-24 lg:pt-32">
      
      {/* Hero Person Image Background - Desktop Only */}
      <div className="hidden lg:block absolute inset-0 flex items-center justify-end mt-80 pt-0 lg:pt-0">
        <div className="relative w-full max-w-7xl mx-auto px-4">
          <div className="absolute right-0 lg:right-8 top-1/2 transform -translate-y-[35%]">
            <div className="relative">
              {/* Image with border and styling - Larger size */}
              <div className="relative w-96 h-[500px] lg:w-[450px] lg:h-[600px] rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-sm">
                <img 
                  src="/personal-photo.png" 
                  alt="Professional team member" 
                  className="w-full h-full object-cover object-center opacity-100"
                />
                {/* Stronger overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-black/30 to-black/40"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"></div>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Animated Background Lines */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Flowing Background Animation */}
      <div className="absolute inset-0 opacity-[0.08]">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(171, 167, 165, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(171, 167, 165, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 20%, rgba(171, 167, 165, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, rgba(171, 167, 165, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(171, 167, 165, 0.1) 0%, transparent 50%)",
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-20">
        <div className="max-w-5xl mx-auto">
          
          {/* Content */}
          <div className="max-w-4xl text-center lg:text-left relative z-30">
            
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-6 lg:mb-8"
            >
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.1] tracking-tight text-foreground drop-shadow-lg">
                The growth-powered
              </h1>
                <br />
                 <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl -mt-2 lg:-mt-3 font-light leading-[1.1] tracking-tight text-foreground mb-4 lg:mb-6 drop-shadow-lg">
                  <span className="font-bold">
                    <span className="font-bold bg-[black] pb-1 text-white rounded-md px-3 lg:px-4">
                      <i>digital</i>
                    </span>{" "}
                    <FlipWords words={words} className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold" />
                  </span>
                </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="mb-8 lg:mb-10"
            >
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light drop-shadow-md">
                Scale your business more efficiently with data-driven strategies, 
                real-time optimization, and expert guidance.
              </p>
            </motion.div>

            {/* Mobile: Show image here */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:hidden mb-8"
            >
              <div className="relative w-full max-w-sm mx-auto h-[380px] rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-sm">
                <img 
                  src="/personal-photo.png" 
                  alt="Professional team member" 
                  className="w-full h-full object-cover object-center opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-black/30 to-black/40"></div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-row items-center lg:items-start lg:justify-start justify-center gap-2 lg:gap-4 mb-8 lg:mb-16 px-4 lg:px-0"
            >
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 px-4 py-3 lg:px-8 lg:py-6 text-xs lg:text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group flex-1 sm:flex-initial"
                onClick={() => navigate('/contact')}
              >
                Contact sales
                <ArrowRight className="w-3 h-3 lg:w-5 lg:h-5 ml-1 lg:ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-bw-200 text-foreground hover:bg-bw-100/80 px-4 py-3 lg:px-8 lg:py-6 text-xs lg:text-base font-medium rounded-full transition-all duration-500 hover:scale-[1.02] group bg-white/90 backdrop-blur-sm flex-1 sm:flex-initial"
                onClick={() => navigate('/services')}
              >
                Explore services
                <ArrowRight className="w-3 h-3 lg:w-5 lg:h-5 ml-1 lg:ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </motion.div>

          </div>

         

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: "easeOut" }}
            className="grid grid-cols-3 gap-3 lg:gap-8 max-w-2xl mx-auto text-center lg:text-left lg:mx-0 relative z-30 px-4 lg:px-0"
          >
            {stats.map((stat, index) => {
              const IconComponent = getIcon(stat.icon);
              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 1.2 + index * 0.1, 
                  ease: "easeOut" 
                }}
                className="text-center lg:text-left group"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-white/90 border border-bw-200/40 mb-2 lg:mb-4 group-hover:bg-white transition-all duration-500 backdrop-blur-sm shadow-lg">
                  <IconComponent className="w-4 h-4 lg:w-7 lg:h-7 text-foreground/70" />
                </div>
                <div className="font-heading text-lg md:text-2xl lg:text-4xl font-light text-foreground mb-1 drop-shadow-md">
                  {stat.value}
                </div>
                <div className="text-[10px] md:text-xs lg:text-sm text-muted-foreground font-medium drop-shadow-sm">{stat.label}</div>
              </motion.div>
            )}
            )}
          </motion.div>

        </div>
      </div>

      {/* Subtle Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bw-100/30 to-transparent pointer-events-none"></div>
    </section>
  );
}
