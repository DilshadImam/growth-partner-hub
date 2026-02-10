import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Testimonials as TestimonialsSection } from "@/components/sections/Testimonials";

const Testimonials = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Testimonials;