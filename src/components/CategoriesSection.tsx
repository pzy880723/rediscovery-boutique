import { motion } from "framer-motion";

const categories = [
  {
    title: "中古玩具",
    sub: "Vintage Toys",
    desc: "从铁皮机器人到绝版芭比，收藏的是童年的纯真与梦想。",
    gradient: "from-rose-900/80 via-rose-800/60 to-stone-900/80",
    bg: "bg-gradient-to-br from-rose-200 to-amber-100",
  },
  {
    title: "精美瓷器",
    sub: "Porcelain",
    desc: "每一道花纹，都描绘着一个时代的生活美学。",
    gradient: "from-sky-900/80 via-slate-800/60 to-stone-900/80",
    bg: "bg-gradient-to-br from-sky-200 to-slate-100",
  },
  {
    title: "复古首饰",
    sub: "Vintage Jewelry",
    desc: "经由时光打磨的独特光泽，点亮你的日常穿搭。",
    gradient: "from-amber-900/80 via-yellow-800/60 to-stone-900/80",
    bg: "bg-gradient-to-br from-amber-200 to-orange-100",
  },
  {
    title: "黑胶唱片",
    sub: "Vinyl Records",
    desc: "当唱针落下，流淌出的是无法复刻的黄金年代。",
    gradient: "from-stone-900/80 via-neutral-800/60 to-zinc-900/80",
    bg: "bg-gradient-to-br from-stone-300 to-neutral-200",
  },
  {
    title: "中古数码",
    sub: "Retro Tech",
    desc: "从 Walkman 到翻盖手机，感受科技在指尖的进化史。",
    gradient: "from-indigo-900/80 via-blue-800/60 to-stone-900/80",
    bg: "bg-gradient-to-br from-indigo-200 to-blue-100",
  },
  {
    title: "毛绒玩具",
    sub: "Plush Toys",
    desc: "温暖的拥抱，治愈每一个不想长大的瞬间。",
    gradient: "from-pink-900/80 via-rose-800/60 to-stone-900/80",
    bg: "bg-gradient-to-br from-pink-200 to-rose-100",
  },
  {
    title: "潮流IP周边",
    sub: "Pop Culture Collectibles",
    desc: "跨越世代的经典IP，在这里集结，唤醒你的热血与青春。",
    gradient: "from-violet-900/80 via-purple-800/60 to-stone-900/80",
    bg: "bg-gradient-to-br from-violet-200 to-purple-100",
  },
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="bg-background">
      <div className="py-24 md:py-32 px-6 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs tracking-[0.3em] text-primary uppercase mb-2">取扱商品</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            时间的宝藏
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            在 BOOMER OFF，超过 30,000 件独一无二的商品每日更新，等待你的探索。
          </p>
        </motion.div>
      </div>

      {categories.map((cat, i) => (
        <motion.div
          key={cat.title}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className={`relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center ${cat.bg}`}
        >
          {/* Overlay gradient */}
          <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />

          <div className="relative z-10 text-center px-6 max-w-2xl">
            <p className="text-xs tracking-[0.3em] text-white/60 uppercase mb-3">
              {cat.sub}
            </p>
            <h3 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              {cat.title}
            </h3>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              {cat.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default CategoriesSection;
