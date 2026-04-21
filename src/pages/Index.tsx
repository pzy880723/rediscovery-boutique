import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import PhilosophySection from "@/components/PhilosophySection";
import CategoriesSection from "@/components/CategoriesSection";
import StoresSection from "@/components/StoresSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <PhilosophySection />
      <CategoriesSection />
      <StoresSection />
      <Footer />
    </div>
  );
};

export default Index;
