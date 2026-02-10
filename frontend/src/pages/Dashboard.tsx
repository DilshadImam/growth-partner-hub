import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  User, 
  Mail,
  Phone,
  Edit,
  Save,
  X,
  Calendar,
  Package,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  });
  const [editedData, setEditedData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [bookedServices, setBookedServices] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userAuth = localStorage.getItem('userAuth');
    const userType = localStorage.getItem('userType');
    
    if (userAuth === 'true' && (userType === 'user' || userType === 'visitor')) {
      setIsAuthenticated(true);
      fetchUserProfile();
      fetchUserBookings();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserBookings = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) return;

      const response = await fetch(`${API_URL}/api/booking/user/${email}`);
      const data = await response.json();
      
      if (data.success) {
        setBookedServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      
      if (!email) {
        // Fallback to localStorage
        const name = localStorage.getItem('userName') || 'User';
        const phone = localStorage.getItem('userPhone') || '';
        const avatar = localStorage.getItem('userAvatar') || '';
        
        setUserData({ name, email: '', phone, avatar });
        setEditedData({ name, email: '', phone });
        setImagePreview(avatar);
        return;
      }

      const response = await fetch(`${API_URL}/api/profile/${email}`);
      const data = await response.json();
      
      if (data.success) {
        setUserData(data.data);
        setEditedData({
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone
        });
        setImagePreview(data.data.avatar || '');
        
        // Update localStorage
        localStorage.setItem('userName', data.data.name);
        localStorage.setItem('userPhone', data.data.phone || '');
        localStorage.setItem('userAvatar', data.data.avatar || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to localStorage
      const name = localStorage.getItem('userName') || 'User';
      const email = localStorage.getItem('userEmail') || '';
      const phone = localStorage.getItem('userPhone') || '';
      const avatar = localStorage.getItem('userAvatar') || '';
      
      setUserData({ name, email, phone, avatar });
      setEditedData({ name, email, phone });
      setImagePreview(avatar);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setEditedData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone
      });
      setSelectedImage(null);
      setImagePreview(userData.avatar);
    }
    setIsEditing(!isEditing);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
      const email = localStorage.getItem('userEmail');
      
      if (!email) {
        toast({
          title: "Error",
          description: "User email not found. Please login again.",
          variant: "destructive"
        });
        return;
      }

      const formData = new FormData();
      formData.append('name', editedData.name);
      formData.append('phone', editedData.phone);
      
      if (selectedImage) {
        formData.append('avatar', selectedImage);
      }

      const response = await fetch(`${API_URL}/api/profile/${email}`, {
        method: 'PUT',
        body: formData,
      });
      
      const data = await response.json();

      if (data.success) {
        // Update localStorage
        localStorage.setItem('userName', data.data.name);
        localStorage.setItem('userPhone', data.data.phone || '');
        localStorage.setItem('userAvatar', data.data.avatar || '');
        
        // Update state
        setUserData(data.data);
        setImagePreview(data.data.avatar || '');
        
        setIsEditing(false);
        setSelectedImage(null);
        
        toast({
          title: "Profile Updated!",
          description: "Your profile has been updated successfully",
        });

        // Reload page to update header avatar
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast({
          title: "Update Failed",
          description: data.message || "Failed to update profile",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Accepted': return 'bg-blue-100 text-blue-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your profile and view your bookings</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Profile</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditToggle}
                    >
                      {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Profile Image */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Profile" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center border-4 border-gray-200">
                          <span className="text-4xl font-bold text-primary-foreground">
                            {userData.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                          <Upload className="w-4 h-4 text-white" />
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageSelect}
                          />
                        </label>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mt-3">{userData.name}</h3>
                    <p className="text-sm text-muted-foreground">Member</p>
                  </div>

                  {/* Profile Info */}
                  <div className="space-y-3 pt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Name</label>
                      {isEditing ? (
                        <Input
                          value={editedData.name}
                          onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                          placeholder="Your name"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{userData.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">Email</label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedData.email}
                          onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                          placeholder="your@email.com"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{userData.email}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">Phone</label>
                      {isEditing ? (
                        <Input
                          value={editedData.phone}
                          onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{userData.phone}</span>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <Button 
                        className="w-full mt-4" 
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booked Services */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Booked Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingBookings ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading bookings...</p>
                    </div>
                  ) : bookedServices.length > 0 ? (
                    <div className="space-y-4">
                      {bookedServices.map((service) => (
                        <div key={service._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{service.serviceName}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                              {service.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                            <Calendar className="w-4 h-4" />
                            <span>Booked on {new Date(service.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">No services booked yet</p>
                      <Button onClick={() => navigate('/services')}>
                        Browse Services
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
