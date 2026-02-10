import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CaseStudies as CaseStudiesSection } from "@/components/sections/CaseStudies";

const CaseStudies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <CaseStudiesSection />
      </main>
      <Footer />
    </div>
  );
};

export default CaseStudies;