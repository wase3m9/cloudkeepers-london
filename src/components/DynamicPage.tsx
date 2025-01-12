import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { LeadForm } from './LeadForm'
import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'

export function DynamicPage() {
  const { city = 'london', service = 'accounting' } = useParams()
  const [content, setContent] = useState({
    title: '',
    description: '',
    mainContent: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Try to fetch from cache first
        const { data: titleData } = await supabase
          .from('content_cache')
          .select('content')
          .eq('city', city)
          .eq('service', service)
          .eq('type', 'meta_title')
          .maybeSingle()

        const { data: descData } = await supabase
          .from('content_cache')
          .select('content')
          .eq('city', city)
          .eq('service', service)
          .eq('type', 'meta_description')
          .maybeSingle()

        const { data: mainData } = await supabase
          .from('content_cache')
          .select('content')
          .eq('city', city)
          .eq('service', service)
          .eq('type', 'main_content')
          .maybeSingle()

        if (!titleData || !descData || !mainData) {
          // Generate new content if any is missing
          const response = await fetch('/api/generate-content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city, service, type: 'all' }),
          })

          if (!response.ok) throw new Error('Failed to generate content')

          const newContent = await response.json()
          setContent({
            title: newContent.title,
            description: newContent.description,
            mainContent: newContent.mainContent
          })
        } else {
          setContent({
            title: titleData.content,
            description: descData.content,
            mainContent: mainData.content
          })
        }
      } catch (error) {
        console.error('Error fetching content:', error)
        setContent({
          title: `${service} Services in ${city}`,
          description: `Professional ${service} services in ${city}. Get in touch for a free consultation.`,
          mainContent: `# Welcome to our ${service} services in ${city}\n\nWe provide professional assistance tailored to your needs.`
        })
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [city, service])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
      </Helmet>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-8">{content.title}</h1>
          <div className="prose lg:prose-lg">
            <ReactMarkdown>{content.mainContent}</ReactMarkdown>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <LeadForm />
          </div>
        </div>
      </div>
    </div>
  )
}