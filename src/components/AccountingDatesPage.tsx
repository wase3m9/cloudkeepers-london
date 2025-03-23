
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Header } from './Header'
import { Footer } from './Footer'
import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface TaxDate {
  id: string
  month: string
  day: string
  title: string
  description: string
  businessType?: string[]
}

export function AccountingDatesPage() {
  const [niches, setNiches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [businessType, setBusinessType] = useState<string>("limited-companies")
  const [yearEnd, setYearEnd] = useState<Date | undefined>(new Date("2024-01-31"))
  const [firstVatPeriodEnd, setFirstVatPeriodEnd] = useState<Date | undefined>(new Date("2025-01-31"))
  const [vatReturns, setVatReturns] = useState<boolean>(true)
  const [vatPeriod, setVatPeriod] = useState<string>("quarterly")
  const [employStaff, setEmployStaff] = useState<boolean>(true)
  const [monthlyPayDay, setMonthlyPayDay] = useState<string>("31")
  const [selectedYear, setSelectedYear] = useState<string>("2025")
  const [selectedMonth, setSelectedMonth] = useState<string>("January")
  const [taxDates, setTaxDates] = useState<TaxDate[]>([])

  useEffect(() => {
    const fetchNiches = async () => {
      const { data } = await supabase.from('niches').select('*')
      if (data) setNiches(data)
    }

    const fetchData = async () => {
      setLoading(true)
      
      // In a real implementation, this would fetch tax dates from a database
      // For now, adding sample tax dates
      const dummyDates: TaxDate[] = [
        {
          id: '1',
          month: 'January',
          day: '19',
          title: 'Employer Payment Summary',
          description: 'Send an Employer Payment Summary (EPS) by the 19th to tell HMRC about any statutory payments or the apprenticeship levy that you\'re reclaiming for the previous tax month.',
          businessType: ['limited-companies', 'partnerships', 'sole-traders']
        },
        {
          id: '2',
          month: 'January',
          day: '22',
          title: 'Pay monthly payroll taxes for previous month.',
          description: 'Pay monthly payroll taxes for previous month.',
          businessType: ['limited-companies', 'partnerships']
        },
        {
          id: '3',
          month: 'January',
          day: '31',
          title: 'Financial year ends',
          description: 'The end of your business\'s financial year.',
          businessType: ['limited-companies']
        },
        {
          id: '4',
          month: 'January',
          day: '31',
          title: 'Full Payment Submission (FPS)',
          description: 'Make a Full Payment Submission (FPS) on or before each payday to tell HMRC about any payments and deductions you make to employees.',
          businessType: ['limited-companies', 'partnerships']
        },
        {
          id: '5',
          month: 'February',
          day: '19',
          title: 'Employer Payment Summary',
          description: 'Send an Employer Payment Summary (EPS) by the 19th to tell HMRC about any statutory payments or the apprenticeship levy that you\'re reclaiming for the previous tax month.',
          businessType: ['limited-companies', 'partnerships', 'sole-traders']
        },
        {
          id: '6',
          month: 'February',
          day: '22',
          title: 'Pay monthly payroll taxes for previous month.',
          description: 'Pay monthly payroll taxes for previous month.',
          businessType: ['limited-companies', 'partnerships']
        },
        {
          id: '7',
          month: 'February',
          day: '28',
          title: 'Full Payment Submission (FPS)',
          description: 'Make a Full Payment Submission (FPS) on or before each payday to tell HMRC about any payments and deductions you make to employees.',
          businessType: ['limited-companies', 'partnerships']
        },
        {
          id: '8',
          month: 'May',
          day: '7',
          title: 'VAT submission deadline - first quarter',
          description: 'Make your VAT submission within one month and seven days of the end of the VAT period your return relates to. Your VAT payment deadline might vary depending on the payment method you use - check your VAT account for confirmation.',
          businessType: ['limited-companies', 'partnerships', 'sole-traders']
        },
        {
          id: '9',
          month: 'May',
          day: '31',
          title: 'Issue P60s',
          description: 'Provide each employee with a copy of their P60. This document shows how much tax they paid on their salary in the previous tax year (6th April 2024 to 5th April 2025).',
          businessType: ['limited-companies', 'partnerships']
        },
        {
          id: '10',
          month: 'July',
          day: '6',
          title: 'Submit P11D forms',
          description: 'Submit a P11D form to report benefits in kind received in 2024/25 (6th April 2024 - 5th April 2025) if you have not already provided this information through your payroll software.',
          businessType: ['limited-companies', 'partnerships']
        }
      ];
      
      setTaxDates(dummyDates);
      setLoading(false);
    }

    fetchNiches();
    fetchData();
  }, []);

  // Filter tax dates based on selected month and business type
  const filteredDates = taxDates.filter(date => 
    date.month === selectedMonth && 
    (!date.businessType || date.businessType.includes(businessType))
  );

  const months = ['January', 'February', 'May', 'July', 'August', 'November'];

  return (
    <>
      <Helmet>
        <title>Key Accounting and Tax Year Dates | Cloudkeepers</title>
        <meta name="description" content="Stay on top of important accounting and tax deadlines with our interactive tax year calendar. Track VAT, payroll, and other key financial dates." />
        <meta name="keywords" content="tax year dates, accounting deadlines, VAT deadlines, payroll deadlines, UK tax calendar, HMRC due dates" />
        <meta property="og:title" content="Key Accounting and Tax Year Dates | Cloudkeepers" />
        <meta property="og:description" content="Stay on top of important accounting and tax deadlines with our interactive tax year calendar. Track VAT, payroll, and other key financial dates." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cloudkeepers.co.uk/accounting-dates" />
        <link rel="canonical" href="https://cloudkeepers.co.uk/accounting-dates" />
      </Helmet>

      <Header niches={niches} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Key Accounting and Tax Year Dates</h1>
          <p className="text-gray-700">
            Use our interactive calendar to stay on top of the key tax year dates which affect your business.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-8">
          {/* Business Type Selection */}
          <div className="flex justify-center mb-8">
            <ToggleGroup type="single" value={businessType} onValueChange={(value) => value && setBusinessType(value)}>
              <ToggleGroupItem value="limited-companies" className={`rounded-full px-6 py-2 ${businessType === 'limited-companies' ? 'bg-pink-500 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                Limited Companies
              </ToggleGroupItem>
              <ToggleGroupItem value="sole-traders" className={`rounded-full px-6 py-2 ${businessType === 'sole-traders' ? 'bg-pink-500 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                Sole Traders
              </ToggleGroupItem>
              <ToggleGroupItem value="partnerships" className={`rounded-full px-6 py-2 ${businessType === 'partnerships' ? 'bg-pink-500 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                Partnerships
              </ToggleGroupItem>
              <ToggleGroupItem value="llps" className={`rounded-full px-6 py-2 ${businessType === 'llps' ? 'bg-pink-500 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                LLPs
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Interactive Form */}
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto mb-8">
            <div className="col-span-1 text-right pt-2 text-gray-600">
              Year end
            </div>
            <div className="col-span-2">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
                  >
                    {yearEnd ? format(yearEnd, "dd/MM/yyyy") : "Select date"}
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={yearEnd}
                    onSelect={setYearEnd}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="col-span-1 text-right pt-2 text-gray-600">
              VAT returns?
            </div>
            <div className="col-span-2">
              <div className="flex items-center h-10">
                <Checkbox 
                  id="vat-returns" 
                  checked={vatReturns} 
                  onCheckedChange={(checked) => setVatReturns(checked as boolean)}
                  className="border-gray-300"
                />
              </div>
            </div>

            <div className="col-span-1 text-right pt-2 text-gray-600">
              VAT periods
            </div>
            <div className="col-span-2">
              <Select value={vatPeriod} onValueChange={setVatPeriod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 text-right text-gray-600 flex items-center justify-end">
              <span className="text-right">End date of <span className="text-blue-600">your first<br />VAT period</span></span>
            </div>
            <div className="col-span-2">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none"
                  >
                    {firstVatPeriodEnd ? format(firstVatPeriodEnd, "dd/MM/yyyy") : "Select date"}
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={firstVatPeriodEnd}
                    onSelect={setFirstVatPeriodEnd}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="col-span-1 text-right pt-2 text-gray-600">
              Employ staff?
            </div>
            <div className="col-span-2">
              <div className="flex items-center h-10">
                <Checkbox 
                  id="employ-staff" 
                  checked={employStaff} 
                  onCheckedChange={(checked) => setEmployStaff(checked as boolean)}
                  className="border-gray-300"
                />
              </div>
            </div>

            <div className="col-span-1 text-right pt-2 text-gray-600">
              Monthly pay day
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                value={monthlyPayDay}
                onChange={(e) => setMonthlyPayDay(e.target.value)}
                className="border-gray-300"
              />
            </div>
          </div>

          <hr className="mb-8" />

          {/* Year Toggle */}
          <div className="flex justify-center mb-6">
            <ToggleGroup type="single" value={selectedYear} onValueChange={(value) => value && setSelectedYear(value)}>
              <ToggleGroupItem value="2025" className={`rounded-full px-6 py-2 ${selectedYear === '2025' ? 'bg-pink-500 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                2025
              </ToggleGroupItem>
              <ToggleGroupItem value="2026" className={`rounded-full px-6 py-2 ${selectedYear === '2026' ? 'bg-pink-500 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                2026
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Month Icons */}
          <div className="flex justify-center space-x-4 mb-8">
            {months.map((month) => (
              <button 
                key={month}
                onClick={() => setSelectedMonth(month)} 
                className={`flex flex-col items-center p-2 rounded transition-colors ${selectedMonth === month ? 'text-pink-500' : 'text-gray-400'}`}
              >
                <div className={`border ${selectedMonth === month ? 'border-pink-500' : 'border-gray-300'} rounded p-2 mb-2`}>
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <span className="text-xs">{month}</span>
              </button>
            ))}
          </div>

          {/* Tax Dates Display */}
          <div className="space-y-4">
            {filteredDates.map((date) => (
              <div key={date.id} className="flex">
                <div className="flex-shrink-0 w-[120px] bg-pink-500 text-white p-4 flex flex-col items-center justify-center">
                  <div className="text-sm">{selectedMonth}</div>
                  <div className="text-2xl font-bold">{date.day}th</div>
                  <div className="text-sm">{selectedYear}</div>
                </div>
                <div className="flex-grow bg-white border border-gray-100 p-6">
                  <h3 className="text-blue-600 font-medium mb-2">{date.title}</h3>
                  <p className="text-gray-700">{date.description}</p>
                </div>
              </div>
            ))}

            {filteredDates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No tax dates for the selected month and business type.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
