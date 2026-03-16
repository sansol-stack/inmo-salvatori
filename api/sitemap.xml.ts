import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const BASE_URL = process.env.VITE_SITE_URL || 'https://inmosilvinasalvatori.vercel.app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { data: properties } = await supabase
    .from('properties')
    .select('id, created_at')
    .in('status', ['available', 'reserved'])
    .eq('is_visible', true);

  const urls = [
    // Home
    `<url>
      <loc>${BASE_URL}/</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>`,

    // Propiedades
    ...(properties || []).map(p => `<url>
      <loc>${BASE_URL}/propiedad/${p.id}</loc>
      <lastmod>${new Date(p.created_at).toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(sitemap);
}