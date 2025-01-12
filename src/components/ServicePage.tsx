import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { LeadForm } from './LeadForm'
import { Helmet } from 'react-helmet'
import { Header } from './Header'

export function ServicePage() {
  const { service } = useParams()
  const [niche, setNiche] = useState<any>(null)
  const [niches, setNiches] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const [nichesResponse, nicheResponse, locationsResponse] = await Promise.all([
        supabase.from('niches').select('*'),
        supabase.from('niches').select('*').eq('slug', service).single(),
        supabase.from('locations').select('*').order('name')
      ])

      if (nichesResponse.data) setNiches(nichesResponse.data)
      if (nicheResponse.data) setNiche(nicheResponse.data)
      if (locationsResponse.data) setLocations(locationsResponse.data)
    }

    fetchData()
  }, [service])

  if (!niche) return <div>Loading...</div>

  const metaTitle = niche.meta_title || `${niche.name} Services | Cloudkeepers Accountants`
  const metaDescription = niche.meta_description || `Professional ${niche.name.toLowerCase()} services by Cloudkeepers Accountants. Expert financial guidance tailored to your business needs.`

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <Header niches={niches} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-8">{niche.name} Services</h1>
            
            <div className="prose lg:prose-lg mb-12">
              <p className="text-lg text-gray-700 mb-6">{niche.description}</p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4">Why Choose Cloudkeepers Accountants for {niche.name}?</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Expert team with years of experience in {niche.name.toLowerCase()}</li>
                  <li>Cloud-based solutions for real-time financial insights</li>
                  <li>Tailored approach to meet your specific business needs</li>
                  <li>Proactive advice to help your business grow</li>
                </ul>
              </div>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Available Locations</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {locations.map((location) => (
                  <Link
                    key={location.id}
                    to={`/${location.slug}/${niche.slug}`}
                    className="block text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {niche.name} in {location.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <LeadForm />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}