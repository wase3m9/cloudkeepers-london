
import { Helmet } from 'react-helmet'
import { LeadForm } from './LeadForm'
import { Header } from './Header'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Phone, Mail, Clock } from 'lucide-react'
import { Footer } from './Footer'

export function ContactPage() {
  const [niches, setNiches] = useState<any[]>([])
  const emailAddress = 'info@cloud-keepers.co.uk'

  useEffect(() => {
    const fetchNiches = async () => {
      const { data } = await supabase
        .from('niches')
        .select('*')
        .order('name')
      
      if (data) setNiches(data)
    }

    fetchNiches()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contact Cloudkeepers Accountants London | Get Free Consultation</title>
        <meta name="description" content="Contact London's leading accountants for professional accounting services. Free consultation, expert tax advice, bookkeeping & VAT services. Call today!" />
        <meta name="keywords" content="contact accountant London, accounting services contact, free consultation accountant, London tax advisor contact, bookkeeping services London" />
        <link rel="canonical" href="https://cloud-keepers.co.uk/contact" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Contact Cloudkeepers Accountants London | Get Free Consultation" />
        <meta property="og:description" content="Contact London's leading accountants for professional accounting services. Free consultation, expert tax advice, bookkeeping & VAT services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cloud-keepers.co.uk/contact" />
        <meta property="og:image" content="/lovable-uploads/378eac30-6784-49c8-979b-e25168617a65.png" />
      </Helmet>

      <Header niches={niches} />

      <div className="flex-grow py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Contact London's Leading Accountants</h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get in touch with our team of expert accountants. We're here to help with all your accounting needs in London.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Our Contact Information</h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">Email</h3>
                    <p className="text-gray-600">
                      <a href={`mailto:${emailAddress}`} className="hover:text-blue-600 transition-colors">
                        {emailAddress}
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">Phone</h3>
                    <p className="text-gray-600">
                      <a href="tel:+442035538444" className="hover:text-blue-600 transition-colors">
                        020 3553 8444
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Office Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:30 AM - 6:30 PM</p>
                    <p className="text-gray-600">Extended hours available upon request</p>
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
    </div>
  )
}
