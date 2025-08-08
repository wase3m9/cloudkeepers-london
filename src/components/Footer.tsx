
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail } from 'lucide-react'

export function Footer() {
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

  // Add a useEffect to clear browser cache for favicon and potentially other assets
  useEffect(() => {
    // Create a link element for the favicon
    const links = document.querySelectorAll("link[rel*='icon']") as NodeListOf<HTMLLinkElement>;
    links.forEach(link => {
      // Force reload by adding a timestamp query parameter
      const timestamp = new Date().getTime();
      if (link.href.includes('lovable-uploads')) {
        // Update all favicon links with the same cache-busting timestamp
        link.href = `/lovable-uploads/38bd3d15-3145-4d5c-a195-5412cdea9a8e.png?v=${timestamp}`;
      }
    });
    
    // Also update apple-touch-icon links
    const appleLinks = document.querySelectorAll("link[rel='apple-touch-icon']") as NodeListOf<HTMLLinkElement>;
    appleLinks.forEach(link => {
      const timestamp = new Date().getTime();
      if (link.href.includes('lovable-uploads')) {
        link.href = `/lovable-uploads/38bd3d15-3145-4d5c-a195-5412cdea9a8e.png?v=${timestamp}`;
      }
    });
    
    console.log('Footer rendered with updated favicon cache busting for all sizes');
  }, []);

  return (
    <footer className="bg-[#1A1F2C] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p>020 7118 9799</p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <a href={`mailto:${emailAddress}`} className="hover:text-blue-400 transition-colors">
                  {emailAddress}
                </a>
              </p>
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
          <p className="text-sm mb-2">© 2025 <a href="https://www.cloud-keepers.co.uk" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Cloudkeepers London Ltd</a>. All rights reserved.</p>
          <p className="text-sm">© <a href="https://www.cloud-keepers.co.uk" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Cloudkeepers London Ltd</a>, a company registered in England and Wales; Reg Number 11047263</p>
        </div>
      </div>
    </footer>
  )
}
