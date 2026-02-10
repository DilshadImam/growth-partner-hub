import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { About as AboutSection } from "@/components/sections/About";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;