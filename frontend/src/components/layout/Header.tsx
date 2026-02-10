import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Services", href: "/services", type: "route" },
  { label: "Pricing", href: "/pricing", type: "route" },
  { label: "About", href: "/about", type: "route" },
  { label: "Contact Us", href: "/contact", type: "route" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userAvatar, setUserAvatar] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check auth status
    const checkAuthStatus = () => {
      const adminAuth = localStorage.getItem('adminAuth');
      const userAuth = localStorage.getItem('userAuth');
      const currentUserType = localStorage.getItem('userType');
      const storedUserName = localStorage.getItem('userName');
      const storedUserAvatar = localStorage.getItem('userAvatar');
      
      if (adminAuth === 'true' || userAuth === 'true') {
        setIsLoggedIn(true);
        setUserType(currentUserType);
        setUserName(storedUserName || 'User');
        setUserAvatar(storedUserAvatar || '');
      } else {
        setIsLoggedIn(false);
        setUserType(null);
        setUserName('');
        setUserAvatar('');
      }
    };

    // Check on mount
    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab or after login)
    window.addEventListener('storage', checkAuthStatus);
    
    // Also check periodically (for same-tab updates)
    const interval = setInterval(checkAuthStatus, 500);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('userAuth');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhone');
    setIsLoggedIn(false);
    setUserType(null);
    navigate('/');
  };

  const handleNavClick = (item: typeof navItems[0]) => {
    navigate(item.href);
    setIsOpen(false); // Close mobile menu
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <span className="text-black font-heading font-bold text-lg">B</span>
            </div>
            <span className="font-heading font-bold text-xl text-white">BrandLoom</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => navigate("/")}
              className="text-white/70 hover:text-white transition-colors text-sm font-medium cursor-pointer flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="text-white/70 hover:text-white transition-colors text-sm font-medium cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn && (userType === 'user' || userType === 'visitor') ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center hover:scale-105 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 overflow-hidden">
                    {userAvatar ? (
                      <img 
                        src={userAvatar} 
                        alt={userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-primary-foreground font-semibold text-base">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {userName}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button size="sm" className="bg-white text-black hover:bg-white/90">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-sm border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              <button
                onClick={() => {
                  navigate("/");
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-base font-medium py-2 w-full text-left"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className="block text-white/70 hover:text-white transition-colors text-base font-medium py-2 w-full text-left"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 space-y-3">
                {isLoggedIn && (userType === 'user' || userType === 'visitor') ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 bg-white/10 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
                        {userAvatar ? (
                          <img 
                            src={userAvatar} 
                            alt={userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-primary-foreground font-semibold text-base">
                            {userName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-white font-medium">{userName}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 text-white hover:bg-white/10"
                      onClick={() => {
                        navigate('/dashboard');
                        setIsOpen(false);
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 text-white hover:bg-white/10"
                      onClick={() => navigate('/login')}
                    >
                      Login
                    </Button>
                    <Button className="w-full bg-white text-black hover:bg-white/90">
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
