import { useState, useEffect } from "react";
import { 
  Settings, 
  Users, 
  BarChart3, 
  Mail, 
  Globe, 
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  LogOut,
  Home,
  X,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ImageUpload } from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, API_URL } from "@/config";

// Mock data - in real app, this would come from your backend
const mockData = {
  hero: {
    title: "The growth-powered digital platform",
    subtitle: "Scale your business more efficiently with data-driven strategies, real-time optimization, and expert guidance.",
    primaryCTA: "Contact sales",
    secondaryCTA: "Explore services"
  },
  services: [
    {
      id: 1,
      title: "Web Development",
      description: "High-converting websites, landing pages, and e-commerce stores built for performance.",
      features: ["Business Websites", "Landing Pages", "E-commerce", "SEO Optimization"]
    },
    {
      id: 2,
      title: "Lead Generation", 
      description: "Turn visitors into qualified leads with strategic funnels and automation.",
      features: ["Funnel Design", "Landing Optimization", "CRM Integration", "Email Automation"]
    }
  ],
  stats: [
    { label: "Happy Clients", value: "500+" },
    { label: "Average Growth", value: "3x" },
    { label: "Success Rate", value: "95%" }
  ],
  testimonials: [
    {
      id: 1,
      name: "John Smith",
      company: "Tech Startup",
      content: "Amazing results! Our leads increased by 300% in just 3 months.",
      rating: 5
    }
  ],
  clients: [
    {
      id: 1,
      name: "Tech Innovations Inc",
      logo: "TI",
      industry: "Technology",
      description: "Leading software solutions provider"
    },
    {
      id: 2,
      name: "Global Marketing Co",
      logo: "GM",
      industry: "Marketing",
      description: "Digital marketing agency"
    },
    {
      id: 3,
      name: "E-Commerce Plus",
      logo: "EP",
      industry: "E-commerce",
      description: "Online retail platform"
    }
  ],
  showcase: {
    text: [
      "Transforming businesses through innovative digital solutions. Empowering growth with data-driven strategies. Building lasting partnerships for sustainable success. Delivering excellence in every project we undertake.",
      "",
      "",
      ""
    ],
    images: [
      { id: 1, name: "Showcase Image 1", url: "/showcase-1.jpg" },
      { id: 2, name: "Showcase Image 2", url: "/showcase-2.jpg" },
      { id: 3, name: "Showcase Image 3", url: "/showcase-3.jpg" },
      { id: 4, name: "Showcase Image 4", url: "/showcase-4.jpg" }
    ]
  }
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [heroData, setHeroData] = useState({
    title: "The growth-powered digital platform",
    subtitle: "Scale your business more efficiently with data-driven strategies, real-time optimization, and expert guidance.",
    primaryCTA: "Contact sales",
    secondaryCTA: "Explore services"
  });
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [statsData, setStatsData] = useState([
    { label: "Happy Clients", value: "500+" },
    { label: "Average Growth", value: "3x" },
    { label: "Success Rate", value: "95%" }
  ]);
  const [testimonialsData, setTestimonialsData] = useState<any[]>([]);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    order: 0
  });
  const [companiesData, setCompaniesData] = useState<any[]>([]);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    logo: null as File | null,
    order: 0
  });
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    address: '',
    scheduleCallLink: ''
  });
  const [bookings, setBookings] = useState<any[]>([]);
  const [clientsData, setClientsData] = useState<any[]>([]);
  const [showcaseData, setShowcaseData] = useState({
    text: ["Transforming businesses through innovative digital solutions.", "", "", ""],
    images: []
  });
  const [showcaseImages, setShowcaseImages] = useState<any[]>([]);
  const [editingImage, setEditingImage] = useState<{id: number, name: string, url: string, link?: string} | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newImage, setNewImage] = useState({ title: '', file: null as File | null, link: '' });
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    features: '',
    icon: 'Briefcase'
  });
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [showPricingForm, setShowPricingForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [pricingForm, setPricingForm] = useState({
    name: '',
    price: '',
    period: '',
    description: '',
    icon: 'Zap',
    popular: false,
    features: '',
    cta: 'Get Started',
    color: 'from-mono-50/80 to-mono-100/60',
    order: 0
  });
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch showcase images from backend
  const fetchShowcaseImages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/showcase`);
      const data = await response.json();
      
      if (data.success) {
        setShowcaseImages(data.data);
      }
    } catch (error) {
      console.error('Error fetching showcase images:', error);
      // Don't block the UI if backend is not running
      setShowcaseImages([]);
    }
  };

  // Fetch hero stats from backend
  const fetchHeroStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hero/stats`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const formattedStats = data.data.map((stat: any) => ({
          label: stat.label,
          value: stat.value,
          icon: stat.icon
        }));
        setStatsData(formattedStats);
      }
    } catch (error) {
      console.error('Error fetching hero stats:', error);
    }
  };

  // Save hero stats to backend
  const saveHeroStats = async () => {
    try {
      const statsToSave = statsData.map((stat: any) => ({
        icon: stat.icon || 'Users',
        value: stat.value,
        label: stat.label
      }));

      const response = await fetch(`${API_URL}/api/hero/stats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stats: statsToSave }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: "Hero stats updated successfully",
        });
        fetchHeroStats();
      } else {
        toast({
          title: "Update Failed",
          description: data.message || 'Failed to update stats',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving hero stats:', error);
      toast({
        title: "Error",
        description: "Failed to save stats. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Check if user is authenticated as admin
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    const userType = localStorage.getItem('userType');
    
    if (adminAuth === 'true' && userType === 'admin') {
      setIsAuthenticated(true);
      // Fetch data from backend
      fetchShowcaseImages();
      fetchServices();
      fetchHeroStats();
      fetchPricingPlans();
      fetchTestimonials();
      fetchCompanies();
      fetchContactInfo();
      fetchBookings();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Log pricing plans changes
  useEffect(() => {
    console.log('Pricing plans updated:', pricingPlans);
  }, [pricingPlans]);

  // Fetch services from backend
  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/services`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        // Use _id from MongoDB
        const mappedServices = data.data.map((service: any) => ({
          ...service,
          id: service._id // Add id field for compatibility
        }));
        setServicesData(mappedServices);
      } else {
        setServicesData([]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServicesData([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save stats to backend if on stats tab
      if (activeTab === 'stats') {
        await saveHeroStats();
      }
      
      // In real app, this would save other sections to backend API
      console.log("Saving data...", { heroData, servicesData, statsData, testimonialsData, clientsData, showcaseData });
      
      setIsEditing(false);
      toast({
        title: "Success!",
        description: "Changes saved successfully!",
      });
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Error",
        description: "Error saving changes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addService = () => {
    // Reset form and show popup
    setServiceForm({
      title: '',
      description: '',
      features: '',
      icon: 'Briefcase'
    });
    setEditingService(null);
    setShowServiceForm(true);
  };

  const handleEditService = (service: any) => {
    setServiceForm({
      title: service.title,
      description: service.description,
      features: Array.isArray(service.features) ? service.features.join(', ') : service.features,
      icon: service.icon || 'Briefcase'
    });
    setEditingService(service);
    setShowServiceForm(true);
  };

  // Save service to backend
  const saveService = async (serviceData: any) => {
    try {
      const url = serviceData._id 
        ? `${API_BASE_URL}/services/${serviceData._id}`
        : `${API_BASE_URL}/services`;
      
      const method = serviceData._id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: serviceData.title,
          description: serviceData.description,
          features: serviceData.features,
          icon: serviceData.icon
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success!",
          description: serviceData._id ? "Service updated" : "Service created",
        });
        fetchServices(); // Refresh the list
        return true;
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save service",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleServiceSubmit = async () => {
    if (!serviceForm.title || !serviceForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill title and description",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const serviceData = {
        ...serviceForm,
        features: serviceForm.features.split(',').map(f => f.trim()).filter(f => f),
        _id: editingService?._id || editingService?.id
      };

      const saved = await saveService(serviceData);
      
      if (saved) {
        setShowServiceForm(false);
        setServiceForm({ title: '', description: '', features: '', icon: 'Briefcase' });
        setEditingService(null);
      }
    } catch (error) {
      console.error('Error submitting service:', error);
    } finally {
      setUploading(false);
    }
  };

  const deleteService = async (id: number | string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success!",
          description: "Service deleted",
        });
        fetchServices(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete service",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive"
      });
    }
  };

  // Pricing Plans Functions
  const fetchPricingPlans = async () => {
    try {
      console.log('Fetching pricing plans from:', `${API_URL}/api/pricing`);
      const response = await fetch(`${API_URL}/api/pricing`);
      const data = await response.json();
      
      console.log('Pricing plans response:', data);
      
      if (data.success && data.data.length > 0) {
        setPricingPlans(data.data);
      } else {
        setPricingPlans([]);
      }
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      setPricingPlans([]);
    }
  };

  const addPricingPlan = () => {
    setPricingForm({
      name: '',
      price: '',
      period: '',
      description: '',
      icon: 'Zap',
      popular: false,
      features: '',
      cta: 'Get Started',
      color: 'from-mono-50/80 to-mono-100/60',
      order: pricingPlans.length
    });
    setEditingPlan(null);
    setShowPricingForm(true);
  };

  const handleEditPlan = (plan: any) => {
    setPricingForm({
      name: plan.name,
      price: plan.price,
      period: plan.period,
      description: plan.description,
      icon: plan.icon || 'Zap',
      popular: plan.popular || false,
      features: Array.isArray(plan.features) ? plan.features.join(', ') : plan.features,
      cta: plan.cta || 'Get Started',
      color: plan.color || 'from-mono-50/80 to-mono-100/60',
      order: plan.order || 0
    });
    setEditingPlan(plan);
    setShowPricingForm(true);
  };

  const savePricingPlan = async (planData: any) => {
    try {
      const url = planData._id 
        ? `${API_URL}/api/pricing/${planData._id}`
        : `${API_URL}/api/pricing`;
      
      const method = planData._id ? 'PUT' : 'POST';
      
      console.log('Saving pricing plan:', { url, method, planData });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: planData.name,
          price: planData.price,
          period: planData.period,
          description: planData.description,
          icon: planData.icon,
          popular: planData.popular,
          features: planData.features,
          cta: planData.cta,
          color: planData.color,
          order: planData.order
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        toast({
          title: "Success!",
          description: planData._id ? "Plan updated" : "Plan created",
        });
        await fetchPricingPlans();
        return true;
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save plan",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving pricing plan:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save plan",
        variant: "destructive"
      });
      return false;
    }
  };

  const handlePricingSubmit = async () => {
    if (!pricingForm.name || !pricingForm.price || !pricingForm.period) {
      toast({
        title: "Missing Information",
        description: "Please fill name, price, and period",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const planData = {
        ...pricingForm,
        features: pricingForm.features.split(',').map(f => f.trim()).filter(f => f),
        _id: editingPlan?._id || editingPlan?.id
      };

      console.log('Submitting pricing plan:', planData);
      const saved = await savePricingPlan(planData);
      console.log('Save result:', saved);
      
      if (saved) {
        setShowPricingForm(false);
        setPricingForm({
          name: '',
          price: '',
          period: '',
          description: '',
          icon: 'Zap',
          popular: false,
          features: '',
          cta: 'Get Started',
          color: 'from-mono-50/80 to-mono-100/60',
          order: 0
        });
        setEditingPlan(null);
      }
    } catch (error) {
      console.error('Error submitting pricing plan:', error);
      toast({
        title: "Error",
        description: "Failed to submit plan",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deletePricingPlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing plan?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/pricing/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success!",
          description: "Pricing plan deleted",
        });
        fetchPricingPlans();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete plan",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting pricing plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive"
      });
    }
  };

  // Testimonial Functions
  const fetchTestimonials = async () => {
    try {
      console.log('Fetching testimonials from:', `${API_URL}/api/testimonials/all`);
      const response = await fetch(`${API_URL}/api/testimonials/all`);
      const data = await response.json();
      
      console.log('Testimonials response:', data);
      
      if (data.success && data.data.length > 0) {
        setTestimonialsData(data.data);
      } else {
        setTestimonialsData([]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonialsData([]);
    }
  };

  const addTestimonial = () => {
    setTestimonialForm({
      name: '',
      role: '',
      company: '',
      content: '',
      rating: 5,
      order: testimonialsData.length
    });
    setEditingTestimonial(null);
    setShowTestimonialForm(true);
  };

  const handleEditTestimonial = (testimonial: any) => {
    setTestimonialForm({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company || '',
      content: testimonial.content,
      rating: testimonial.rating || 5,
      order: testimonial.order || 0
    });
    setEditingTestimonial(testimonial);
    setShowTestimonialForm(true);
  };

  const saveTestimonial = async (testimonialData: any) => {
    try {
      const url = testimonialData._id 
        ? `${API_URL}/api/testimonials/${testimonialData._id}`
        : `${API_URL}/api/testimonials`;
      
      const method = testimonialData._id ? 'PUT' : 'POST';
      
      console.log('Saving testimonial:', { url, method, testimonialData });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: testimonialData.name,
          role: testimonialData.role,
          company: testimonialData.company,
          content: testimonialData.content,
          rating: testimonialData.rating,
          order: testimonialData.order
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success!",
          description: testimonialData._id ? "Testimonial updated" : "Testimonial created",
        });
        await fetchTestimonials();
        return true;
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save testimonial",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save testimonial",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleTestimonialSubmit = async () => {
    if (!testimonialForm.name || !testimonialForm.role || !testimonialForm.content) {
      toast({
        title: "Missing Information",
        description: "Please fill name, role, and content",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const testimonialData = {
        ...testimonialForm,
        _id: editingTestimonial?._id || editingTestimonial?.id
      };

      const saved = await saveTestimonial(testimonialData);
      
      if (saved) {
        setShowTestimonialForm(false);
        setTestimonialForm({
          name: '',
          role: '',
          company: '',
          content: '',
          rating: 5,
          order: 0
        });
        setEditingTestimonial(null);
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to submit testimonial",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success!",
          description: "Testimonial deleted",
        });
        fetchTestimonials();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete testimonial",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive"
      });
    }
  };

  const toggleTestimonialActive = async (testimonial: any) => {
    try {
      const response = await fetch(`${API_URL}/api/testimonials/${testimonial._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...testimonial,
          active: !testimonial.active
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success!",
          description: testimonial.active ? "Testimonial hidden" : "Testimonial published",
        });
        fetchTestimonials();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update testimonial",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error toggling testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive"
      });
    }
  };

  // Company Functions
  const fetchCompanies = async () => {
    try {
      console.log('Fetching companies from:', `${API_URL}/api/companies/all`);
      const response = await fetch(`${API_URL}/api/companies/all`);
      const data = await response.json();
      
      console.log('Companies response:', data);
      
      if (data.success && data.data.length > 0) {
        setCompaniesData(data.data);
      } else {
        setCompaniesData([]);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompaniesData([]);
    }
  };

  const addCompany = () => {
    setCompanyForm({
      name: '',
      logo: null,
      order: companiesData.length
    });
    setEditingCompany(null);
    setShowCompanyForm(true);
  };

  const handleEditCompany = (company: any) => {
    setCompanyForm({
      name: company.name,
      logo: null,
      order: company.order || 0
    });
    setEditingCompany(company);
    setShowCompanyForm(true);
  };

  const handleCompanySubmit = async () => {
    if (!companyForm.name) {
      toast({
        title: "Missing Information",
        description: "Please fill company name",
        variant: "destructive"
      });
      return;
    }

    if (!editingCompany && !companyForm.logo) {
      toast({
        title: "Missing Information",
        description: "Please upload a logo",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('name', companyForm.name);
      formData.append('order', companyForm.order.toString());
      if (companyForm.logo) {
        formData.append('logo', companyForm.logo);
      }

      const url = editingCompany 
        ? `${API_URL}/api/companies/${editingCompany._id}`
        : `${API_URL}/api/companies`;
      
      const method = editingCompany ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: editingCompany ? "Company updated" : "Company added",
        });
        setShowCompanyForm(false);
        setCompanyForm({ name: '', logo: null, order: 0 });
        setEditingCompany(null);
        fetchCompanies();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save company",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting company:', error);
      toast({
        title: "Error",
        description: "Failed to submit company",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteCompany = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/companies/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success!",
          description: "Company deleted",
        });
        fetchCompanies();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete company",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Error",
        description: "Failed to delete company",
        variant: "destructive"
      });
    }
  };

  // Contact Info Functions
  const fetchContactInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/api/contact-info`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setContactInfo(data.data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const saveContactInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/api/contact-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactInfo),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success!",
          description: "Contact info updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update contact info",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast({
        title: "Error",
        description: "Failed to save contact info",
        variant: "destructive"
      });
    }
  };

  // Bookings Functions
  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/booking/all`);
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/api/booking/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success!",
          description: "Booking status updated",
        });
        fetchBookings();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update status",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const addClient = () => {
    const newClient = {
      id: Date.now(),
      name: "New Client",
      logo: "NC",
      industry: "Industry",
      description: "Client description"
    };
    setClientsData([...clientsData, newClient]);
  };

  const deleteClient = (id: number) => {
    setClientsData(clientsData.filter(client => client.id !== id));
  };

  // Showcase Image Functions
  const handleAddImage = async () => {
    if (!newImage.title || !newImage.file) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and image",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', newImage.title);
      formData.append('image', newImage.file);
      formData.append('link', newImage.link || '');
      
      console.log('Sending image with data:', {
        title: newImage.title,
        link: newImage.link,
        hasFile: !!newImage.file
      });

      const response = await fetch(`${API_URL}/api/showcase`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (data.success) {
        toast({
          title: "Success!",
          description: "Image uploaded successfully",
        });
        setShowAddForm(false);
        setNewImage({ title: '', file: null, link: '' });
        fetchShowcaseImages();
      } else {
        toast({
          title: "Upload Failed",
          description: data.message || 'Failed to add image',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateImage = async (id: string, title: string, file: File | null, link?: string) => {
    setUploading(true);
    console.log('Updating image with:', { id, title, link, hasFile: !!file });
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('link', link || '');
      if (file) {
        formData.append('image', file);
      }

      const response = await fetch(`${API_URL}/api/showcase/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      console.log('Update response:', data);

      if (data.success) {
        toast({
          title: "Success!",
          description: "Image updated successfully",
        });
        setEditingImage(null);
        fetchShowcaseImages();
      } else {
        toast({
          title: "Update Failed",
          description: data.message || 'Failed to update image',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating image:', error);
      toast({
        title: "Error",
        description: "Failed to update image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/showcase/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: "Image deleted successfully",
        });
        fetchShowcaseImages();
      } else {
        toast({
          title: "Delete Failed",
          description: data.message || 'Failed to delete image',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addShowcaseImage = () => {
    setShowAddForm(true);
  };

  const deleteShowcaseImage = (id: number) => {
    setShowcaseData({
      ...showcaseData, 
      images: showcaseData.images.filter(img => img.id !== id)
    });
  };

  // Show loading if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-black text-white border-b border-gray-800">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Settings className="w-6 h-6" />
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/10"
                onClick={() => navigate("/")}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Eye className="w-4 h-4 mr-2" />
                Preview Site
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Website Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTab === "hero" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("hero")}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Hero Section
                </Button>
                <Button
                  variant={activeTab === "services" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("services")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Services
                </Button>
                <Button
                  variant={activeTab === "stats" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("stats")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Statistics
                </Button>
                <Button
                  variant={activeTab === "testimonials" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("testimonials")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Testimonials
                </Button>
                <Button
                  variant={activeTab === "companies" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("companies")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Companies
                </Button>
                <Button
                  variant={activeTab === "contact" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("contact")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Info
                </Button>
                <Button
                  variant={activeTab === "bookings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("bookings")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Bookings
                </Button>
                <Button
                  variant={activeTab === "clients" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("clients")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Latest Clients
                </Button>
                <Button
                  variant={activeTab === "showcase" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("showcase")}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Showcase Section
                </Button>
                <Button
                  variant={activeTab === "pricing" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("pricing")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Pricing Plans
                </Button>
                <Button
                  variant={activeTab === "leads" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("leads")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Leads
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold capitalize">{activeTab} Management</h2>
              {activeTab !== "services" && activeTab !== "leads" && activeTab !== "showcase" && activeTab !== "pricing" && activeTab !== "testimonials" && activeTab !== "companies" && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                  {isEditing && (
                    <Button 
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Hero Section */}
            {activeTab === "hero" && (
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Main Title</label>
                    <Input
                      value={heroData.title}
                      onChange={(e) => setHeroData({...heroData, title: e.target.value})}
                      disabled={!isEditing}
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                    <Textarea
                      value={heroData.subtitle}
                      onChange={(e) => setHeroData({...heroData, subtitle: e.target.value})}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Primary CTA</label>
                      <Input
                        value={heroData.primaryCTA}
                        onChange={(e) => setHeroData({...heroData, primaryCTA: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Secondary CTA</label>
                      <Input
                        value={heroData.secondaryCTA}
                        onChange={(e) => setHeroData({...heroData, secondaryCTA: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services Section */}
            {activeTab === "services" && (
              <div className="space-y-6">
                {/* Header with Add Button */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Services Management</h3>
                    <p className="text-sm text-muted-foreground">Manage your services that appear on the website</p>
                  </div>
                  <Button onClick={addService}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </div>

                {/* Services List */}
                {servicesData.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No services added yet. Click "Add Service" to create your first service.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {servicesData.map((service, index) => (
                      <Card key={service.id || service._id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg mb-2">{service.title}</h4>
                              <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {(service.features || []).map((feature: string, idx: number) => (
                                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditService(service)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteService(service.id || service._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Add/Edit Service Form Popup */}
                {showServiceForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-2xl mx-4 border-2 border-blue-500">
                      <CardHeader className="flex flex-row items-center justify-between bg-blue-50">
                        <CardTitle className="text-lg">
                          {editingService ? 'Edit Service' : 'Add New Service'}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowServiceForm(false);
                            setServiceForm({ title: '', description: '', features: '', icon: 'Briefcase' });
                            setEditingService(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Service Title *</label>
                          <Input
                            value={serviceForm.title}
                            onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})}
                            placeholder="e.g., Web Development"
                            disabled={uploading}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Description *</label>
                          <Textarea
                            value={serviceForm.description}
                            onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                            placeholder="Brief description of the service"
                            rows={3}
                            disabled={uploading}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Features (comma-separated)</label>
                          <Input
                            value={serviceForm.features}
                            onChange={(e) => setServiceForm({...serviceForm, features: e.target.value})}
                            placeholder="Feature 1, Feature 2, Feature 3"
                            disabled={uploading}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Separate features with commas
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Icon</label>
                          <select
                            value={serviceForm.icon}
                            onChange={(e) => setServiceForm({...serviceForm, icon: e.target.value})}
                            className="w-full px-3 py-2 border rounded-md"
                            disabled={uploading}
                          >
                            <option value="Briefcase">Briefcase</option>
                            <option value="Code">Code</option>
                            <option value="Target">Target</option>
                            <option value="Megaphone">Megaphone</option>
                            <option value="TrendingUp">Trending Up</option>
                            <option value="Rocket">Rocket</option>
                          </select>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={handleServiceSubmit}
                            disabled={uploading}
                            className="flex-1"
                          >
                            {uploading ? (
                              <>
                                <span className="animate-spin mr-2">⏳</span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                {editingService ? 'Update Service' : 'Add Service'}
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowServiceForm(false);
                              setServiceForm({ title: '', description: '', features: '', icon: 'Briefcase' });
                              setEditingService(null);
                            }}
                            disabled={uploading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Statistics Section */}
            {activeTab === "stats" && (
              <Card>
                <CardHeader>
                  <CardTitle>Website Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {statsData.map((stat, index) => (
                      <div key={index} className="space-y-2">
                        <label className="block text-sm font-medium">Stat {index + 1}</label>
                        <Input
                          placeholder="Label"
                          value={stat.label}
                          onChange={(e) => {
                            const updated = [...statsData];
                            updated[index] = {...stat, label: e.target.value};
                            setStatsData(updated);
                          }}
                          disabled={!isEditing}
                        />
                        <Input
                          placeholder="Value"
                          value={stat.value}
                          onChange={(e) => {
                            const updated = [...statsData];
                            updated[index] = {...stat, value: e.target.value};
                            setStatsData(updated);
                          }}
                          disabled={!isEditing}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Testimonials Section */}
            {activeTab === "testimonials" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Testimonials Management</h3>
                    <p className="text-sm text-muted-foreground">Manage customer testimonials displayed on the website</p>
                  </div>
                  <Button onClick={addTestimonial}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Testimonial
                  </Button>
                </div>

                {testimonialsData.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No testimonials added yet. Click "Add Testimonial" to create your first testimonial.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {testimonialsData.map((testimonial, index) => (
                      <Card key={testimonial._id || index} className={!testimonial.active ? 'border-yellow-500 bg-yellow-50/50' : ''}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                                {!testimonial.active && (
                                  <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                                    Pending Review
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{testimonial.role}</p>
                              {testimonial.company && (
                                <p className="text-xs text-muted-foreground mb-3">{testimonial.company}</p>
                              )}
                              <p className="text-sm text-foreground mb-3 italic">"{testimonial.content}"</p>
                              <div className="flex items-center gap-1">
                                {[...Array(testimonial.rating || 5)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                variant={testimonial.active ? "outline" : "default"}
                                size="sm"
                                onClick={() => toggleTestimonialActive(testimonial)}
                                className={testimonial.active ? '' : 'bg-green-600 hover:bg-green-700 text-white'}
                              >
                                {testimonial.active ? 'Hide' : 'Publish'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditTestimonial(testimonial)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteTestimonial(testimonial._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Add/Edit Testimonial Form Popup */}
                {showTestimonialForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
                    <Card className="w-full max-w-2xl mx-4 my-8 border-2 border-blue-500">
                      <CardHeader className="flex flex-row items-center justify-between bg-blue-50">
                        <CardTitle className="text-lg">
                          {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowTestimonialForm(false);
                            setTestimonialForm({
                              name: '',
                              role: '',
                              company: '',
                              content: '',
                              rating: 5,
                              order: 0
                            });
                            setEditingTestimonial(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name *</label>
                            <Input
                              value={testimonialForm.name}
                              onChange={(e) => setTestimonialForm({...testimonialForm, name: e.target.value})}
                              placeholder="e.g., John Doe"
                              disabled={uploading}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Role *</label>
                            <Input
                              value={testimonialForm.role}
                              onChange={(e) => setTestimonialForm({...testimonialForm, role: e.target.value})}
                              placeholder="e.g., CEO"
                              disabled={uploading}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Company (Optional)</label>
                          <Input
                            value={testimonialForm.company}
                            onChange={(e) => setTestimonialForm({...testimonialForm, company: e.target.value})}
                            placeholder="e.g., TechCorp Inc"
                            disabled={uploading}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Testimonial Content *</label>
                          <Textarea
                            value={testimonialForm.content}
                            onChange={(e) => setTestimonialForm({...testimonialForm, content: e.target.value})}
                            placeholder="Write the testimonial content here..."
                            rows={4}
                            disabled={uploading}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Rating (1-5)</label>
                            <Input
                              type="number"
                              min="1"
                              max="5"
                              value={testimonialForm.rating}
                              onChange={(e) => setTestimonialForm({...testimonialForm, rating: parseInt(e.target.value) || 5})}
                              disabled={uploading}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Display Order</label>
                            <Input
                              type="number"
                              value={testimonialForm.order}
                              onChange={(e) => setTestimonialForm({...testimonialForm, order: parseInt(e.target.value) || 0})}
                              placeholder="0"
                              disabled={uploading}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={handleTestimonialSubmit}
                            disabled={uploading}
                            className="flex-1"
                          >
                            {uploading ? (
                              <>
                                <span className="animate-spin mr-2">⏳</span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowTestimonialForm(false);
                              setTestimonialForm({
                                name: '',
                                role: '',
                                company: '',
                                content: '',
                                rating: 5,
                                order: 0
                              });
                              setEditingTestimonial(null);
                            }}
                            disabled={uploading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Companies Section */}
            {activeTab === "companies" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Companies Management</h3>
                    <p className="text-sm text-muted-foreground">Manage companies displayed in testimonials section</p>
                  </div>
                  <Button onClick={addCompany}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Company
                  </Button>
                </div>

                {companiesData.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No companies added yet. Click "Add Company" to create your first company.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {companiesData.map((company, index) => (
                      <Card key={company._id || index}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <img 
                                src={company.logo} 
                                alt={company.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-mono-200"
                              />
                              <div>
                                <h4 className="font-semibold text-lg">{company.name}</h4>
                                <p className="text-sm text-muted-foreground">Order: {company.order}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCompany(company)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteCompany(company._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Add/Edit Company Form Popup */}
                {showCompanyForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-lg mx-4 border-2 border-blue-500">
                      <CardHeader className="flex flex-row items-center justify-between bg-blue-50">
                        <CardTitle className="text-lg">
                          {editingCompany ? 'Edit Company' : 'Add New Company'}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowCompanyForm(false);
                            setCompanyForm({ name: '', logo: null, order: 0 });
                            setEditingCompany(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Company Name *</label>
                          <Input
                            value={companyForm.name}
                            onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                            placeholder="e.g., TechCorp"
                            disabled={uploading}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Company Logo * {editingCompany && '(Upload new to replace)'}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setCompanyForm({...companyForm, logo: file});
                              }
                            }}
                            disabled={uploading}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {companyForm.logo && (
                            <p className="text-xs text-green-600 mt-2">
                              Selected: {companyForm.logo.name}
                            </p>
                          )}
                          {editingCompany && !companyForm.logo && (
                            <div className="mt-2">
                              <img 
                                src={editingCompany.logo} 
                                alt={editingCompany.name}
                                className="w-16 h-16 rounded-full object-cover border-2"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Display Order</label>
                          <Input
                            type="number"
                            value={companyForm.order}
                            onChange={(e) => setCompanyForm({...companyForm, order: parseInt(e.target.value) || 0})}
                            placeholder="0"
                            disabled={uploading}
                          />
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={handleCompanySubmit}
                            disabled={uploading}
                            className="flex-1"
                          >
                            {uploading ? (
                              <>
                                <span className="animate-spin mr-2">⏳</span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                {editingCompany ? 'Update Company' : 'Add Company'}
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowCompanyForm(false);
                              setCompanyForm({ name: '', logo: null, order: 0 });
                              setEditingCompany(null);
                            }}
                            disabled={uploading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Contact Info Section */}
            {activeTab === "contact" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <Button onClick={saveContactInfo}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <Input
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <Input
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Address</label>
                      <Input
                        value={contactInfo.address}
                        onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                        placeholder="City, State/Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Schedule Call Link (Optional)</label>
                      <Input
                        value={contactInfo.scheduleCallLink}
                        onChange={(e) => setContactInfo({ ...contactInfo, scheduleCallLink: e.target.value })}
                        placeholder="https://calendly.com/your-link"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Add a Calendly or similar scheduling link. Leave empty to disable the button.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Bookings Section */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Service Bookings ({bookings.length})</h3>
                </div>

                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking._id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{booking.serviceName}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{booking.description}</p>
                            </div>
                            <select
                              value={booking.status}
                              onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                              className="px-3 py-1.5 border border-border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Customer:</span>
                              <p className="font-medium">{booking.userName}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Email:</span>
                              <p className="font-medium">{booking.userEmail}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Phone:</span>
                              <p className="font-medium">{booking.userPhone}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Booked on:</span>
                              <p className="font-medium">{new Date(booking.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">No bookings yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Latest Clients Section */}
            {activeTab === "clients" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Latest Clients ({clientsData.length})</h3>
                  {isEditing && (
                    <Button onClick={addClient}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Client
                    </Button>
                  )}
                </div>
                
                {clientsData.map((client, index) => (
                  <Card key={client.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Client {index + 1}</CardTitle>
                      {isEditing && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteClient(client.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Client Name</label>
                          <Input
                            value={client.name}
                            onChange={(e) => {
                              const updated = clientsData.map(c => 
                                c.id === client.id ? {...c, name: e.target.value} : c
                              );
                              setClientsData(updated);
                            }}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Logo (2 letters)</label>
                          <Input
                            value={client.logo}
                            maxLength={2}
                            onChange={(e) => {
                              const updated = clientsData.map(c => 
                                c.id === client.id ? {...c, logo: e.target.value.toUpperCase()} : c
                              );
                              setClientsData(updated);
                            }}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Industry</label>
                        <Input
                          value={client.industry}
                          onChange={(e) => {
                            const updated = clientsData.map(c => 
                              c.id === client.id ? {...c, industry: e.target.value} : c
                            );
                            setClientsData(updated);
                          }}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                          value={client.description}
                          onChange={(e) => {
                            const updated = clientsData.map(c => 
                              c.id === client.id ? {...c, description: e.target.value} : c
                            );
                            setClientsData(updated);
                          }}
                          disabled={!isEditing}
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Showcase Section */}
            {activeTab === "showcase" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Showcase Text Paragraph</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Main Paragraph (will be displayed in bold)
                      </label>
                      <Textarea
                        value={showcaseData.text.join(' ')}
                        onChange={(e) => {
                          const text = e.target.value;
                          setShowcaseData({...showcaseData, text: [text, '', '', '']});
                        }}
                        disabled={!isEditing}
                        rows={6}
                        placeholder="Enter your showcase paragraph here..."
                        className="text-base"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        This text will be displayed as a bold paragraph on the left side of the showcase section.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Carousel Images</CardTitle>
                    <Button onClick={addShowcaseImage} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Image
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {showcaseImages.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p className="text-lg mb-2">No images added yet</p>
                        <p className="text-sm">Click "Add Image" button above to add your first showcase image</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {showcaseImages.map((image, index) => (
                          <div key={image._id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                            <span className="text-sm font-medium text-gray-500 min-w-[30px]">#{index + 1}</span>
                            <div className="w-16 h-16 rounded overflow-hidden border">
                              <img 
                                src={image.imageUrl} 
                                alt={image.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{image.title}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">{image.imageUrl}</p>
                              {image.link && (
                                <p className="text-xs text-blue-600 truncate max-w-[200px] mt-1">
                                  🔗 {image.link}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingImage({
                                    id: image._id,
                                    name: image.title,
                                    url: image.imageUrl,
                                    link: image.link || ''
                                  });
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteImage(image._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Add Image Form */}
                {showAddForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-lg mx-4 border-2 border-green-500">
                    <CardHeader className="flex flex-row items-center justify-between bg-green-50">
                      <CardTitle className="text-lg">Add New Image</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowAddForm(false);
                          setNewImage({ title: '', file: null, link: '' });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Image Title *</label>
                        <Input
                          value={newImage.title}
                          onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                          placeholder="e.g., Project Showcase 1"
                          disabled={uploading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Link URL (Optional)</label>
                        <Input
                          value={newImage.link}
                          onChange={(e) => setNewImage({...newImage, link: e.target.value})}
                          placeholder="e.g., https://example.com"
                          disabled={uploading}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Add a link to make the image clickable
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Upload Image *</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setNewImage({...newImage, file});
                            }
                          }}
                          disabled={uploading}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {newImage.file && (
                          <p className="text-xs text-green-600 mt-2">
                            Selected: {newImage.file.name}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleAddImage}
                          disabled={uploading || !newImage.title || !newImage.file}
                          className="flex-1"
                        >
                          {uploading ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Upload & Save
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowAddForm(false);
                            setNewImage({ title: '', file: null, link: '' });
                          }}
                          disabled={uploading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  </div>
                )}

                {/* Edit Image Form */}
                {editingImage && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-lg mx-4 border-2 border-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between bg-blue-50">
                      <CardTitle className="text-lg">Edit Image: {editingImage.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingImage(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Image Title</label>
                        <Input
                          value={editingImage.name}
                          onChange={(e) => {
                            setEditingImage({...editingImage, name: e.target.value});
                          }}
                          placeholder="e.g., Project Showcase 1"
                          disabled={uploading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Link URL (Optional)</label>
                        <Input
                          value={editingImage.link || ''}
                          onChange={(e) => {
                            setEditingImage({...editingImage, link: e.target.value});
                          }}
                          placeholder="e.g., https://example.com"
                          disabled={uploading}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Add a link to make the image clickable
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Current Image</label>
                        <img 
                          src={editingImage.url} 
                          alt={editingImage.name}
                          className="w-full h-48 object-cover rounded-lg border mb-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Upload New Image (optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Store file temporarily for upload
                              (editingImage as any).newFile = file;
                            }
                          }}
                          disabled={uploading}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={() => {
                            handleUpdateImage(
                              editingImage.id.toString(),
                              editingImage.name,
                              (editingImage as any).newFile || null,
                              editingImage.link
                            );
                          }}
                          disabled={uploading}
                          className="flex-1"
                        >
                          {uploading ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Update Image
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingImage(null)}
                          disabled={uploading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  </div>
                )}
              </div>
            )}

            {/* Pricing Plans Section */}
            {activeTab === "pricing" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Pricing Plans Management</h3>
                    <p className="text-sm text-muted-foreground">Manage pricing plans displayed on the pricing page</p>
                  </div>
                  <Button onClick={addPricingPlan}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Plan
                  </Button>
                </div>

                {pricingPlans.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No pricing plans added yet. Click "Add Plan" to create your first plan.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {pricingPlans.map((plan, index) => (
                      <Card key={plan._id || index}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-lg">{plan.name}</h4>
                                {plan.popular && (
                                  <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-2xl font-bold text-foreground mb-2">{plan.price}</p>
                              <p className="text-xs text-muted-foreground mb-2">{plan.period}</p>
                              <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {(plan.features || []).slice(0, 5).map((feature: string, idx: number) => (
                                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {feature}
                                  </span>
                                ))}
                                {plan.features && plan.features.length > 5 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{plan.features.length - 5} more
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditPlan(plan)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deletePricingPlan(plan._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Add/Edit Pricing Form Popup */}
                {showPricingForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
                    <Card className="w-full max-w-2xl mx-4 my-8 border-2 border-blue-500">
                      <CardHeader className="flex flex-row items-center justify-between bg-blue-50">
                        <CardTitle className="text-lg">
                          {editingPlan ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowPricingForm(false);
                            setPricingForm({
                              name: '',
                              price: '',
                              period: '',
                              description: '',
                              icon: 'Zap',
                              popular: false,
                              features: '',
                              cta: 'Get Started',
                              color: 'from-mono-50/80 to-mono-100/60',
                              order: 0
                            });
                            setEditingPlan(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-6 max-h-[70vh] overflow-y-auto">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Plan Name *</label>
                            <Input
                              value={pricingForm.name}
                              onChange={(e) => setPricingForm({...pricingForm, name: e.target.value})}
                              placeholder="e.g., Starter"
                              disabled={uploading}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Price *</label>
                            <Input
                              value={pricingForm.price}
                              onChange={(e) => setPricingForm({...pricingForm, price: e.target.value})}
                              placeholder="e.g., $2,999"
                              disabled={uploading}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Period *</label>
                          <Input
                            value={pricingForm.period}
                            onChange={(e) => setPricingForm({...pricingForm, period: e.target.value})}
                            placeholder="e.g., one-time, monthly, per year"
                            disabled={uploading}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Description *</label>
                          <Textarea
                            value={pricingForm.description}
                            onChange={(e) => setPricingForm({...pricingForm, description: e.target.value})}
                            placeholder="Brief description of the plan"
                            rows={2}
                            disabled={uploading}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Features (comma-separated)</label>
                          <Textarea
                            value={pricingForm.features}
                            onChange={(e) => setPricingForm({...pricingForm, features: e.target.value})}
                            placeholder="Feature 1, Feature 2, Feature 3"
                            rows={4}
                            disabled={uploading}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Separate features with commas
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Icon</label>
                            <select
                              value={pricingForm.icon}
                              onChange={(e) => setPricingForm({...pricingForm, icon: e.target.value})}
                              className="w-full px-3 py-2 border rounded-md"
                              disabled={uploading}
                            >
                              <option value="Zap">Zap</option>
                              <option value="Star">Star</option>
                              <option value="Crown">Crown</option>
                              <option value="Rocket">Rocket</option>
                              <option value="Target">Target</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">CTA Button Text</label>
                            <Input
                              value={pricingForm.cta}
                              onChange={(e) => setPricingForm({...pricingForm, cta: e.target.value})}
                              placeholder="e.g., Get Started"
                              disabled={uploading}
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Color Gradient</label>
                            <select
                              value={pricingForm.color}
                              onChange={(e) => setPricingForm({...pricingForm, color: e.target.value})}
                              className="w-full px-3 py-2 border rounded-md"
                              disabled={uploading}
                            >
                              <option value="from-mono-50/80 to-mono-100/60">Gray</option>
                              <option value="from-primary/10 to-primary/5">Primary (Popular)</option>
                              <option value="from-mono-100/60 to-mono-50/80">Dark Gray</option>
                              <option value="from-blue-50/80 to-blue-100/60">Blue</option>
                              <option value="from-green-50/80 to-green-100/60">Green</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Display Order</label>
                            <Input
                              type="number"
                              value={pricingForm.order}
                              onChange={(e) => setPricingForm({...pricingForm, order: parseInt(e.target.value) || 0})}
                              placeholder="0"
                              disabled={uploading}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="popular"
                            checked={pricingForm.popular}
                            onChange={(e) => setPricingForm({...pricingForm, popular: e.target.checked})}
                            disabled={uploading}
                            className="w-4 h-4"
                          />
                          <label htmlFor="popular" className="text-sm font-medium">
                            Mark as Popular Plan
                          </label>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={handlePricingSubmit}
                            disabled={uploading}
                            className="flex-1"
                          >
                            {uploading ? (
                              <>
                                <span className="animate-spin mr-2">⏳</span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                {editingPlan ? 'Update Plan' : 'Add Plan'}
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowPricingForm(false);
                              setPricingForm({
                                name: '',
                                price: '',
                                period: '',
                                description: '',
                                icon: 'Zap',
                                popular: false,
                                features: '',
                                cta: 'Get Started',
                                color: 'from-mono-50/80 to-mono-100/60',
                                order: 0
                              });
                              setEditingPlan(null);
                            }}
                            disabled={uploading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Leads Section */}
            {activeTab === "leads" && (
              <div className="space-y-6">
                <LeadsManagement />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

// Leads Management Component
const LeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1
  });

  // Fetch leads from backend
  const fetchLeads = async () => {
    try {
      setLoading(true);
      console.log('Fetching leads from:', `${API_BASE_URL}/leads?limit=100`);
      const response = await fetch(`${API_BASE_URL}/leads?limit=100`);
      const data = await response.json();
      
      console.log('Leads response:', data);
      
      if (data.success) {
        // Backend returns data.data as array directly
        const allLeads = Array.isArray(data.data) ? data.data : [];
        console.log('All leads:', allLeads);
        
        let filteredLeads = allLeads;
        
        // Apply filters
        if (filters.status) {
          filteredLeads = filteredLeads.filter((l: any) => l.status === filters.status);
        }
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredLeads = filteredLeads.filter((l: any) => 
            l.name.toLowerCase().includes(searchLower) ||
            l.email.toLowerCase().includes(searchLower) ||
            (l.company && l.company.toLowerCase().includes(searchLower))
          );
        }
        
        setLeads(filteredLeads);
        
        // Calculate stats from all leads (not filtered)
        const totalLeads = allLeads.length;
        const newLeads = allLeads.filter((l: any) => l.status === 'New').length;
        const qualifiedLeads = allLeads.filter((l: any) => l.status === 'Qualified').length;
        const convertedLeads = allLeads.filter((l: any) => l.convertedToClient).length;
        const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';
        
        setStats({
          totalLeads,
          newLeads,
          qualifiedLeads,
          convertedLeads,
          conversionRate
        });
      } else {
        console.error('Failed to fetch leads:', data.message);
        setLeads([]);
        setStats({
          totalLeads: 0,
          newLeads: 0,
          qualifiedLeads: 0,
          convertedLeads: 0,
          conversionRate: '0'
        });
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]);
      setStats({
        totalLeads: 0,
        newLeads: 0,
        qualifiedLeads: 0,
        convertedLeads: 0,
        conversionRate: '0'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p>Loading leads...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
              <div className="text-sm text-muted-foreground">Total Leads</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.newLeads}</div>
              <div className="text-sm text-muted-foreground">New Leads</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.qualifiedLeads}</div>
              <div className="text-sm text-muted-foreground">Qualified</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.convertedLeads}</div>
              <div className="text-sm text-muted-foreground">Converted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.conversionRate}%</div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search leads..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="md:w-64"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All Status</option>
              <option value="New">New</option>
              <option value="Qualified">Qualified</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leads ({leads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Contact</th>
                  <th className="text-left p-2">Company</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Priority</th>
                  <th className="text-left p-2">Score</th>
                  <th className="text-left p-2">Source</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead: any) => (
                  <tr key={lead._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="font-medium">{lead.name}</div>
                      {lead.name === 'Anonymous Visitor' && lead.metadata?.visitorType === 'anonymous' && (
                        <span className="text-xs text-gray-500 italic">Visitor</span>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="text-sm">
                        <div className="truncate max-w-[200px]">{lead.email}</div>
                        {lead.phone && <div className="text-gray-500">{lead.phone}</div>}
                      </div>
                    </td>
                    <td className="p-2 text-sm">{lead.company || '-'}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(lead.priority)}`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                          {lead.score}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-sm max-w-[150px] truncate">{lead.source}</td>
                    <td className="p-2 text-sm">
                      {new Date(lead.createdAt).toLocaleDateString()}
                      <div className="text-xs text-gray-500">
                        {new Date(lead.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            // Show lead details in alert for now
                            const details = `
Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone || 'N/A'}
Company: ${lead.company || 'N/A'}
Source: ${lead.source}
Status: ${lead.status}
Priority: ${lead.priority}
Score: ${lead.score}
Message: ${lead.message || 'N/A'}
${lead.metadata?.currentPage ? `\nPage Visited: ${lead.metadata.currentPage}` : ''}
${lead.metadata?.referrer ? `\nReferrer: ${lead.metadata.referrer}` : ''}
${lead.metadata?.userAgent ? `\nDevice: ${lead.metadata.userAgent}` : ''}
                            `.trim();
                            alert(details);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {leads.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No leads found</p>
              <p className="text-sm">Leads will appear here when users register or visit your website</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;