import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { LeadForm } from './LeadForm'
import { Helmet } from 'react-helmet'
import { CloudIcon, ArrowRight } from 'lucide-react'

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
    <>
      <Helmet>
        <title>Cloudkeepers Accountants | Making Accounting Simple</title>
        <meta name="description" content="Professional accounting services in the UK. Xero and Quickbooks specialists making tax digital ready." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative h-[600px] bg-[url('/lovable-uploads/e3ef1914-5b75-4ba8-8bfd-90e897225f76.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h1 className="text-5xl font-bold mb-6">London-Based Accountants, Making Accounting Simple</h1>
              <p className="text-xl mb-8">Xero and Quickbooks Specialist, Making Tax Digital Ready</p>
              <Link to="#contact" className="bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600 transition-colors inline-flex items-center">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* What Sets Us Apart */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What sets us apart from the rest of the accountants practising here in the UK?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Friendly yet professional client relationships</h3>
              <p className="text-gray-600">We believe in building lasting relationships with our clients through clear communication and understanding.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Affordable fees for businesses</h3>
              <p className="text-gray-600">Competitive rates for self-employed, start-ups, and small scale entrepreneurs.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Flexible working hours</h3>
              <p className="text-gray-600">We adapt to suit the requirements of our clients, ensuring convenience and accessibility.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Unlimited support</h3>
              <p className="text-gray-600">Free basic tax planning and responsive support for all client inquiries.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {niches.map((niche) => (
              <Link
                key={niche.id}
                to={`/services/${niche.slug}`}
                className="group bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <CloudIcon className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-500 transition-colors">{niche.name}</h3>
                <p className="text-gray-600">{niche.description}</p>
                <span className="inline-flex items-center text-blue-500 mt-4">
                  Learn more <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Locations */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Where We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularLocations.map((location) => (
              <div key={location.id} className="space-y-2">
                {niches.map((niche) => (
                  <Link
                    key={`${location.id}-${niche.id}`}
                    to={`/${location.slug}/${niche.slug}`}
                    className="block text-gray-600 hover:text-blue-500"
                  >
                    {niche.name} in {location.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Get Your Free Quote</h2>
              <p className="text-gray-600 mb-8">
                Let us help you streamline your accounting processes and ensure compliance with all regulatory requirements.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CloudIcon className="w-6 h-6 text-blue-500 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold">Cloud-Based Solutions</h3>
                    <p className="text-gray-600">Access your financial data anytime, anywhere</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CloudIcon className="w-6 h-6 text-blue-500 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold">Expert Support</h3>
                    <p className="text-gray-600">Dedicated team of qualified accountants</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <LeadForm />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}