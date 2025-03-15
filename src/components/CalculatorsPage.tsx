
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Header } from './Header'
import { Footer } from './Footer'
import { supabase } from '@/lib/supabase'
import { Link } from 'react-router-dom'
import { Calculator, ArrowRight } from 'lucide-react'

interface CalculatorTool {
  id: string
  title: string
  description: string
  icon: string
  slug: string
}

export function CalculatorsPage() {
  const [niches, setNiches] = useState<any[]>([])
  const [calculators, setCalculators] = useState<CalculatorTool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNiches = async () => {
      const { data } = await supabase.from('niches').select('*')
      if (data) setNiches(data)
    }

    const fetchCalculators = async () => {
      setLoading(true)
      // In a real implementation, this would fetch from a calculators table
      // For now, adding dummy data
      const dummyCalculators: CalculatorTool[] = [
        {
          id: '1',
          title: 'VAT Calculator',
          description: 'Calculate VAT amounts for different VAT rates in the UK.',
          icon: 'calculator',
          slug: 'vat-calculator'
        },
        {
          id: '2',
          title: 'Self-Assessment Tax Calculator',
          description: 'Estimate your self-assessment tax bill based on your income and expenses.',
          icon: 'calculator',
          slug: 'self-assessment-calculator'
        },
        {
          id: '3',
          title: 'Corporation Tax Calculator',
          description: 'Calculate the corporation tax liability for your business.',
          icon: 'calculator',
          slug: 'corporation-tax-calculator'
        },
        {
          id: '4',
          title: 'Dividend Tax Calculator',
          description: 'Calculate the tax payable on your dividend income.',
          icon: 'calculator',
          slug: 'dividend-tax-calculator'
        },
        {
          id: '5',
          title: 'Salary vs Dividend Calculator',
          description: 'Compare taking income as salary versus dividends as a company director.',
          icon: 'calculator',
          slug: 'salary-vs-dividend-calculator'
        },
        {
          id: '6',
          title: 'Capital Gains Tax Calculator',
          description: 'Estimate the capital gains tax on the sale of assets.',
          icon: 'calculator',
          slug: 'capital-gains-tax-calculator'
        }
      ]
      
      setCalculators(dummyCalculators)
      setLoading(false)
    }

    fetchNiches()
    fetchCalculators()
  }, [])

  return (
    <>
      <Helmet>
        <title>Free Tax & Financial Calculators | Cloudkeepers Accountants</title>
        <meta name="description" content="Use our free tax and financial calculators to estimate VAT, self-assessment, corporation tax, and more. Make informed financial decisions with Cloudkeepers." />
        <meta name="keywords" content="tax calculators, VAT calculator, self assessment calculator, dividend tax calculator, UK tax calculators, financial planning tools" />
        <meta property="og:title" content="Free Tax & Financial Calculators | Cloudkeepers Accountants" />
        <meta property="og:description" content="Use our free tax and financial calculators to estimate VAT, self-assessment, corporation tax, and more. Make informed financial decisions with Cloudkeepers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cloudkeepers.co.uk/calculators" />
        <link rel="canonical" href="https://cloudkeepers.co.uk/calculators" />
      </Helmet>

      <Header niches={niches} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Free Tax & Financial Calculators</h1>
          <p className="text-lg text-gray-700 mb-8">
            Use our suite of free calculators to estimate tax liabilities, compare financial options, 
            and make informed decisions about your finances.
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {calculators.map((calc) => (
                <div key={calc.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      <Calculator className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">{calc.title}</h2>
                    <p className="text-gray-700 mb-4 text-center">{calc.description}</p>
                    <div className="flex justify-center">
                      <Link 
                        to={`/calculators/${calc.slug}`} 
                        className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        Use Calculator <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
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
