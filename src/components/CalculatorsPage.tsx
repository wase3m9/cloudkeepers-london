
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Header } from './Header'
import { Footer } from './Footer'
import { supabase } from '@/lib/supabase'
import { Link } from 'react-router-dom'
import { Calculator, ArrowRight, Star } from 'lucide-react'
import { createClient } from '@/integrations/supabase/client'

interface CalculatorTool {
  id: string
  title: string
  description: string
  icon: string
  slug: string
  popularity: number
}

export function CalculatorsPage() {
  const [niches, setNiches] = useState<any[]>([])
  const [calculators, setCalculators] = useState<CalculatorTool[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null)

  useEffect(() => {
    const fetchNiches = async () => {
      const { data } = await supabase.from('niches').select('*')
      if (data) setNiches(data)
    }

    const fetchCalculators = async () => {
      setLoading(true)
      // In a real implementation, this would fetch from a calculators table
      // For now, adding more detailed dummy data
      const dummyCalculators: CalculatorTool[] = [
        {
          id: '1',
          title: 'VAT Calculator',
          description: 'Calculate VAT amounts for different VAT rates in the UK. Quickly determine VAT inclusive and exclusive amounts.',
          icon: 'calculator',
          slug: 'vat-calculator',
          popularity: 95
        },
        {
          id: '2',
          title: 'Self-Assessment Tax Calculator',
          description: 'Estimate your self-assessment tax bill based on your income and expenses for the current tax year.',
          icon: 'calculator',
          slug: 'self-assessment-calculator',
          popularity: 90
        },
        {
          id: '3',
          title: 'Corporation Tax Calculator',
          description: 'Calculate the corporation tax liability for your business based on profits and eligible deductions.',
          icon: 'calculator',
          slug: 'corporation-tax-calculator',
          popularity: 85
        },
        {
          id: '4',
          title: 'Dividend Tax Calculator',
          description: 'Calculate the tax payable on your dividend income with consideration for your tax band and allowances.',
          icon: 'calculator',
          slug: 'dividend-tax-calculator',
          popularity: 80
        },
        {
          id: '5',
          title: 'Salary vs Dividend Calculator',
          description: 'Compare taking income as salary versus dividends as a company director to optimize your tax position.',
          icon: 'calculator',
          slug: 'salary-vs-dividend-calculator',
          popularity: 88
        },
        {
          id: '6',
          title: 'Capital Gains Tax Calculator',
          description: 'Estimate the capital gains tax on the sale of assets including property, shares, and business assets.',
          icon: 'calculator',
          slug: 'capital-gains-tax-calculator',
          popularity: 75
        }
      ]
      
      setCalculators(dummyCalculators)
      setLoading(false)
    }

    fetchNiches()
    fetchCalculators()
  }, [])

  // Simple implementation of the VAT calculator for demonstration
  const [vatAmount, setVatAmount] = useState<number>(0)
  const [vatRate, setVatRate] = useState<number>(20)
  const [exclusiveAmount, setExclusiveAmount] = useState<number>(0)
  const [inclusiveAmount, setInclusiveAmount] = useState<number>(0)
  const [calculationMode, setCalculationMode] = useState<'exclusive' | 'inclusive'>('exclusive')

  const calculateVAT = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (calculationMode === 'exclusive') {
      const vat = exclusiveAmount * (vatRate / 100)
      const inclusive = exclusiveAmount + vat
      setVatAmount(vat)
      setInclusiveAmount(inclusive)
    } else {
      const exclusive = inclusiveAmount / (1 + vatRate / 100)
      const vat = inclusiveAmount - exclusive
      setVatAmount(vat)
      setExclusiveAmount(exclusive)
    }
  }

  const renderCalculator = () => {
    if (!selectedCalculator) return null
    
    switch (selectedCalculator) {
      case 'vat-calculator':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">VAT Calculator</h3>
            <form onSubmit={calculateVAT} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Calculation Mode</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="calculationMode"
                      checked={calculationMode === 'exclusive'}
                      onChange={() => setCalculationMode('exclusive')}
                      className="mr-2"
                    />
                    <span>Add VAT (exclusive to inclusive)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="calculationMode"
                      checked={calculationMode === 'inclusive'}
                      onChange={() => setCalculationMode('inclusive')}
                      className="mr-2"
                    />
                    <span>Remove VAT (inclusive to exclusive)</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">VAT Rate (%)</label>
                <select
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value={20}>Standard Rate (20%)</option>
                  <option value={5}>Reduced Rate (5%)</option>
                  <option value={0}>Zero Rate (0%)</option>
                </select>
              </div>
              
              {calculationMode === 'exclusive' ? (
                <div>
                  <label className="block mb-1 text-sm font-medium">Net Amount (excluding VAT)</label>
                  <input
                    type="number"
                    value={exclusiveAmount || ''}
                    onChange={(e) => setExclusiveAmount(Number(e.target.value))}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border rounded-md"
                    step="0.01"
                    min="0"
                  />
                </div>
              ) : (
                <div>
                  <label className="block mb-1 text-sm font-medium">Gross Amount (including VAT)</label>
                  <input
                    type="number"
                    value={inclusiveAmount || ''}
                    onChange={(e) => setInclusiveAmount(Number(e.target.value))}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border rounded-md"
                    step="0.01"
                    min="0"
                  />
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Calculate
                </button>
              </div>
            </form>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium mb-2">Results</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Net Amount (excl. VAT)</p>
                  <p className="font-semibold">£{exclusiveAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">VAT Amount ({vatRate}%)</p>
                  <p className="font-semibold">£{vatAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gross Amount (incl. VAT)</p>
                  <p className="font-semibold">£{inclusiveAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p>This calculator is coming soon. Please check back later.</p>
            <button 
              onClick={() => setSelectedCalculator(null)} 
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              ← Back to all calculators
            </button>
          </div>
        )
    }
  }

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Free Tax & Financial Calculators</h1>
          <p className="text-lg text-gray-700 mb-8">
            Use our suite of free calculators to estimate tax liabilities, compare financial options, 
            and make informed decisions about your finances.
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : selectedCalculator ? (
            <div>
              <button 
                onClick={() => setSelectedCalculator(null)} 
                className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowRight className="w-4 h-4 mr-1 transform rotate-180" /> Back to all calculators
              </button>
              {renderCalculator()}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {calculators.map((calc) => (
                <div key={calc.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      <Calculator className="w-10 h-10 text-blue-600" />
                      {calc.popularity > 85 && (
                        <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full ml-2">
                          <Star className="w-3 h-3 mr-1 fill-current" /> Popular
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">{calc.title}</h2>
                    <p className="text-gray-700 mb-4 text-center">{calc.description}</p>
                    <div className="flex justify-center">
                      <button 
                        onClick={() => setSelectedCalculator(calc.slug)} 
                        className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        Use Calculator <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
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
