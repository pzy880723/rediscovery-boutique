import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";

type Item = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  icon_name: string | null;
  is_active: boolean;
  sort_order: number;
};

const empty = { title: "", subtitle: "", description: "", image_url: "", icon_name: "Sparkles", is_active: true, sort_order: 0 };

const ExperienceManager = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState(empty);

  const fetchItems = async () => {
    const { data } = await supabase.from("experience_items").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (i: Item) => {
    setEditing(i);
    setForm({
      title: i.title, subtitle: i.subtitle || "", description: i.description || "",
      image_url: i.image_url || "", icon_name: i.icon_name || "Sparkles",
      is_active: i.is_active, sort_order: i.sort_order
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) { toast.error("请填写标题"); return; }
    if (editing) {
      await supabase.from("experience_items").update(form).eq("id", editing.id);
      toast.success("已更新");
    } else {
      await supabase.from("experience_items").insert(form);
      toast.success("已添加");
    }
    setOpen(false); fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    await supabase.from("experience_items").delete().eq("id", id);
    toast.success("已删除"); fetchItems();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">空间体验装置</CardTitle>
        <Button size="sm" onClick={openNew} className="gap-1"><Plus className="w-4 h-4" />添加</Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 && <p className="text-sm text-muted-foreground">暂无装置</p>}
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 p-3 border rounded-lg">
              {it.image_url && <img src={it.image_url} alt={it.title} className="w-14 h-14 object-cover rounded" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{it.title}</p>
                <p className="text-xs text-muted-foreground">{it.subtitle} · 图标 {it.icon_name} · 排序 {it.sort_order} · {it.is_active ? "显示" : "隐藏"}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => openEdit(it)}><Pencil className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(it.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "编辑装置" : "添加装置"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>标题</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><Label>副标题（如：听觉沉浸）</Label><Input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} /></div>
              <div><Label>描述</Label><Textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div><Label>图片</Label><ImageUpload value={form.image_url} onChange={url => setForm({...form, image_url: url})} /></div>
              <div><Label>图标名（lucide 名称，如 Disc3 / Gamepad2 / Sparkles / Hammer）</Label><Input value={form.icon_name} onChange={e => setForm({...form, icon_name: e.target.value})} /></div>
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

export default ExperienceManager;
