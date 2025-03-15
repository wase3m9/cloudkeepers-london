
import { Link } from 'react-router-dom'
import { Home, Book, FolderOpen, Calculator, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

interface HeaderProps {
  niches: Array<{
    id: string
    name: string
    slug: string
  }>
}

export function Header({ niches }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-5">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Home"
            >
              <Home className="w-5 h-5" />
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
            
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm text-gray-600 hover:text-blue-600 transition-colors bg-transparent px-2 py-1 h-auto">
                      <span className="flex items-center">
                        Resources
                      </span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-3 p-4">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/blogs"
                              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                              <Book className="w-4 h-4" />
                              <span>Blogs</span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/resources"
                              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                              <FolderOpen className="w-4 h-4" />
                              <span>Resources</span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/calculators"
                              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                              <Calculator className="w-4 h-4" />
                              <span>Calculators</span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
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
