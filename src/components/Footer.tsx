
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function Footer() {
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
    <footer className="bg-[#1A1F2C] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p>020 3553 8444</p>
              <p>info@cloud-keepers.co.uk</p>
              <p>Monday - Friday: 9:30 AM - 6:30 PM</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {niches.slice(0, 4).map((niche) => (
                <li key={niche.id}>
                  <Link
                    to={`/services/${niche.slug}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {niche.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p className="mb-2">© 2025 Cloudkeepers London Ltd. All rights reserved.</p>
          <p className="text-sm">© Cloudkeepers London Ltd, a company registered in England and Wales; Reg Number 11047263</p>
        </div>
      </div>
    </footer>
  )
}
