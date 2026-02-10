import { motion } from "framer-motion";
import { Code, Target, Megaphone, TrendingUp, Rocket, Briefcase, Calendar, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, API_URL } from "@/config";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const iconMap: any = {
  Code, Target, Megaphone, TrendingUp, Rocket, Briefcase
};

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
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    description: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        console.log('Fetching services from:', `${API_BASE_URL}/services`);
        const response = await fetch(`${API_BASE_URL}/services`);
        const data = await response.json();
        
        console.log('Services response:', data);
        
        if (data.success && data.data.length > 0) {
          // Map backend services to frontend format
          const mappedServices = data.data.map((service: any) => ({
            icon: iconMap[service.icon] || Briefcase,
            title: service.title,
            description: service.description,
            features: service.features || []
          }));
          setServices(mappedServices);
          console.log('Services loaded:', mappedServices.length);
        } else {
          setServices([]);
          console.log('No services found in database');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookService = (service: any) => {
    // Check if user is logged in
    const userAuth = localStorage.getItem('userAuth');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userAuth || userAuth !== 'true') {
      toast({
        title: "Login Required",
        description: "Please login to book a service",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    // Get user data from localStorage
    const userName = localStorage.getItem('userName') || '';
    const userPhone = localStorage.getItem('userPhone') || '';

    // Pre-fill form with user data
    setBookingForm({
      userName,
      userEmail: userEmail || '',
      userPhone,
      description: ''
    });
    
    setSelectedService(service);
    setShowBookingForm(true);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingForm.description.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide a description for your booking",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/api/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: bookingForm.userName,
          userEmail: bookingForm.userEmail,
          userPhone: bookingForm.userPhone,
          serviceName: selectedService.title,
          description: bookingForm.description
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Booking Sent!",
          description: "We'll contact you soon regarding your service request",
        });
        setShowBookingForm(false);
        setBookingForm({ userName: '', userEmail: '', userPhone: '', description: '' });
      } else {
        toast({
          title: "Booking Failed",
          description: data.message || "Failed to send booking request",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Error",
        description: "Failed to send booking request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section id="services" className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section id="services" className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <SectionHeading className="text-3xl md:text-4xl lg:text-5xl">
                Our Services
              </SectionHeading>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              No services available yet. Please check back later or contact us directly.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-2 bg-black text-white px-4 py-1.5 rounded-full font-medium text-sm uppercase tracking-wider"
          >
            What We Do
          </motion.span>
          <div className="flex justify-center mb-6">
            <SectionHeading className="text-3xl md:text-4xl lg:text-5xl">
              End-to-End Digital{" "}
              <span className="text-gradient">Solutions</span>
            </SectionHeading>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground py-3 text-lg max-w-2xl mx-auto"
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-6xl mx-auto"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-6 lg:p-8 rounded-2xl bg-mono-100 border border-mono-200 w-full max-w-sm"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary mb-6">
                <service.icon className="w-6 h-6 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-heading text-xl font-bold mb-3 text-foreground">
                {service.title}
              </h3>
              <p className="text-black mb-6">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature: string, featureIndex: number) => (
                  <li key={featureIndex} className="flex items-center gap-2 text-sm text-black">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Book Service Button */}
              <Button 
                variant="hero" 
                className="w-full"
                onClick={() => handleBookService(service)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Service
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Booking Form Dialog */}
        <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Book Service: {selectedService?.title}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitBooking} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <Input
                  value={bookingForm.userName}
                  onChange={(e) => setBookingForm({ ...bookingForm, userName: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={bookingForm.userEmail}
                  onChange={(e) => setBookingForm({ ...bookingForm, userEmail: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  value={bookingForm.userPhone}
                  onChange={(e) => setBookingForm({ ...bookingForm, userPhone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={bookingForm.description}
                  onChange={(e) => setBookingForm({ ...bookingForm, description: e.target.value })}
                  placeholder="Tell us about your requirements..."
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowBookingForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="hero"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Book Now'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
