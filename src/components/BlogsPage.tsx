
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Header } from './Header'
import { Footer } from './Footer'
import { supabase } from '@/lib/supabase'
import { Link } from 'react-router-dom'
import { Calendar, User, ChevronRight } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  slug: string
  created_at: string
  author: string
  category: string
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
          id: '1',
          title: 'Understanding UK Tax Returns: A Complete Guide',
          excerpt: 'Learn everything you need to know about UK tax returns, deadlines, and how to maximize your deductions.',
          slug: 'understanding-uk-tax-returns',
          created_at: '2023-06-15',
          author: 'John Smith',
          category: 'Tax'
        },
        {
          id: '2',
          title: 'Self-Assessment Tips for Freelancers',
          excerpt: 'Essential tips for freelancers filing self-assessment tax returns in the UK.',
          slug: 'self-assessment-tips-freelancers',
          created_at: '2023-07-20',
          author: 'Emma Wilson',
          category: 'Self Assessment'
        },
        {
          id: '3',
          title: 'Making Tax Digital: What You Need to Know',
          excerpt: 'A comprehensive guide to the UK\'s Making Tax Digital initiative and how it affects your business.',
          slug: 'making-tax-digital-guide',
          created_at: '2023-08-05',
          author: 'Robert Johnson',
          category: 'Tax Planning'
        }
      ]
      
      setBlogPosts(dummyPosts)
      setLoading(false)
    }

    fetchNiches()
    fetchBlogPosts()
  }, [])

  return (
    <>
      <Helmet>
        <title>Accounting & Tax Blog | Expert Financial Insights | Cloudkeepers</title>
        <meta name="description" content="Stay updated with the latest accounting, tax and financial insights. Expert advice for businesses and individuals from Cloudkeepers Accountants." />
        <meta name="keywords" content="accounting blog, tax advice, financial insights, UK tax, business accounting, self assessment, VAT returns" />
        <meta property="og:title" content="Accounting & Tax Blog | Expert Financial Insights | Cloudkeepers" />
        <meta property="og:description" content="Stay updated with the latest accounting, tax and financial insights. Expert advice for businesses and individuals from Cloudkeepers Accountants." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cloudkeepers.co.uk/blogs" />
        <link rel="canonical" href="https://cloudkeepers.co.uk/blogs" />
      </Helmet>

      <Header niches={niches} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Accounting & Tax Insights</h1>
          <p className="text-lg text-gray-700 mb-8">
            Stay updated with the latest accounting and tax information, tips, and expert insights to help 
            you manage your finances effectively.
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {blogPosts.map((post) => (
                <article key={post.id} className="border-b border-gray-200 pb-8">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {post.created_at}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{post.category}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link to={`/blogs/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-700 mb-4">{post.excerpt}</p>
                  <Link 
                    to={`/blogs/${post.slug}`} 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Read more <ChevronRight className="w-4 h-4 ml-1" />
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
