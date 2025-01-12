import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { LeadForm } from './LeadForm'
import { supabase } from '@/lib/supabase'

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
          .single()

        const { data: descData } = await supabase
          .from('content_cache')
          .select('content')
          .eq('city', city)
          .eq('service', service)
          .eq('type', 'meta_description')
          .single()

        const { data: mainData } = await supabase
          .from('content_cache')
          .select('content')
          .eq('city', city)
          .eq('service', service)
          .eq('type', 'main_content')
          .single()

        setContent({
          title: titleData?.content || `${service} Services in ${city}`,
          description: descData?.content || `Professional ${service} services in ${city}. Get in touch for a free consultation.`,
          mainContent: mainData?.content || 'Loading content...'
        })
      } catch (error) {
        console.error('Error fetching content:', error)
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
          <div 
            className="prose lg:prose-lg"
            dangerouslySetInnerHTML={{ __html: content.mainContent }}
          />
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