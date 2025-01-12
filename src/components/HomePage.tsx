import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { LeadForm } from './LeadForm'
import { Helmet } from 'react-helmet'
import { CloudIcon, ArrowRight, Building2, Calculator, FileText, PiggyBank, Users } from 'lucide-react'
import { Header } from './Header'

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

  const serviceIcons = {
    'Limited Company Accounting': <Building2 className="w-12 h-12" />,
    'Self Assessment': <Calculator className="w-12 h-12" />,
    'Bookkeeping': <FileText className="w-12 h-12" />,
    'Tax Planning': <PiggyBank className="w-12 h-12" />,
    'Payroll': <Users className="w-12 h-12" />
  }

  return (
    <>
      <Helmet>
        <title>Cloudkeepers Accountants | Making Accounting Simple</title>
        <meta name="description" content="Professional accounting services in the UK. Xero and Quickbooks specialists making tax digital ready." />
      </Helmet>

      <Header niches={niches} />

      {/* Hero Section */}
      <div className="relative h-[600px] bg-[url('/lovable-uploads/6a8cee13-1645-48da-b9c9-a975b4aaf629.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-2xl animate-fade-in">
              <h1 className="text-5xl font-bold mb-6">Cloudkeepers Accountants, Making Accounting Simple</h1>
              <p className="text-xl mb-8">Xero and Quickbooks Specialist, Making Tax Digital Ready</p>
              <Link to="#contact" className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Images Grid */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
            <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop" alt="Business Meeting" className="w-full h-full object-cover" />
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" alt="Office Work" className="w-full h-full object-cover" />
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop" alt="Woman Working on Laptop" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* What Sets Us Apart */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What sets us apart from other UK accountants?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Friendly yet professional client relationships</h3>
              <p className="text-gray-600">We believe in building lasting relationships with our clients through clear communication and understanding.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Comprehensive service packages</h3>
              <p className="text-gray-600">Tailored solutions for self-employed, start-ups, and small scale entrepreneurs.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Flexible working hours</h3>
              <p className="text-gray-600">We adapt to suit the requirements of our clients, ensuring convenience and accessibility.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Unlimited support</h3>
              <p className="text-gray-600">Free basic tax planning and responsive support for all client inquiries.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {niches.map((niche) => (
              <Link
                key={niche.id}
                to={`/services/${niche.slug}`}
                className="group bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                  {serviceIcons[niche.name as keyof typeof serviceIcons] || <CloudIcon className="w-12 h-12" />}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">{niche.name}</h3>
                <p className="text-gray-600">{niche.description}</p>
                <span className="inline-flex items-center text-blue-600 mt-4 group-hover:text-blue-700">
                  Learn more <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Get Your Free Quote</h2>
              <p className="text-gray-600 mb-8">
                Let us help you streamline your accounting processes and ensure compliance with all regulatory requirements.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CloudIcon className="w-6 h-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold">Cloud-Based Solutions</h3>
                    <p className="text-gray-600">Access your financial data anytime, anywhere</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CloudIcon className="w-6 h-6 text-blue-600 mr-4 mt-1" />
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
