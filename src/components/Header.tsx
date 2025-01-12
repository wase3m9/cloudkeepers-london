import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

interface HeaderProps {
  niches: Array<{
    id: string
    name: string
    slug: string
  }>
}

export function Header({ niches }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Home"
            >
              <Home className="w-6 h-6" />
            </Link>
            {niches.map((niche) => (
              <Link
                key={niche.id}
                to={`/services/${niche.slug}`}
                className="hidden md:inline-block text-sm text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {niche.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="https://cloudkeepers.typeform.com/to/lc5feN"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-2.5 py-1 rounded text-sm hover:bg-green-700 transition-colors"
            >
              Request Quote
            </a>
            <Link
              to="/contact"
              className="bg-blue-600 text-white px-2.5 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}