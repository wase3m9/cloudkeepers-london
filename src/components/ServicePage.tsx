import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { LeadForm } from './LeadForm'
import { Helmet } from 'react-helmet'
import { Header } from './Header'
import { Building2, MapPin, Users2 } from 'lucide-react'

export function ServicePage() {
  const { slug } = useParams()
  const [niche, setNiche] = useState<any>(null)
  const [niches, setNiches] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nichesResponse, nicheResponse, locationsResponse] = await Promise.all([
          supabase.from('niches').select('*'),
          supabase.from('niches').select('*').eq('slug', slug).maybeSingle(),
          supabase.from('locations').select('*').order('name')
        ])

        if (nichesResponse.data) setNiches(nichesResponse.data)
        if (nicheResponse.data) setNiche(nicheResponse.data)
        if (locationsResponse.data) setLocations(locationsResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!niche) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
        <Link to="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    )
  }

  const metaTitle = niche.meta_title || `${niche.name} Services in London Area | Professional Accounting Services`
  const metaDescription = niche.meta_description || `Professional ${niche.name.toLowerCase()} services across London Area. Expert financial guidance tailored to your business needs.`

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
                <h2 className="text-2xl font-semibold mb-4">Why Choose Our Services for {niche.name}?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center p-4">
                    <Building2 className="w-12 h-12 text-blue-600 mb-4" />
                    <h3 className="font-semibold mb-2">Industry Expertise</h3>
                    <p className="text-gray-600">Specialised knowledge in {niche.name.toLowerCase()} across various sectors</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <MapPin className="w-12 h-12 text-blue-600 mb-4" />
                    <h3 className="font-semibold mb-2">Local Understanding</h3>
                    <p className="text-gray-600">Deep knowledge of local business environment</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <Users2 className="w-12 h-12 text-blue-600 mb-4" />
                    <h3 className="font-semibold mb-2">Dedicated Support</h3>
                    <p className="text-gray-600">Personal attention to your business needs</p>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mt-8 mb-6">Available Locations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((location) => (
                  <Link
                    key={location.id}
                    to={`/${location.slug}/${niche.slug}`}
                    className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium text-gray-900">{location.name}</h3>
                    </div>
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