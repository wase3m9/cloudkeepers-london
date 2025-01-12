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

  return (
    <>
      <Helmet>
        <title>{`${niche.name} Services | Cloudkeepers Accountants`}</title>
        <meta name="description" content={niche.meta_description || `Professional ${niche.name.toLowerCase()} services by Cloudkeepers Accountants. Get expert financial guidance tailored to your business needs.`} />
      </Helmet>

      <Header niches={niches} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-8">{niche.name} Services</h1>
            
            <div className="prose lg:prose-lg mb-12">
              <p>{niche.description}</p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Available Locations</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {locations.map((location) => (
                  <Link
                    key={location.id}
                    to={`/${location.slug}/${niche.slug}`}
                    className="block text-blue-600 hover:text-blue-800"
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