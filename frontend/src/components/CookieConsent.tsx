import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => {
        setShowBanner(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    
    // Enable analytics or tracking here if needed
    console.log('Cookies accepted');
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    
    // Disable analytics or tracking here if needed
    console.log('Cookies rejected');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-1000">
      <div className="w-full bg-white border-t-2 border-black shadow-2xl">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between gap-6">
            {/* Left side - Icon and Text */}
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-shrink-0 hidden sm:block">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-base font-bold text-foreground mb-1.5">
                  We value your privacy
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use cookies to enhance your experience. By clicking "Accept", you consent to our use of cookies.{" "}
                  <a href="/privacy-policy" className="underline hover:text-foreground font-medium">
                    Learn more
                  </a>
                </p>
              </div>
            </div>

            {/* Right side - Buttons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Button
                onClick={handleReject}
                variant="outline"
                size="default"
                className="border-black text-black hover:bg-black/5 h-10 px-6 text-sm"
              >
                Reject
              </Button>
              <Button
                onClick={handleAccept}
                size="default"
                className="bg-black text-white hover:bg-black/90 h-10 px-6 text-sm"
              >
                Accept All
              </Button>
              <Button
                onClick={() => setShowBanner(false)}
                variant="ghost"
                size="default"
                className="h-10 w-10 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
