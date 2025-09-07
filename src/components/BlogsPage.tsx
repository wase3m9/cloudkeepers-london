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
          id: '7',
          title: 'The Most Tax-Efficient Way for London Directors to Pay Themselves in 2025/26',
          excerpt: 'Take home more of your money. If you\'re a director of a limited company in London, how you pay yourself matters. Here\'s how to balance salary and dividends in 2025/26 for maximum tax efficiency.',
          slug: 'the-most-tax-efficient-way-for-london-directors-to-pay-themselves-2025-26',
          created_at: '05-08-2025',
          author: 'Tax Advisory Team',
          category: 'Tax Planning',
          image: '/lovable-uploads/627552b5-0dbe-4298-ad20-0dfab96746b7.png'
        },
        {
          id: '6',
          title: '8 Common Accounting Mistakes That Hurt Small Businesses',
          excerpt: 'Avoid HMRC fines and cash flow issues. Discover 8 accounting mistakes small business owners often make — plus practical tips to prevent them.',
          slug: '8-common-accounting-mistakes-that-hurt-small-businesses',
          created_at: '30-06-2025',
          author: 'Accounting Team',
          category: 'Business Accounting',
          image: '/lovable-uploads/135bfbd5-ffb2-4881-8a5a-954f426e1a75.png'
        },
        {
          id: '4',
          title: '5 Common VAT Return Mistakes and How to Avoid Them',
          excerpt: 'Learn the top 5 VAT return mistakes and effective strategies to avoid them, ensuring compliance and accuracy in your business.',
          slug: '5-common-vat-return-mistakes-and-how-to-avoid-them',
          created_at: '15-03-2025',
          author: 'Tax Team',
          category: 'VAT',
          image: '/lovable-uploads/d1d24af5-267f-4081-bf95-7f8eda8b7d83.png'
        },
        {
          id: '5',
          title: '7 Essential Tax Deadlines for UK Small Businesses in 2025',
          excerpt: 'Learn essential tax deadlines for UK small businesses in 2025 to avoid penalties and ensure smooth operations.',
          slug: '7-essential-tax-deadlines-for-uk-small-businesses-in-2025',
          created_at: '10-02-2025',
          author: 'Tax Advisory Team',
          category: 'Tax Planning',
          image: '/lovable-uploads/39565cc9-0954-472b-a1cf-7e09fbdfcec9.png'
        }
      ]
      
      setBlogPosts(dummyPosts)
      setLoading(false)
    }

    fetchNiches()
    fetchBlogPosts()
  }, [])

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://cloud-keepers.co.uk/#org",
        "name": "Cloudkeepers Accountants",
        "url": "https://cloud-keepers.co.uk/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://cloud-keepers.co.uk/logo.png",
          "contentUrl": "https://cloud-keepers.co.uk/logo.png"
        },
        "brand": { "@type": "Brand", "name": "Cloudkeepers Accountants" },
        "founder": { "@type": "Person", "name": "Waseem Choudhary" },
        "sameAs": [
          "https://www.linkedin.com/company/cloudkeepers-accountants",
          "https://twitter.com/cloudkeepers"
        ],
        "contactPoint": [{
          "@type": "ContactPoint",
          "contactType": "sales",
          "email": "hello@cloud-keepers.co.uk",
          "telephone": "+44-020-7118-9799",
          "areaServed": "GB",
          "availableLanguage": ["en-GB"]
        }],
        "knowsAbout": [
          "Accounting services for small businesses",
          "Tax planning and preparation",
          "Bookkeeping and cloud accounting",
          "VAT returns and compliance",
          "Payroll services",
          "Self assessment tax returns",
          "Limited company accounting"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://cloud-keepers.co.uk/#website",
        "url": "https://cloud-keepers.co.uk/",
        "name": "Cloudkeepers Accountants",
        "publisher": { "@id": "https://cloud-keepers.co.uk/#org" },
        "inLanguage": "en-GB",
        "isFamilyFriendly": true,
        "description": "Expert UK accountants offering cloud-based support. Xero & QuickBooks certified. Helping small businesses stay compliant and tax digital ready.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://cloud-keepers.co.uk/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Blog",
        "@id": "https://cloud-keepers.co.uk/#blog",
        "name": "Cloudkeepers Accounting Blog",
        "url": "https://cloud-keepers.co.uk/blogs",
        "publisher": { "@id": "https://cloud-keepers.co.uk/#org" },
        "inLanguage": "en-GB",
        "about": [
          "UK tax advice and updates",
          "Small business accounting tips", 
          "VAT and self assessment guidance",
          "Cloud accounting best practices"
        ],
        "hasPart": blogPosts.map(post => ({
          "@type": "BlogPosting",
          "headline": post.title,
          "url": `https://cloud-keepers.co.uk/blogs/${post.slug}`,
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "datePublished": post.created_at,
          "description": post.excerpt,
          "image": post.image || "https://cloud-keepers.co.uk/og-image.png"
        }))
      },
      {
        "@type": "FAQPage",
        "@id": "https://cloud-keepers.co.uk/#faqs",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Do you offer fixed-price accounting services?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we provide transparent fixed-price packages for bookkeeping, tax returns, and annual accounts to help you budget effectively."
            }
          },
          {
            "@type": "Question",
            "name": "Can you help with Making Tax Digital compliance?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely. We're Xero and QuickBooks certified and help businesses comply with Making Tax Digital requirements for VAT and income tax."
            }
          },
          {
            "@type": "Question",
            "name": "Do you work with cloud accounting software?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we specialize in cloud-based accounting using Xero, QuickBooks, and other leading platforms for real-time financial visibility."
            }
          },
          {
            "@type": "Question", 
            "name": "How quickly can you prepare my self assessment?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most self assessments are completed within 5-7 working days of receiving all required documents, well before the January deadline."
            }
          }
        ]
      }
    ],
    "dateModified": "2025-01-12"
  }

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
        
        {/* Comprehensive Schema */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
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
                  {post.image && (
                    <Link to={`/blogs/${post.slug}`} className="block mb-4">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-lg shadow-sm" 
                      />
                    </Link>
                  )}
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
