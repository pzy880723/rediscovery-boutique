import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Condition = { label: string; value: string };
type Info = {
  id: string;
  conditions: Condition[];
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  experience_center_address: string;
  intro: string;
};

const PartnershipManager = () => {
  const [info, setInfo] = useState<Info | null>(null);
  const [conditions, setConditions] = useState<Condition[]>([]);

  const fetchInfo = async () => {
    const { data } = await supabase
      .from("partnership_info")
      .select("*")
      .order("created_at")
      .limit(1)
      .maybeSingle();
    if (data) {
      setInfo(data as unknown as Info);
      setConditions(Array.isArray(data.conditions) ? (data.conditions as unknown as Condition[]) : []);
    }
  };
  useEffect(() => { fetchInfo(); }, []);

  const handleSave = async () => {
    if (!info) return;
    const payload = {
      conditions: conditions as unknown as never,
      contact_name: info.contact_name || "",
      contact_phone: info.contact_phone || "",
      contact_email: info.contact_email || "",
      experience_center_address: info.experience_center_address || "",
      intro: info.intro || "",
    };
    const { error } = await supabase.from("partnership_info").update(payload).eq("id", info.id);
    if (error) { toast.error("保存失败"); return; }
    toast.success("已保存");
  };

  const addCondition = () => setConditions([...conditions, { label: "", value: "" }]);
  const removeCondition = (i: number) => setConditions(conditions.filter((_, idx) => idx !== i));
  const updateCondition = (i: number, key: "label" | "value", v: string) => {
    setConditions(conditions.map((c, idx) => idx === i ? { ...c, [key]: v } : c));
  };

  if (!info) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-lg">招商合作</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">加载中...</p></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">招商合作</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label>引言介绍</Label>
          <Textarea rows={3} value={info.intro || ""} onChange={e => setInfo({...info, intro: e.target.value})} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>合作条件</Label>
            <Button size="sm" variant="outline" onClick={addCondition} className="gap-1"><Plus className="w-3 h-3" />新增</Button>
          </div>
          <div className="space-y-2">
            {conditions.map((c, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Input placeholder="标签（如 目标面积）" value={c.label} onChange={e => updateCondition(i, "label", e.target.value)} className="flex-1" />
                <Input placeholder="内容（如 80-100㎡）" value={c.value} onChange={e => updateCondition(i, "value", e.target.value)} className="flex-[2]" />
                <Button size="icon" variant="ghost" onClick={() => removeCondition(i)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>联系人</Label><Input value={info.contact_name || ""} onChange={e => setInfo({...info, contact_name: e.target.value})} /></div>
          <div><Label>联系电话</Label><Input value={info.contact_phone || ""} onChange={e => setInfo({...info, contact_phone: e.target.value})} /></div>
          <div><Label>邮箱（可选）</Label><Input value={info.contact_email || ""} onChange={e => setInfo({...info, contact_email: e.target.value})} /></div>
          <div><Label>加盟体验中心地址</Label><Input value={info.experience_center_address || ""} onChange={e => setInfo({...info, experience_center_address: e.target.value})} /></div>
        </div>

        <Button onClick={handleSave} className="w-full">保存</Button>
      </CardContent>
    </Card>
  );
};

export default PartnershipManager;
