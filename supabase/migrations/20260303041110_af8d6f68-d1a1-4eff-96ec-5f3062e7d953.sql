
-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  location TEXT NOT NULL,
  rooms INT NOT NULL DEFAULT 0,
  bathrooms INT NOT NULL DEFAULT 0,
  sqft INT NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('sale', 'rent')),
  image_urls TEXT[] DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view properties"
ON public.properties FOR SELECT
USING (true);

-- Only authenticated users can manage properties (admin)
CREATE POLICY "Authenticated users can insert properties"
ON public.properties FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update properties"
ON public.properties FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete properties"
ON public.properties FOR DELETE
TO authenticated
USING (true);
