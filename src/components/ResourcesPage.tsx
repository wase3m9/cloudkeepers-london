
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Header } from './Header'
import { Footer } from './Footer'
import { supabase } from '@/lib/supabase'
import { FileText, Download, ExternalLink } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface Resource {
  id: string
  title: string
  description: string
  type: 'guide' | 'template' | 'checklist'
  downloadUrl: string
  fileType: 'pdf' | 'xlsx' | 'docx'
}

export function ResourcesPage() {
  const [niches, setNiches] = useState<any[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNiches = async () => {
      const { data } = await supabase.from('niches').select('*')
      if (data) setNiches(data)
    }

    const fetchResources = async () => {
      setLoading(true)
      // In a real implementation, this would fetch from a resources table
      // For now, adding realistic sample resources with proper file types
      const dummyResources: Resource[] = [
        {
          id: '1',
          title: 'Small Business Accounting Checklist',
          description: 'A comprehensive checklist to help small businesses manage their accounting effectively.',
          type: 'checklist',
          downloadUrl: '/resources/small-business-accounting-checklist.pdf',
          fileType: 'pdf'
        },
        {
          id: '2',
          title: 'Self-Assessment Tax Return Template',
          description: 'A template to help you prepare all the information needed for your self-assessment tax return.',
          type: 'template',
          downloadUrl: '/resources/self-assessment-template.xlsx',
          fileType: 'xlsx'
        },
        {
          id: '3',
          title: 'VAT Registration Guide',
          description: 'Step-by-step guide on when and how to register for VAT in the UK.',
          type: 'guide',
          downloadUrl: '/resources/vat-registration-guide.pdf',
          fileType: 'pdf'
        },
        {
          id: '4',
          title: 'Business Expense Tracker',
          description: 'A template to help you track and categorize your business expenses for tax purposes.',
          type: 'template',
          downloadUrl: '/resources/business-expense-tracker.xlsx',
          fileType: 'xlsx'
        },
        {
          id: '5',
          title: 'Tax Deadline Calendar',
          description: 'A calendar of important tax deadlines for UK businesses and individuals.',
          type: 'guide',
          downloadUrl: '/resources/tax-deadline-calendar.pdf',
          fileType: 'pdf'
        },
        {
          id: '6',
          title: 'Invoice Template for Small Businesses',
          description: 'Professional invoice template compliant with UK requirements.',
          type: 'template',
          downloadUrl: '/resources/invoice-template.docx',
          fileType: 'docx'
        }
      ]
      
      setResources(dummyResources)
      setLoading(false)
    }

    fetchNiches()
    fetchResources()
  }, [])

  const handleDownload = (resource: Resource) => {
    // In a real scenario, this would track downloads or require login
    // For now, we'll show a toast notification
    toast({
      title: "Download started",
      description: `Your ${resource.title} is downloading.`,
      duration: 3000,
    })
    
    // In a real implementation, this would be an actual download
    // For the purpose of demonstration, we'll just open a new tab with a placeholder message
    window.open(`https://cloudkeepers.co.uk${resource.downloadUrl}`, '_blank')
  }

  const getFileIcon = (fileType: string) => {
    switch(fileType) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />
      case 'xlsx':
        return <FileText className="w-5 h-5 text-green-600" />
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-600" />
      default:
        return <FileText className="w-5 h-5 text-blue-600" />
    }
  }

  return (
    <>
      <Helmet>
        <title>Free Accounting & Tax Resources | Templates & Guides | Cloudkeepers</title>
        <meta name="description" content="Download free accounting and tax resources, templates, checklists and guides to help manage your finances and tax obligations efficiently." />
        <meta name="keywords" content="accounting resources, tax templates, financial guides, UK tax resources, business accounting templates, self assessment guides" />
        <meta property="og:title" content="Free Accounting & Tax Resources | Templates & Guides | Cloudkeepers" />
        <meta property="og:description" content="Download free accounting and tax resources, templates, checklists and guides to help manage your finances and tax obligations efficiently." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cloudkeepers.co.uk/resources" />
        <link rel="canonical" href="https://cloudkeepers.co.uk/resources" />
      </Helmet>

      <Header niches={niches} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Free Accounting & Tax Resources</h1>
          <p className="text-lg text-gray-700 mb-8">
            Access our library of free resources, templates, and guides to help you manage your finances
            and tax obligations effectively.
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <div key={resource.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {getFileIcon(resource.fileType)}
                      <span className="text-sm font-medium uppercase text-blue-600 ml-2">{resource.type} ({resource.fileType.toUpperCase()})</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h2>
                    <p className="text-gray-700 mb-4">{resource.description}</p>
                    <button 
                      onClick={() => handleDownload(resource)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                      <Download className="w-4 h-4 mr-1" /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
