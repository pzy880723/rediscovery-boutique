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

type Store = {
  id: string;
  name: string;
  address: string;
  feature_tag: string | null;
  is_active: boolean;
  sort_order: number;
};

const StoreManager = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Store | null>(null);
  const [form, setForm] = useState({ name: "", address: "", feature_tag: "", is_active: true, sort_order: 0 });

  const fetchStores = async () => {
    const { data } = await supabase.from("stores").select("*").order("sort_order");
    if (data) setStores(data);
  };

  useEffect(() => { fetchStores(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", address: "", feature_tag: "", is_active: true, sort_order: 0 });
    setOpen(true);
  };

  const openEdit = (s: Store) => {
    setEditing(s);
    setForm({ name: s.name, address: s.address, feature_tag: s.feature_tag || "", is_active: s.is_active, sort_order: s.sort_order });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.address) { toast.error("请填写名称和地址"); return; }
    if (editing) {
      await supabase.from("stores").update(form).eq("id", editing.id);
      toast.success("已更新");
    } else {
      await supabase.from("stores").insert(form);
      toast.success("已添加");
    }
    setOpen(false);
    fetchStores();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    await supabase.from("stores").delete().eq("id", id);
    toast.success("已删除");
    fetchStores();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">门店信息</CardTitle>
        <Button size="sm" onClick={openNew} className="gap-1"><Plus className="w-4 h-4" />添加</Button>
      </CardHeader>
      <CardContent>
        {stores.length === 0 && <p className="text-sm text-muted-foreground">暂无门店</p>}
        <div className="space-y-3">
          {stores.map((s) => (
            <div key={s.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.address}</p>
                <p className="text-xs text-muted-foreground">{s.feature_tag} · {s.is_active ? "显示" : "隐藏"}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "编辑门店" : "添加门店"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>门店名称</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div><Label>地址</Label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
              <div><Label>特色标签</Label><Input value={form.feature_tag} onChange={e => setForm({...form, feature_tag: e.target.value})} /></div>
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

export default StoreManager;
