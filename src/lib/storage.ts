import { supabase } from "@/integrations/supabase/client";

export const uploadImage = async (file: File, folder: string = "general"): Promise<string> => {
  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from("images").upload(fileName, file);
  if (error) throw error;

  const { data } = supabase.storage.from("images").getPublicUrl(fileName);
  return data.publicUrl;
};

export const deleteImage = async (url: string) => {
  const path = url.split("/storage/v1/object/public/images/")[1];
  if (path) {
    await supabase.storage.from("images").remove([path]);
  }
};
