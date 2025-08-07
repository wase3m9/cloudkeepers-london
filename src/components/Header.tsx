
import { Link } from 'react-router-dom';
import { Home, Book, FolderOpen, Calculator, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
interface HeaderProps {
  niches: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}
export function Header({
  niches
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2" aria-label="Cloudkeepers Home">
              <img 
                src="/lovable-uploads/378eac30-6784-49c8-979b-e25168617a65.png" 
                alt="Cloudkeepers Logo" 
                className="w-8 h-8"
              />
              <span className="font-semibold text-lg text-gray-900 hidden sm:block">Cloudkeepers</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {niches.slice(0, 4).map(niche => (
              <Link 
                key={niche.id} 
                to={`/services/${niche.slug}`} 
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap py-2 px-3 rounded-md hover:bg-gray-50"
              >
                {niche.name}
              </Link>
            ))}
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors bg-transparent px-3 py-2 h-auto">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/blogs" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors p-2 rounded hover:bg-gray-50">
                            <Book className="w-4 h-4" />
                            <span>Blogs</span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/resources" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors p-2 rounded hover:bg-gray-50">
                            <FolderOpen className="w-4 h-4" />
                            <span>Resources</span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/calculators" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors p-2 rounded hover:bg-gray-50">
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

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <a 
              href="https://cloudkeepers.typeform.com/to/lc5feN" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors min-h-[44px] flex items-center"
            >
              Get Quote
            </a>
            <Link 
              to="/contact" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors min-h-[44px] flex items-center"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 min-h-[44px] min-w-[44px]"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2 bg-white">
            {niches.map(niche => (
              <Link 
                key={niche.id} 
                to={`/services/${niche.slug}`} 
                className="block text-base font-medium text-gray-600 hover:text-blue-600 transition-colors py-3 px-4 rounded-md hover:bg-gray-50 min-h-[44px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {niche.name}
              </Link>
            ))}
            
            <div className="border-t border-gray-100 pt-2 mt-2">
              <Link 
                to="/blogs" 
                className="flex items-center space-x-3 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors py-3 px-4 rounded-md hover:bg-gray-50 min-h-[44px]"
                onClick={() => setIsMenuOpen(false)}
              >
                <Book className="w-5 h-5" />
                <span>Blogs</span>
              </Link>
              <Link 
                to="/resources" 
                className="flex items-center space-x-3 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors py-3 px-4 rounded-md hover:bg-gray-50 min-h-[44px]"
                onClick={() => setIsMenuOpen(false)}
              >
                <FolderOpen className="w-5 h-5" />
                <span>Resources</span>
              </Link>
              <Link 
                to="/calculators" 
                className="flex items-center space-x-3 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors py-3 px-4 rounded-md hover:bg-gray-50 min-h-[44px]"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calculator className="w-5 h-5" />
                <span>Calculators</span>
              </Link>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mt-4 space-y-3">
              <a 
                href="https://cloudkeepers.typeform.com/to/lc5feN" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full bg-green-600 text-white px-4 py-3 rounded-md text-base font-medium hover:bg-green-700 transition-colors text-center min-h-[44px] flex items-center justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Quote
              </a>
              <Link 
                to="/contact" 
                className="block w-full bg-blue-600 text-white px-4 py-3 rounded-md text-base font-medium hover:bg-blue-700 transition-colors text-center min-h-[44px] flex items-center justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
