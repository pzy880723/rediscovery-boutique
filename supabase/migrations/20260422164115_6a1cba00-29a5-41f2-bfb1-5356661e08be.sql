UPDATE public.brand_matrix
SET
  cover_image_url = 'https://ebgbbptgqzpnzilnwces.supabase.co/storage/v1/object/public/images/brand-matrix/plus/cover.png',
  gallery_urls = '[
    "https://ebgbbptgqzpnzilnwces.supabase.co/storage/v1/object/public/images/brand-matrix/plus/g1.png",
    "https://ebgbbptgqzpnzilnwces.supabase.co/storage/v1/object/public/images/brand-matrix/plus/g2.png",
    "https://ebgbbptgqzpnzilnwces.supabase.co/storage/v1/object/public/images/brand-matrix/plus/g3.png"
  ]'::jsonb
WHERE slug = 'plus';