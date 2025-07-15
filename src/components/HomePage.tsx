import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { LeadForm } from './LeadForm'
import { Helmet } from 'react-helmet'
import { CloudIcon, ArrowRight, Building2, Calculator, FileText, DollarSign, Percent, CreditCard, Briefcase, Users } from 'lucide-react'
import { Header } from './Header'
import { Footer } from './Footer'

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

  const handleConsultationClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const serviceIcons = {
    'Limited Company Accounting': <Building2 className="w-12 h-12 group-hover:animate-jiggle" />,
    'Self Assessment': <Calculator className="w-12 h-12 group-hover:animate-jiggle" />,
    'Bookkeeping': <FileText className="w-12 h-12 group-hover:animate-jiggle" />,
    'Tax Planning': <Percent className="w-12 h-12 group-hover:animate-jiggle" />,
    'Payroll': <Users className="w-12 h-12 group-hover:animate-jiggle" />,
    'VAT Returns': <CreditCard className="w-12 h-12 group-hover:animate-jiggle" />,
    'Accounting Services': <Briefcase className="w-12 h-12 group-hover:animate-jiggle" />
  }

  return (
    <>
      <Helmet>
        <title>Cloudkeepers Accountants | Making Accounting Simple</title>
        <meta name="description" content="Professional accounting services in the UK. Expert Xero and QuickBooks specialists offering bookkeeping, tax planning, VAT returns, and Making Tax Digital compliance solutions." />
      </Helmet>

      <Header niches={niches} />

      {/* Hero Section */}
      <div className="relative h-[600px] bg-[url('/lovable-uploads/6a8cee13-1645-48da-b9c9-a975b4aaf629.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-2xl animate-fade-in">
              <h1 className="text-5xl font-bold mb-6">Cloudkeepers Accountants, Making Accounting Simple</h1>
              <p className="text-xl mb-8">Xero and Quickbooks Specialist, Making Tax Digital Ready</p>
              <Link 
                to="#contact" 
                onClick={handleConsultationClick}
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                Get Started <ArrowRight className="ml-2" />
              </Link>
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
                className="group bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow hover:scale-105 transform duration-200"
              >
                <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                  {serviceIcons[niche.name as keyof typeof serviceIcons] || <CloudIcon className="w-12 h-12 group-hover:animate-jiggle" />}
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

      {/* Ready to Talk Section */}
      <div className="relative bg-blue-900 py-20">
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-white mb-8">Ready to talk?</h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-12">
            Why not give us a call or email us to book an appointment for free consultation at your comfort? Our normal office hours are between 9:30 am to 6:30 pm but on request, we work till late in the evening and on weekends as well providing you the great flexibility.
          </p>
          <Link
            to="#contact"
            onClick={handleConsultationClick}
            className="inline-flex items-center bg-blue-400 text-white px-8 py-3 rounded-md hover:bg-blue-500 transition-colors text-lg font-medium"
          >
            LET'S TALK
          </Link>
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

      <Footer />
    </>
  )
}
