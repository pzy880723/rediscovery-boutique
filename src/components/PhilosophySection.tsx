import { motion } from "framer-motion";
import { ShieldCheck, Layers, Recycle, Sparkles, Coins, Users } from "lucide-react";

const philosophies = [
  {
    icon: ShieldCheck,
    title: "信任可见",
    desc: "明码标价、品相分级、来源可溯，告别中古行业的「坑一个是一个」。",
  },
  {
    icon: Layers,
    title: "标准化连锁",
    desc: "国内首家把日式标准化陈列体系带进中古杂货赛道，可复制、可信赖。",
  },
  {
    icon: Sparkles,
    title: "氛围沉浸",
    desc: "黑胶唱片机、巨型 Gameboy、佐藤象店头，每个角落都值得停下来。",
  },
  {
    icon: Coins,
    title: "亲民起价",
    desc: "翻筐乐 6.9 元起，让每个人都能轻松带走一份属于自己的中古回忆。",
  },
  {
    icon: Users,
    title: "全龄共逛",
    desc: "从几岁孩子到八十岁奶奶，每件商品都有它的顾客，全家人一起逛。",
  },
  {
    icon: Recycle,
    title: "循环经济",
    desc: "让闲置的旧物重获价值，是对地球、也是对时间最温柔的回应。",
  },
];

const PhilosophySection = () => {
  return (
    <section id="philosophy" className="py-12 md:py-16 px-6 bg-[hsl(30,20%,95%)]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-xs tracking-[0.3em] text-primary uppercase mb-2">私たちの理念</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            我们相信
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            六个我们坚守的事，构成 BOOMER OFF 的底色。
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {philosophies.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group p-4 md:p-5 rounded-lg bg-white/80 backdrop-blur-sm border border-[hsl(30,15%,88%)] hover:shadow-md hover:bg-white transition-all duration-300"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <p.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-display text-sm md:text-base font-bold text-foreground">
                  {p.title}
                </h3>
              </div>
              <p className="text-xs md:text-[13px] text-muted-foreground leading-relaxed">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
