import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { LeadForm } from './LeadForm'

export function HomePage() {
  const [niches, setNiches] = useState<any[]>([])
  const [popularLocations, setPopularLocations] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: nichesData } = await supabase
        .from('niches')
        .select('*')
        .order('name')

      const { data: locationsData } = await supabase
        .from('locations')
        .select('*')
        .eq('is_popular', true)
        .order('population', { ascending: false })

      if (nichesData) setNiches(nichesData)
      if (locationsData) setPopularLocations(locationsData)
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-8">Professional Accounting Services</h1>
          
          <div className="prose lg:prose-lg mb-12">
            <p>Welcome to our comprehensive accounting services. We provide expert financial solutions tailored to your business needs.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {niches.map((niche) => (
                <Link
                  key={niche.id}
                  to={`/services/${niche.slug}`}
                  className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{niche.name}</h3>
                  <p className="text-gray-600">{niche.description}</p>
                </Link>
              ))}
            </div>

            <h2 className="text-2xl font-semibold mt-12 mb-4">Popular Locations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularLocations.map((location) => (
                <div key={location.id} className="space-y-2">
                  {niches.map((niche) => (
                    <Link
                      key={`${location.id}-${niche.id}`}
                      to={`/${location.slug}/${niche.slug}`}
                      className="block text-blue-600 hover:text-blue-800"
                    >
                      {niche.name} in {location.name}
                    </Link>
                  ))}
                </div>
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
  )
}