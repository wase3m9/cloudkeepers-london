import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function XMLSitemap() {
  const [sitemapXML, setSitemapXML] = useState<string>('')

  useEffect(() => {
    const generateXMLSitemap = async () => {
      try {
        const [nichesResponse, locationsResponse] = await Promise.all([
          supabase.from('niches').select('*'),
          supabase.from('locations').select('*')
        ])

        const niches = nichesResponse.data || []
        const locations = locationsResponse.data || []
        
        const blogs = [
          { slug: 'the-most-tax-efficient-way-for-london-directors-to-pay-themselves-2025-26', created_at: '2025-08-05' },
          { slug: '8-common-accounting-mistakes-that-hurt-small-businesses', created_at: '2025-06-30' },
          { slug: '5-common-vat-return-mistakes-and-how-to-avoid-them', created_at: '2025-05-15' },
          { slug: '7-essential-tax-deadlines-for-uk-small-businesses-in-2025', created_at: '2023-11-15' }
        ]

        const baseUrl = 'https://cloud-keepers.co.uk'
        const currentDate = new Date().toISOString().split('T')[0]
        
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/resources</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/calculators</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/accounting-dates</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>`

        // Add service pages
        niches.forEach(niche => {
          xml += `
  <url>
    <loc>${baseUrl}/services/${niche.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
        })

        // Add location-based pages
        locations.forEach(location => {
          niches.forEach(niche => {
            xml += `
  <url>
    <loc>${baseUrl}/${location.slug}/${niche.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
          })
        })

        // Add blog posts
        blogs.forEach(blog => {
          xml += `
  <url>
    <loc>${baseUrl}/blogs/${blog.slug}</loc>
    <lastmod>${blog.created_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
        })

        xml += `
</urlset>`

        setSitemapXML(xml)
      } catch (error) {
        console.error('Error generating sitemap:', error)
      }
    }

    generateXMLSitemap()
  }, [])

  // Set proper headers for XML content
  useEffect(() => {
    if (sitemapXML) {
      // Set content type in a way that's compatible with React
      const meta = document.createElement('meta')
      meta.httpEquiv = 'Content-Type'
      meta.content = 'application/xml'
      document.head.appendChild(meta)
    }
  }, [sitemapXML])

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', fontSize: '12px' }}>
      {sitemapXML || 'Generating sitemap...'}
    </div>
  )
}