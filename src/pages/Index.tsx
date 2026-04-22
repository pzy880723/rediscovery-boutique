import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  hero: HeroSection,
  about: AboutSection,
  gallery: GallerySection,
  achievements: AchievementsSection,
  philosophy: PhilosophySection,
  dual_dna: DualDNASection,
  experience: ExperienceSection,
  categories: CategoriesSection,
  flipper_fun: FlipperFunSection,
  audience: AudienceSection,
  press: PressSection,
  stores: StoresSection,
  brand_matrix: BrandMatrixSection,
  partnership: PartnershipSection,
};

// 默认顺序，用于数据加载完成前 / 数据库返回为空时回退展示
const DEFAULT_ORDER: string[] = [
  "hero",
  "about",
  "gallery",
  "achievements",
  "philosophy",
  "dual_dna",
  "experience",
  "categories",
  "flipper_fun",
  "audience",
  "press",
  "stores",
  "brand_matrix",
  "partnership",
];

const Index = () => {
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("homepage_sections")
      .select("section_key,is_visible,sort_order")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!mounted || error || !data || data.length === 0) return;
        setOrder(data.filter((s) => s.is_visible).map((s) => s.section_key));
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {order.map((key) => {
        const Comp = SECTION_COMPONENTS[key];
        return Comp ? <Comp key={key} /> : null;
      })}
      <Footer />
    </div>
  );
};

export default Index;
