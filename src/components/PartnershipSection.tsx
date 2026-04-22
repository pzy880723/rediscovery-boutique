import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Phone, MapPin, User, Handshake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import wechatQr from "@/assets/wechat-qr-white.png";

type PartnershipInfo = {
  id: string;
  conditions: { label: string; value: string }[];
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  experience_center_address: string | null;
  intro: string | null;
};

const PartnershipSection = () => {
  const [info, setInfo] = useState<PartnershipInfo | null>(null);

  useEffect(() => {
    supabase
      .from("partnership_info")
      .select("*")
      .eq("is_active", true)
      .order("created_at")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setInfo(data as unknown as PartnershipInfo);
      });
  }, []);

  if (!info) return null;

  const conditions = Array.isArray(info.conditions) ? info.conditions : [];

  return (
    <section id="partnership" className="py-16 md:py-20 px-6 bg-foreground text-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs tracking-[0.2em] uppercase mb-4">
            <Handshake className="w-3 h-3" /> Partnership
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            携手 BOOMER OFF
          </h2>
          {info.intro && (
            <p className="text-background/70 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {info.intro}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="p-6 md:p-7 rounded-xl border border-background/15 bg-background/5"
          >
            <h3 className="font-display text-lg font-bold mb-5 text-primary">
              标准店合作条件
            </h3>
            <ul className="space-y-3">
              {conditions.map((c) => (
                <li key={c.label} className="flex flex-col gap-0.5 pb-3 border-b border-background/10 last:border-0 last:pb-0">
                  <span className="text-xs text-background/50 uppercase tracking-wider">
                    {c.label}
                  </span>
                  <span className="text-sm text-background">{c.value}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="p-6 md:p-7 rounded-xl bg-primary text-primary-foreground"
          >
            <h3 className="font-display text-lg font-bold mb-5">
              联系招商
            </h3>
            <div className="space-y-4">
              {info.contact_name && (
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs opacity-80 uppercase tracking-wider">联系人</p>
                    <p className="text-sm font-medium">{info.contact_name}</p>
                  </div>
                </div>
              )}
              {info.contact_phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs opacity-80 uppercase tracking-wider">电话</p>
                    <a href={`tel:${info.contact_phone}`} className="text-sm font-medium hover:underline">
                      {info.contact_phone}
                    </a>
                  </div>
                </div>
              )}
              {info.experience_center_address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs opacity-80 uppercase tracking-wider">加盟体验中心</p>
                    <p className="text-sm font-medium leading-relaxed">
                      {info.experience_center_address}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs opacity-75 mt-6 pt-4 border-t border-primary-foreground/20">
              欢迎招商、加盟、品牌合作洽谈。
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipSection;
