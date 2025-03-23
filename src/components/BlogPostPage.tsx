
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Header } from './Header'
import { Footer } from './Footer'
import { supabase } from '@/lib/supabase'
import { Calendar, User } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  content: string
  slug: string
  created_at: string
  author: string
  category: string
  excerpt: string
  metaDescription?: string
  metaKeywords?: string
  image?: string
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [niches, setNiches] = useState<any[]>([])
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNiches = async () => {
      const { data } = await supabase.from('niches').select('*')
      if (data) setNiches(data)
    }

    const fetchBlogPost = async () => {
      setLoading(true)
      
      if (slug === 'top-6-bookkeeping-tips-for-new-business-owners') {
        const bookkeepingPost: BlogPost = {
          id: '6',
          title: 'Top 6 Bookkeeping Tips for New Business Owners',
          content: `<h1 id="top-6-bookkeeping-tips-for-new-business-owners" tabindex="-1">Top 6 Bookkeeping Tips for New Business Owners</h1>
<p><strong>Struggling with bookkeeping as a new business owner?</strong> You're not alone - 21% of small business owners lack bookkeeping knowledge, and 82% of businesses fail due to cash flow issues. Here's a quick guide to get your finances in order and help your business thrive:</p>
<ol>
<li><strong>Open Separate Business Bank Accounts</strong>: Keep personal and business finances separate for easier tracking and legal protection.</li>
<li><strong>Pick Bookkeeping Software</strong>: Tools like <a href="https://quickbooks.intuit.com/online/" target="_blank">QuickBooks</a>, <a href="https://www.freshbooks.com/" target="_blank">FreshBooks</a>, or <a href="https://www.waveapps.com/" target="_blank">Wave</a> simplify tracking income and expenses.</li>
<li><strong>Track Expenses</strong>: Use digital tools to categorize and review expenses regularly, ensuring accurate records.</li>
<li><strong>Learn Basic Tax Rules</strong>: Understand deductions, tax types, and deadlines to stay compliant and save money.</li>
<li><strong>Create a Monthly Bookkeeping Plan</strong>: Set a routine to record, reconcile, and review finances every month.</li>
<li><strong>Know When to Hire an Accountant</strong>: Outsource when your finances become too complex or time-consuming.</li>
</ol>
<p>These steps will make your bookkeeping process smoother, save time, and help you make informed financial decisions.</p>`,
          slug: 'top-6-bookkeeping-tips-for-new-business-owners',
          created_at: '2024-03-20',
          author: 'Finance Team',
          category: 'Bookkeeping',
          excerpt: 'Enhance your bookkeeping skills with these essential tips for new business owners to manage finances effectively and avoid common pitfalls.',
          metaDescription: 'Enhance your bookkeeping skills with these essential tips for new business owners to manage finances effectively and avoid common pitfalls.',
          metaKeywords: 'bookkeeping tips, new business owners, financial management, tax rules, expense tracking',
          image: '/lovable-uploads/dab97726-5bee-4fed-914b-10fcc0f51cc8.png'
        }
        setBlogPost(bookkeepingPost)
      } else if (slug === '5-common-vat-return-mistakes-and-how-to-avoid-them') {
        const vatPost: BlogPost = {
          id: '4',
          title: '5 Common VAT Return Mistakes and How to Avoid Them',
          content: `<h1 id="5-common-vat-return-mistakes-and-how-to-avoid-them" tabindex="-1">5 Common VAT Return Mistakes and How to Avoid Them</h1>
<p><strong>Avoid costly VAT mistakes with these 5 tips:</strong></p>
<ol>
<li><strong>Wrong VAT Calculations</strong>: Errors in applying VAT rates or currency conversions can lead to penalties. Use accounting software to automate calculations and reduce errors.</li>
<li><strong>Missed Filing Deadlines</strong>: Late submissions can result in fines starting at £200. Set reminders or use digital tools to stay on schedule.</li>
<li><strong>Incorrect Expense Categories</strong>: Misclassifying expenses like business meals or travel can distort VAT claims. Review <a href="https://www.gov.uk/government/organisations/hm-revenue-customs" target="_blank">HMRC</a> guidelines and use software to organize expenses.</li>
<li><strong>Poor Record Keeping</strong>: Failing to keep essential documents (sales invoices, receipts, bank statements) for 6 years can lead to compliance issues. Digital tools make storage and retrieval easier.</li>
<li><strong>Missing VAT Rule Updates</strong>: Changes like <a href="https://www.gov.uk/government/publications/making-tax-digital" target="_blank">Making Tax Digital</a> (MTD) require businesses to use approved platforms. Stay informed through HMRC updates or professional accountants.</li>
</ol>
<p><strong>Quick Tip</strong>: Combine expert advice with reliable cloud accounting tools to avoid errors, meet deadlines, and stay compliant with VAT regulations.</p>`,
          slug: '5-common-vat-return-mistakes-and-how-to-avoid-them',
          created_at: '2023-09-10',
          author: 'Tax Team',
          category: 'VAT',
          excerpt: 'Learn the top 5 VAT return mistakes and effective strategies to avoid them, ensuring compliance and accuracy in your business.',
          metaDescription: 'Discover the 5 most common VAT return mistakes UK businesses make and practical solutions to avoid them. Expert guidance for accurate VAT submissions.',
          metaKeywords: 'VAT returns, VAT mistakes, tax errors, HMRC compliance, VAT deadlines, UK tax, small business tax, VAT calculations',
          image: '/lovable-uploads/16d9c894-8bdf-406d-95e3-9441c8a7fd03.png'
        }
        setBlogPost(vatPost)
      } else if (slug === '7-essential-tax-deadlines-for-uk-small-businesses-in-2025') {
        const taxDeadlinesPost: BlogPost = {
          id: '7',
          title: '7 Essential Tax Deadlines for UK Small Businesses in 2025',
          content: `<h1 id="7-essential-tax-deadlines-for-uk-small-businesses-in-2025" tabindex="-1">7 Essential Tax Deadlines for UK Small Businesses in 2025</h1>
<p>As the year 2025 approaches, it's crucial for UK small businesses to stay informed about the essential tax deadlines that will impact their financial health. Here are the top 7 deadlines you need to be aware of:</p>
<h2 id="1-income-tax-return" tabindex="-1">1. Income Tax Return</h2>
<p>The Income Tax Return is due on 31 January 2025. This deadline is crucial for small businesses to report their income and tax liability to HMRC.</p>
<h2 id="2-self-employment-tax-return" tabindex="-1">2. Self-Employment Tax Return</h2>
<p>The Self-Employment Tax Return is due on 31 January 2025. This deadline is important for self-employed individuals to report their income and tax liability to HMRC.</p>
<h2 id="3-vat-return" tabindex="-1">3. VAT Return</h2>
<p>The VAT Return is due on 31 January 2025. This deadline is essential for businesses to report their VAT liability to HMRC.</p>`,
          slug: '7-essential-tax-deadlines-for-uk-small-businesses-in-2025',
          created_at: '2025-01-01',
          author: 'Tax Team',
          category: 'Tax Planning',
          excerpt: 'Discover the essential tax deadlines for UK small businesses in 2025 and how to stay compliant.',
          metaDescription: 'Learn about the top 7 essential tax deadlines for UK small businesses in 2025 and how to ensure compliance with HMRC regulations.',
          metaKeywords: 'UK small businesses, tax deadlines, 2025, HMRC compliance, employee tax, employer tax, pension tax',
          image: '/lovable-uploads/6058db1e-9925-4bc2-94ff-e1e51b3bc192.png'
        }
        setBlogPost(taxDeadlinesPost)
      }

      setLoading(false)
    }

    fetchNiches()
    fetchBlogPost()
  }, [slug])

  return (
    <>
      <Helmet>
        {blogPost ? (
          <>
            <title>{blogPost.title} | Cloudkeepers</title>
            <meta name="description" content={blogPost.metaDescription || blogPost.excerpt} />
            <meta name="keywords" content={blogPost.metaKeywords || `accounting, tax, ${blogPost.category}, financial insights, business advice`} />
            <meta property="og:title" content={`${blogPost.title} | Cloudkeepers`} />
            <meta property="og:description" content={blogPost.metaDescription || blogPost.excerpt} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={`https://cloudkeepers.co.uk/blogs/${blogPost.slug}`} />
            {blogPost.image && <meta property="og:image" content={blogPost.image} />}
            <link rel="canonical" href={`https://cloudkeepers.co.uk/blogs/${blogPost.slug}`} />
          </>
        ) : (
          <title>Blog | Cloudkeepers</title>
        )}
      </Helmet>

      <Header niches={niches} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : blogPost ? (
          <article className="prose prose-lg max-w-none">
            {blogPost.image && (
              <img 
                src={blogPost.image} 
                alt={blogPost.title}
                className="w-full h-auto object-cover rounded-lg shadow-md mb-8"
              />
            )}
            <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {blogPost.created_at}
              </span>
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {blogPost.author}
              </span>
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {blogPost.category}
              </span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
          </article>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold text-gray-900">Blog post not found</h1>
            <p className="mt-4 text-gray-600">
              The blog post you're looking for doesn't exist or may have been moved.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
