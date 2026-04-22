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
  store_type: string;
  area: string;
  positioning: string;
  description: string | null;
  is_launched: boolean;
  is_active: boolean;
  sort_order: number;
};

const empty = { store_type: "", area: "", positioning: "", description: "", is_launched: false, is_active: true, sort_order: 0 };

const BrandMatrixManager = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState(empty);

  const fetchItems = async () => {
    const { data } = await supabase.from("brand_matrix").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (i: Item) => {
    setEditing(i);
    setForm({
      store_type: i.store_type, area: i.area, positioning: i.positioning,
      description: i.description || "", is_launched: i.is_launched,
      is_active: i.is_active, sort_order: i.sort_order
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.store_type || !form.area || !form.positioning) { toast.error("请填写完整"); return; }
    if (editing) {
      await supabase.from("brand_matrix").update(form).eq("id", editing.id);
      toast.success("已更新");
    } else {
      await supabase.from("brand_matrix").insert(form);
      toast.success("已添加");
    }
    setOpen(false); fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    await supabase.from("brand_matrix").delete().eq("id", id);
    toast.success("已删除"); fetchItems();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">品牌矩阵店型</CardTitle>
        <Button size="sm" onClick={openNew} className="gap-1"><Plus className="w-4 h-4" />添加</Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 && <p className="text-sm text-muted-foreground">暂无店型</p>}
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{it.store_type} <span className="text-xs text-muted-foreground">· {it.area}</span></p>
                <p className="text-xs text-primary truncate">{it.positioning}</p>
                <p className="text-xs text-muted-foreground">{it.is_launched ? "营业中" : "筹备中"} · 排序 {it.sort_order} · {it.is_active ? "显示" : "隐藏"}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => openEdit(it)}><Pencil className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(it.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "编辑店型" : "添加店型"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>店型名（如 BOOMER OFF Vintage）</Label><Input value={form.store_type} onChange={e => setForm({...form, store_type: e.target.value})} /></div>
              <div><Label>面积（如 80-100㎡）</Label><Input value={form.area} onChange={e => setForm({...form, area: e.target.value})} /></div>
              <div><Label>定位（一句话）</Label><Input value={form.positioning} onChange={e => setForm({...form, positioning: e.target.value})} /></div>
              <div><Label>描述</Label><Textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_launched} onCheckedChange={v => setForm({...form, is_launched: v})} /><Label>已上线营业</Label></div>
              <div><Label>排序</Label><Input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value)||0})} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} /><Label>显示在网站</Label></div>
              <Button onClick={handleSave} className="w-full">保存</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BrandMatrixManager;
