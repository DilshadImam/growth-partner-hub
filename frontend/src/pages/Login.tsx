import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, User, Shield, Eye, EyeOff } from "lucide-react";
import { API_URL } from "@/config";

export default function Login() {
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [userCredentials, setUserCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState({ admin: false, user: false });
  const [errors, setErrors] = useState({ admin: "", user: "" });
  const [loading, setLoading] = useState({ admin: false, user: false });
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading({ ...loading, admin: true });
    setErrors({ ...errors, admin: "" });

    try {
      // Simple admin authentication - in real app, this would be proper auth
      if (adminCredentials.username === "admin" && adminCredentials.password === "admin123") {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('userType', 'admin');
        navigate('/admin');
      } else {
        setErrors({ ...errors, admin: "Invalid admin credentials. Use admin/admin123" });
      }
    } catch (error) {
      setErrors({ ...errors, admin: "Login failed. Please try again." });
    } finally {
      setLoading({ ...loading, admin: false });
    }
  };

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading({ ...loading, user: true });
    setErrors({ ...errors, user: "" });

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userCredentials.email,
          password: userCredentials.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem('userAuth', 'true');
        localStorage.setItem('userType', data.data.user.role);
        localStorage.setItem('userEmail', data.data.user.email);
        localStorage.setItem('userName', data.data.user.name);
        localStorage.setItem('userPhone', data.data.user.phone || '');
        localStorage.setItem('userAvatar', data.data.user.avatar || '');
        localStorage.setItem('authToken', data.data.token);
        
        // Redirect based on role
        if (data.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setErrors({ ...errors, user: data.message || "Invalid credentials" });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ ...errors, user: "Login failed. Please try again." });
    } finally {
      setLoading({ ...loading, user: false });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your account
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  User Login
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin Login
                </TabsTrigger>
              </TabsList>

              {/* User Login */}
              <TabsContent value="user" className="space-y-4 mt-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">User Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Access your personal dashboard and account
                  </p>
                </div>

                <form onSubmit={handleUserLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input
                      type="email"
                      value={userCredentials.email}
                      onChange={(e) => setUserCredentials({...userCredentials, email: e.target.value})}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword.user ? "text" : "password"}
                        value={userCredentials.password}
                        onChange={(e) => setUserCredentials({...userCredentials, password: e.target.value})}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({...showPassword, user: !showPassword.user})}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword.user ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {errors.user && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                      {errors.user}
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading.user}
                  >
                    {loading.user ? "Signing in..." : "Sign In"}
                  </Button>
                  
                  <div className="text-center text-sm mt-4">
                    <span className="text-muted-foreground">Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      className="text-primary hover:underline font-medium"
                    >
                      Register here
                    </button>
                  </div>
                </form>
              </TabsContent>

              {/* Admin Login */}
              <TabsContent value="admin" className="space-y-4 mt-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">Admin Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Access the admin panel to manage the website
                  </p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <Input
                      type="text"
                      value={adminCredentials.username}
                      onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                      placeholder="Enter admin username"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword.admin ? "text" : "password"}
                        value={adminCredentials.password}
                        onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                        placeholder="Enter admin password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({...showPassword, admin: !showPassword.admin})}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword.admin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {errors.admin && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                      {errors.admin}
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full bg-black hover:bg-gray-800" 
                    disabled={loading.admin}
                  >
                    {loading.admin ? "Signing in..." : "Access Admin Panel"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="text-sm"
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}