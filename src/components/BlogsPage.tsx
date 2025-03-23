
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Header } from './Header'
import { Footer } from './Footer'
import { supabase } from '@/lib/supabase'
import { Link } from 'react-router-dom'
import { Calendar, User, ChevronRight, BookOpen } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  slug: string
  created_at: string
  author: string
  category: string
  image?: string
}

export function BlogsPage() {
  const [niches, setNiches] = useState<any[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNiches = async () => {
      const { data } = await supabase.from('niches').select('*')
      if (data) setNiches(data)
    }

    const fetchBlogPosts = async () => {
      setLoading(true)
      // In a real implementation, this would fetch from a blogs table
      // For now, adding dummy data
      const dummyPosts: BlogPost[] = [
        {
          id: '6',
          title: 'Top 6 Bookkeeping Tips for New Business Owners',
          excerpt: 'Enhance your bookkeeping skills with these essential tips for new business owners to manage finances effectively and avoid common pitfalls.',
          slug: 'top-6-bookkeeping-tips-for-new-business-owners',
          created_at: '2024-03-20',
          author: 'Finance Team',
          category: 'Bookkeeping',
          image: 'https://i.imgur.com/p9QUiPh.jpg'
        },
        {
          id: '4',
          title: '5 Common VAT Return Mistakes and How to Avoid Them',
          excerpt: 'Learn the top 5 VAT return mistakes and effective strategies to avoid them, ensuring compliance and accuracy in your business.',
          slug: '5-common-vat-return-mistakes-and-how-to-avoid-them',
          created_at: '2023-09-10',
          author: 'Tax Team',
          category: 'VAT'
        },
        {
          id: '5',
          title: '7 Essential Tax Deadlines for UK Small Businesses in 2025',
          excerpt: 'Learn essential tax deadlines for UK small businesses in 2025 to avoid penalties and ensure smooth operations.',
          slug: '7-essential-tax-deadlines-for-uk-small-businesses-in-2025',
          created_at: '2023-11-15',
          author: 'Tax Advisory Team',
          category: 'Tax Planning',
          image: 'https://mars-images.imgix.net/seobot/screenshots/www.gov.uk-0831b6bad913906ceab1f4847c784a92-2025-03-15.jpg?auto=compress'
        }
      ]
      
      setBlogPosts(dummyPosts)
      setLoading(false)
    }

    fetchNiches()
    fetchBlogPosts()
  }, [])

  // Generate schema.org JSON-LD structured data for the blog listing
  const generateSchemaOrgData = () => {
    const itemListElements = blogPosts.map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "BlogPosting",
        "headline": post.title,
        "url": `https://cloudkeepers.co.uk/blogs/${post.slug}`,
        "author": {
          "@type": "Person",
          "name": post.author
        },
        "datePublished": post.created_at,
        "description": post.excerpt,
        "image": post.image || "https://cloudkeepers.co.uk/og-image.png"
      }
    }));

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": itemListElements
    };
    
    return JSON.stringify(schemaData);
  };

  return (
    <>
      <Helmet>
        <title>Accounting & Tax Blog | Expert Financial Insights | Cloudkeepers</title>
        <meta name="description" content="Stay updated with the latest accounting, tax and financial insights. Expert advice for businesses and individuals from Cloudkeepers Accountants." />
        <meta name="keywords" content="accounting blog, tax advice, financial insights, UK tax, business accounting, self assessment, VAT returns, bookkeeping tips" />
        <meta property="og:title" content="Accounting & Tax Blog | Expert Financial Insights | Cloudkeepers" />
        <meta property="og:description" content="Stay updated with the latest accounting, tax and financial insights. Expert advice for businesses and individuals from Cloudkeepers Accountants." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cloudkeepers.co.uk/blogs" />
        <link rel="canonical" href="https://cloudkeepers.co.uk/blogs" />
        
        {/* Add JSON-LD structured data script for SEO */}
        <script type="application/ld+json">
          {generateSchemaOrgData()}
        </script>
      </Helmet>

      <Header niches={niches} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Accounting & Tax Insights</h1>
            <p className="text-lg text-gray-700">
              Stay updated with the latest accounting and tax information, tips, and expert insights to help 
              you manage your finances effectively.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-12">
              {blogPosts.map((post) => (
                <article key={post.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
                  {post.image ? (
                    <Link to={`/blogs/${post.slug}`} className="block mb-6">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-60 object-cover rounded-lg shadow-sm" 
                      />
                    </Link>
                  ) : (
                    <div className="flex justify-center items-center h-32 mb-6 bg-gray-100 rounded-lg">
                      <BookOpen className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {post.created_at}
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    <Link to={`/blogs/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link 
                    to={`/blogs/${post.slug}`} 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Continue reading <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
