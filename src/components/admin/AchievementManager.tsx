import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Achievement = {
  id: string;
  label: string;
  value: string;
  sublabel: string | null;
  is_active: boolean;
  sort_order: number;
};

const empty = { label: "", value: "", sublabel: "", is_active: true, sort_order: 0 };

const AchievementManager = () => {
  const [items, setItems] = useState<Achievement[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [form, setForm] = useState(empty);

  const fetchItems = async () => {
    const { data } = await supabase.from("achievements").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (i: Achievement) => {
    setEditing(i);
    setForm({ label: i.label, value: i.value, sublabel: i.sublabel || "", is_active: i.is_active, sort_order: i.sort_order });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.label || !form.value) { toast.error("请填写标签和数值"); return; }
    if (editing) {
      await supabase.from("achievements").update(form).eq("id", editing.id);
      toast.success("已更新");
    } else {
      await supabase.from("achievements").insert(form);
      toast.success("已添加");
    }
    setOpen(false); fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    await supabase.from("achievements").delete().eq("id", id);
    toast.success("已删除"); fetchItems();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">战绩数据</CardTitle>
        <Button size="sm" onClick={openNew} className="gap-1"><Plus className="w-4 h-4" />添加</Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 && <p className="text-sm text-muted-foreground">暂无数据</p>}
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{it.value} <span className="text-sm text-muted-foreground">· {it.label}</span></p>
                <p className="text-xs text-muted-foreground">{it.sublabel} · 排序 {it.sort_order} · {it.is_active ? "显示" : "隐藏"}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => openEdit(it)}><Pencil className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(it.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "编辑数据" : "添加数据"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>标签（如：全网曝光）</Label><Input value={form.label} onChange={e => setForm({...form, label: e.target.value})} /></div>
              <div><Label>数值（如：300万+）</Label><Input value={form.value} onChange={e => setForm({...form, value: e.target.value})} /></div>
              <div><Label>副标题</Label><Input value={form.sublabel} onChange={e => setForm({...form, sublabel: e.target.value})} /></div>
              <div><Label>排序</Label><Input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value)||0})} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} /><Label>显示</Label></div>
              <Button onClick={handleSave} className="w-full">保存</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AchievementManager;
