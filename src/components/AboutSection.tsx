import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 md:py-20 px-6 bg-secondary">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center">
            <p className="text-xs tracking-[0.3em] text-primary uppercase mb-2">私たちの物語</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">
              我们的故事
            </h2>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed text-sm md:text-base">
            <p>
              在瞬息万变的时代，总有一些物品承载着时间的温度，静静等待与下一个主人的相遇。
            </p>
            <p>
              BOOMER OFF 的诞生，源于一个简单的想法：为这些被遗忘的宝藏，创建一个温暖的家；也为热爱生活、怀揣情怀的你，提供一个可以随时停靠、探索、发现惊喜的港湾。
            </p>
            <p>
              我们是中国首家致力于标准化的中古杂货铺，穿越全球，精心搜罗那些跨越时代的中古玩具、温润的瓷器、闪光的首饰、经典的黑胶唱片，以及那些充满回忆的数码产品和潮流IP周边。
            </p>
            <p>
              BOOMER OFF 不仅仅是一家店，它是一个连接过去与现在的空间，一个倡导环保与循环的生活方式，一个属于每个人的、充满无限可能的"解忧杂货铺"。
            </p>
            <p className="font-display text-foreground text-base md:text-lg mt-8">
              我们相信，每一次相遇，都是久别重逢。
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
