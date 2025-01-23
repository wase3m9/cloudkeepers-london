import { Helmet } from 'react-helmet'
import { LeadForm } from './LeadForm'
import { Header } from './Header'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Phone, Mail, Clock } from 'lucide-react'
import { Footer } from './Footer'

export function ContactPage() {
  const [niches, setNiches] = useState<any[]>([])

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
        <title>Contact Us | Professional Accounting Services</title>
        <meta name="description" content="Get in touch with our team of accounting experts. We're here to help with all your accounting and tax needs." />
      </Helmet>

      <Header niches={niches} />

      <div className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600">
              Get in touch with our team of experts. We're here to help with all your accounting needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Our Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">info@cloud-keepers.co.uk</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">020 3553 8444</p>
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
