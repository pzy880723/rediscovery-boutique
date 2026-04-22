
ALTER TABLE public.brand_matrix
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS cover_image_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS gallery_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS long_description text DEFAULT '';

UPDATE public.brand_matrix SET slug = 'vintage' WHERE store_type = 'BOOMER OFF Vintage';
UPDATE public.brand_matrix SET slug = 'home' WHERE store_type = 'BOOMER OFF Home';
UPDATE public.brand_matrix SET slug = 'hobby' WHERE store_type = 'BOOMER OFF Hobby';
UPDATE public.brand_matrix SET slug = 'collection' WHERE store_type = 'BOOMER OFF Collection';
UPDATE public.brand_matrix SET slug = 'digital' WHERE store_type = 'BOOMER OFF Digital';
UPDATE public.brand_matrix SET slug = 'nb' WHERE store_type = 'BOOMER OFF NB';
UPDATE public.brand_matrix SET slug = 'plus' WHERE store_type = 'BOOMER OFF Plus';

ALTER TABLE public.brand_matrix ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS brand_matrix_slug_key ON public.brand_matrix(slug);

UPDATE public.brand_matrix SET cover_image_url = '/gallery/store-1.jpeg'
  WHERE slug = 'vintage' AND (cover_image_url IS NULL OR cover_image_url = '');
UPDATE public.brand_matrix SET gallery_urls = '["/gallery/store-1.jpeg","/gallery/store-2.jpeg","/gallery/store-3.jpeg","/gallery/store-7.jpeg"]'::jsonb
  WHERE slug = 'vintage' AND (gallery_urls = '[]'::jsonb OR gallery_urls IS NULL);
