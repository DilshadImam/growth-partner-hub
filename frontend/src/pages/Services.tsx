import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Services as ServicesSection } from "@/components/sections/Services";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Services;