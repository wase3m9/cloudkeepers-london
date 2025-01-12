import { Link } from 'react-router-dom'

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
          <Link to="/" className="text-xl font-bold text-blue-600">
            Cloudkeepers Accountants
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {niches.map((niche) => (
              <Link
                key={niche.id}
                to={`/services/${niche.slug}`}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {niche.name}
              </Link>
            ))}
          </div>

          <Link
            to="#contact"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </nav>
    </header>
  )
}