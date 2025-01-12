import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LeadForm } from './LeadForm'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from 'react-markdown'
import { supabase } from '@/lib/supabase'

export function DynamicPage() {
  const { city = 'London', service = 'Accounting' } = useParams()
  const [content, setContent] = useState({
    metaTitle: '',
    metaDescription: '',
    mainContent: '',
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [metaTitle, metaDescription, mainContent] = await Promise.all([
          fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ city, service, type: 'meta_title' }),
          }).then(res => res.json()),
          fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ city, service, type: 'meta_description' }),
          }).then(res => res.json()),
          fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ city, service, type: 'main_content' }),
          }).then(res => res.json()),
        ])

        setContent({
          metaTitle: metaTitle.content,
          metaDescription: metaDescription.content,
          mainContent: mainContent.content,
        })

        // Update meta tags
        document.title = metaTitle.content
        document.querySelector('meta[name="description"]')?.setAttribute('content', metaDescription.content)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load content. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [city, service])

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <article className="prose lg:prose-xl mx-auto">
        <ReactMarkdown>{content.mainContent}</ReactMarkdown>
      </article>
      
      <div className="mt-12">
        <LeadForm />
      </div>
    </div>
  )
}