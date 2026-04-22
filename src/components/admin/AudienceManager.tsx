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

type Item = {
  id: string;
  name: string;
  preference: string | null;
  scene: string | null;
  icon_name: string | null;
  is_active: boolean;
  sort_order: number;
};

const empty = { name: "", preference: "", scene: "", icon_name: "User", is_active: true, sort_order: 0 };

const AudienceManager = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState(empty);

  const fetchItems = async () => {
    const { data } = await supabase.from("audience_segments").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (i: Item) => {
    setEditing(i);
    setForm({
      name: i.name, preference: i.preference || "", scene: i.scene || "",
      icon_name: i.icon_name || "User", is_active: i.is_active, sort_order: i.sort_order
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast.error("请填写客群名"); return; }
    if (editing) {
      await supabase.from("audience_segments").update(form).eq("id", editing.id);
      toast.success("已更新");
    } else {
      await supabase.from("audience_segments").insert(form);
      toast.success("已添加");
    }
    setOpen(false); fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    await supabase.from("audience_segments").delete().eq("id", id);
    toast.success("已删除"); fetchItems();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">客群画像</CardTitle>
        <Button size="sm" onClick={openNew} className="gap-1"><Plus className="w-4 h-4" />添加</Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 && <p className="text-sm text-muted-foreground">暂无客群</p>}
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{it.name} <span className="text-xs text-muted-foreground">· 图标 {it.icon_name}</span></p>
                <p className="text-xs text-muted-foreground truncate">{it.preference}</p>
                <p className="text-xs text-foreground/60 italic truncate">"{it.scene}"</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => openEdit(it)}><Pencil className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(it.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "编辑客群" : "添加客群"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>客群名称</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div><Label>偏好品类</Label><Input value={form.preference} onChange={e => setForm({...form, preference: e.target.value})} /></div>
              <div><Label>典型场景（一句话）</Label><Textarea rows={2} value={form.scene} onChange={e => setForm({...form, scene: e.target.value})} /></div>
              <div><Label>图标名（如 Baby / Smile / Briefcase / Users / Heart）</Label><Input value={form.icon_name} onChange={e => setForm({...form, icon_name: e.target.value})} /></div>
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

export default AudienceManager;
