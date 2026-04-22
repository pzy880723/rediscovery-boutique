import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Item = {
  id: string;
  slug: string;
  store_type: string;
  area: string;
  positioning: string;
  description: string | null;
  long_description: string | null;
  cover_image_url: string | null;
  gallery_urls: string[] | null;
  is_launched: boolean;
};

const BrandMatrixDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("brand_matrix")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) navigate("/404", { replace: true });
        else setItem(data as unknown as Item);
        setLoading(false);
      });
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">加载中...</p>
      </div>
    );
  }
  if (!item) return null;

  const gallery = Array.isArray(item.gallery_urls) ? item.gallery_urls : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {item.cover_image_url ? (
          <img src={item.cover_image_url} alt={item.store_type} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative h-full max-w-6xl mx-auto px-6 flex flex-col justify-end pb-10">
          <Link
            to="/#brand-matrix"
            className="absolute top-24 left-6 inline-flex items-center gap-1 text-sm text-foreground/80 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> 返回品牌矩阵
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{item.area}</span>
              {item.is_launched ? (
                <span className="text-xs text-primary">● 营业中</span>
              ) : (
                <span className="text-xs text-muted-foreground bg-background/60 px-2 py-0.5 rounded-full">○ 筹备中</span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-2">{item.store_type}</h1>
            <p className="text-base md:text-lg text-primary">{item.positioning}</p>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <section className="py-14 md:py-20 px-6 max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.3em] text-primary uppercase text-center mb-2">店型介绍</p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-foreground mb-8">关于这家店</h2>
        <p className="text-foreground/80 text-base md:text-lg leading-loose whitespace-pre-line">
          {item.long_description || item.description || "更多介绍即将上线。"}
        </p>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-10 md:py-16 px-6 max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-primary uppercase text-center mb-2">门店画廊</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-foreground mb-10">空间一瞥</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {gallery.map((url, i) => (
              <button
                key={i}
                onClick={() => setLightbox(url)}
                className="aspect-square overflow-hidden rounded-lg bg-secondary group"
              >
                <img
                  src={url}
                  alt={`${item.store_type} ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Spec table */}
      <section className="py-10 md:py-16 px-6 max-w-3xl mx-auto">
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 text-sm">
            <div className="bg-secondary px-4 py-3 font-medium text-foreground">店型</div>
            <div className="col-span-2 px-4 py-3 text-foreground/80 border-l border-border">{item.store_type}</div>
            <div className="bg-secondary px-4 py-3 font-medium text-foreground border-t border-border">面积</div>
            <div className="col-span-2 px-4 py-3 text-foreground/80 border-l border-t border-border">{item.area}</div>
            <div className="bg-secondary px-4 py-3 font-medium text-foreground border-t border-border">定位</div>
            <div className="col-span-2 px-4 py-3 text-foreground/80 border-l border-t border-border">{item.positioning}</div>
            <div className="bg-secondary px-4 py-3 font-medium text-foreground border-t border-border">状态</div>
            <div className="col-span-2 px-4 py-3 text-foreground/80 border-l border-t border-border">
              {item.is_launched ? "已上线营业" : "筹备中"}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-6 text-center bg-secondary">
        <p className="text-xs tracking-[0.3em] text-primary uppercase mb-2">合作咨询</p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">想加盟此店型？</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          欢迎咨询商务合作，我们将根据您的城市与场地条件推荐最适合的店型方案。
        </p>
        <Button asChild size="lg">
          <Link to="/#partnership">咨询此店型</Link>
        </Button>
      </section>

      <Footer />

      <Dialog open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-0">
          {lightbox && <img src={lightbox} alt="预览" className="w-full h-auto rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandMatrixDetail;
