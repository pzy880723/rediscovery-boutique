import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
};

const GallerySection = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("gallery_images")
      .select("id, image_url, caption")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setImages(data);
      });
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, images.length]);

  if (images.length === 0) return null;

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
  const next = () => setLightboxIndex((i) => (i === null ? i : (i + 1) % images.length));

  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-center"
        >
          <p className="text-xs tracking-[0.3em] text-primary uppercase mb-2">店内一隅</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            走进 BOOMER OFF
          </h2>
          <Button
            variant="outline"
            onClick={() => setShowAll(true)}
            size="sm"
          >
            查看全部
          </Button>
        </motion.div>
      </div>

      {/* 横向滑动 */}
      <div className="relative">
        <div className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6 max-w-7xl mx-auto pb-2">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.06 }}
              onClick={() => openLightbox(i)}
              className="group relative shrink-0 snap-start cursor-pointer overflow-hidden rounded-md bg-muted w-[45vw] sm:w-[30vw] md:w-[22vw] lg:w-[18vw] max-w-[260px] aspect-[3/4]"
            >
              <img
                src={img.image_url}
                alt={img.caption || "BOOMER OFF 门店"}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs md:text-sm">{img.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 查看全部弹窗 */}
      <Dialog open={showAll} onOpenChange={setShowAll}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 pt-4">
            {images.map((img, i) => (
              <div
                key={img.id}
                onClick={() => {
                  setShowAll(false);
                  setTimeout(() => openLightbox(i), 150);
                }}
                className="group relative cursor-pointer overflow-hidden rounded-md bg-muted aspect-[3/4]"
              >
                <img
                  src={img.image_url}
                  alt={img.caption || "BOOMER OFF 门店"}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 全屏放大 Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10"
            aria-label="关闭"
          >
            <X className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 md:left-6 text-white/80 hover:text-white p-2 z-10"
            aria-label="上一张"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 md:right-6 text-white/80 hover:text-white p-2 z-10"
            aria-label="下一张"
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <div
            className="relative max-w-[92vw] max-h-[88vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex].image_url}
              alt={images[lightboxIndex].caption || "BOOMER OFF 门店"}
              className="max-w-[92vw] max-h-[80vh] object-contain rounded-md"
            />
            {images[lightboxIndex].caption && (
              <p className="text-white/90 text-sm md:text-base mt-4 text-center">
                {images[lightboxIndex].caption}
              </p>
            )}
            <p className="text-white/50 text-xs mt-2">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
