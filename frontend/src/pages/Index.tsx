import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { AboutHome } from "@/components/sections/AboutHome";
import { LatestClients } from "@/components/sections/LatestClients";
import { Testimonials } from "@/components/sections/Testimonials";
import { VisitorTracker } from "@/components/VisitorTracker";
import { ReviewWidget } from "@/components/ReviewWidget";
import { CookieConsent } from "@/components/CookieConsent";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <VisitorTracker />
      <ReviewWidget />
      <CookieConsent />
      {/* Subtle Animated Background Lines for entire page */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <AboutHome />
          <LatestClients />
          <Testimonials />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
