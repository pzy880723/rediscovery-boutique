import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminOverview from "./pages/admin/AdminOverview.tsx";
import HomepageSectionsPage from "./pages/admin/HomepageSectionsPage.tsx";
import BannersPage from "./pages/admin/BannersPage.tsx";
import AchievementsPage from "./pages/admin/AchievementsPage.tsx";
import ExperiencesPage from "./pages/admin/ExperiencesPage.tsx";
import CategoriesPage from "./pages/admin/CategoriesPage.tsx";
import AudiencesPage from "./pages/admin/AudiencesPage.tsx";
import PressPage from "./pages/admin/PressPage.tsx";
import GalleryPage from "./pages/admin/GalleryPage.tsx";
import NewsPage from "./pages/admin/NewsPage.tsx";
import StoresPage from "./pages/admin/StoresPage.tsx";
import BrandMatrixPage from "./pages/admin/BrandMatrixPage.tsx";
import PartnershipPage from "./pages/admin/PartnershipPage.tsx";
import BrandMatrixDetail from "./pages/BrandMatrixDetail.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/brand-matrix/:slug" element={<BrandMatrixDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="sections" element={<HomepageSectionsPage />} />
              <Route path="banners" element={<BannersPage />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="experiences" element={<ExperiencesPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="audiences" element={<AudiencesPage />} />
              <Route path="press" element={<PressPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="stores" element={<StoresPage />} />
              <Route path="brand-matrix" element={<BrandMatrixPage />} />
              <Route path="partnership" element={<PartnershipPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
