
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function SitemapPage() {
  const [niches, setNiches] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: nichesData } = await supabase
        .from('niches')
        .select('*')

      const { data: locationsData } = await supabase
        .from('locations')
        .select('*')

      if (nichesData) setNiches(nichesData)
      if (locationsData) setLocations(locationsData)
    }

    fetchData()
  }, [])

  const generateSitemap = () => {
    const baseUrl = 'https://cloud-keepers.co.uk'
    const currentDate = new Date().toISOString().split('T')[0]
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
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
      sitemap += `
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
        sitemap += `
  <url>
    <loc>${baseUrl}/${location.slug}/${niche.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
      })
    })

    sitemap += `
</urlset>`

    return sitemap
  }

  useEffect(() => {
    if (niches.length > 0 && locations.length > 0) {
      const sitemapContent = generateSitemap()
      
      // Create a blob and download link for the sitemap
      const blob = new Blob([sitemapContent], { type: 'application/xml' })
      const url = URL.createObjectURL(blob)
      
      // You would typically serve this from a static file or API endpoint
      console.log('Sitemap generated:', sitemapContent)
    }
  }, [niches, locations])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">XML Sitemap</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <pre className="text-sm overflow-x-auto">
          {niches.length > 0 && locations.length > 0 ? generateSitemap() : 'Loading sitemap...'}
        </pre>
      </div>
    </div>
  )
}
