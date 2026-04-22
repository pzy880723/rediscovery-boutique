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
  media_name: string;
  quote_original: string;
  quote_translation: string | null;
  link_url: string | null;
  is_active: boolean;
  sort_order: number;
};

const empty = { media_name: "", quote_original: "", quote_translation: "", link_url: "", is_active: true, sort_order: 0 };

const PressManager = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState(empty);

  const fetchItems = async () => {
    const { data } = await supabase.from("press_quotes").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (i: Item) => {
    setEditing(i);
    setForm({
      media_name: i.media_name, quote_original: i.quote_original,
      quote_translation: i.quote_translation || "", link_url: i.link_url || "",
      is_active: i.is_active, sort_order: i.sort_order
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.media_name || !form.quote_original) { toast.error("请填写媒体名和引言"); return; }
    if (editing) {
      await supabase.from("press_quotes").update(form).eq("id", editing.id);
      toast.success("已更新");
    } else {
      await supabase.from("press_quotes").insert(form);
      toast.success("已添加");
    }
    setOpen(false); fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    await supabase.from("press_quotes").delete().eq("id", id);
    toast.success("已删除"); fetchItems();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">媒体口碑</CardTitle>
        <Button size="sm" onClick={openNew} className="gap-1"><Plus className="w-4 h-4" />添加</Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 && <p className="text-sm text-muted-foreground">暂无引言</p>}
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-start gap-4 p-3 border rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-primary tracking-wider uppercase">{it.media_name}</p>
                <p className="text-sm text-foreground line-clamp-2 italic">"{it.quote_original}"</p>
                {it.quote_translation && <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{it.quote_translation}</p>}
              </div>
              <Button size="icon" variant="ghost" onClick={() => openEdit(it)}><Pencil className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(it.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "编辑引言" : "添加引言"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>媒体名</Label><Input value={form.media_name} onChange={e => setForm({...form, media_name: e.target.value})} /></div>
              <div><Label>引言原文</Label><Textarea rows={3} value={form.quote_original} onChange={e => setForm({...form, quote_original: e.target.value})} /></div>
              <div><Label>中文译文（可选）</Label><Textarea rows={2} value={form.quote_translation} onChange={e => setForm({...form, quote_translation: e.target.value})} /></div>
              <div><Label>链接（可选）</Label><Input value={form.link_url} onChange={e => setForm({...form, link_url: e.target.value})} /></div>
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

export default PressManager;
