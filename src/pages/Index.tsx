import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import AchievementsSection from "@/components/AchievementsSection";
import PhilosophySection from "@/components/PhilosophySection";
import DualDNASection from "@/components/DualDNASection";
import ExperienceSection from "@/components/ExperienceSection";
import CategoriesSection from "@/components/CategoriesSection";
import FlipperFunSection from "@/components/FlipperFunSection";
import AudienceSection from "@/components/AudienceSection";
import PressSection from "@/components/PressSection";
import StoresSection from "@/components/StoresSection";
import BrandMatrixSection from "@/components/BrandMatrixSection";
import PartnershipSection from "@/components/PartnershipSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <AchievementsSection />
      <PhilosophySection />
      <DualDNASection />
      <ExperienceSection />
      <CategoriesSection />
      <FlipperFunSection />
      <AudienceSection />
      <PressSection />
      <StoresSection />
      <BrandMatrixSection />
      <PartnershipSection />
      <Footer />
    </div>
  );
};

export default Index;

