import { FileText, Calculator, Receipt, ChartBar } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Card } from './ui/card'
import { Button } from './ui/button'

interface MainContentProps {
  content: string
}

const ServiceCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-[#F1F0FB]">
    <div className="mb-4">
      <Icon className="w-8 h-8 text-[#9b87f5]" />
    </div>
    <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
)

const CoreServices = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
    <ServiceCard
      icon={Calculator}
      title="Monthly Bookkeeping and Accounting"
      description="Comprehensive financial record-keeping and reporting services tailored to your business needs, ensuring accuracy and compliance."
    />
    <ServiceCard
      icon={FileText}
      title="Tax Planning and Compliance"
      description="Strategic tax planning and timely compliance services to optimize your tax position and meet all regulatory requirements."
    />
    <ServiceCard
      icon={Receipt}
      title="Financial Reporting"
      description="Detailed financial reports and analysis to help you make informed business decisions and track your company's performance."
    />
    <ServiceCard
      icon={ChartBar}
      title="Business Advisory"
      description="Expert guidance and strategic advice to help your business grow, improve efficiency, and achieve its financial goals."
    />
  </div>
)

const PricingCard = ({ title, price, features }: { title: string, price: string, features: string[] }) => (
  <Card className="flex flex-col p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
    <h3 className="text-xl font-bold mb-4 text-[#0EA5E9]">{title}</h3>
    <p className="text-2xl font-bold mb-6 text-gray-900">{price}</p>
    <ul className="space-y-3 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start space-x-2">
          <span className="text-[#0EA5E9] flex-shrink-0">✓</span>
          <span className="text-gray-600 text-sm">{feature}</span>
        </li>
      ))}
    </ul>
    <button className="mt-6 w-full bg-[#0EA5E9] text-white py-3 px-4 rounded-md hover:bg-[#0284c7] transition-colors">
      Get Started
    </button>
  </Card>
)

const PricingSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
    <PricingCard
      title="Sole Trader Package"
      price="From £75/month"
      features={[
        "Bookkeeping",
        "Self-assessment filing",
        "Basic support",
        "Annual returns",
        "FREE Allowable Expense Guide"
      ]}
    />
    <PricingCard
      title="Growth Package"
      price="From £125/month"
      features={[
        "Full bookkeeping",
        "Tax planning",
        "Priority support",
        "Quarterly reviews",
        "Cash flow forecasting"
      ]}
    />
    <PricingCard
      title="Enterprise Package"
      price="From £250/month"
      features={[
        "Complete financial management",
        "Strategic planning",
        "24/7 support",
        "Monthly reviews",
        "Custom reporting"
      ]}
    />
  </div>
)

export function MainContent({ content }: MainContentProps) {
  const scrollToForm = () => {
    const formElement = document.querySelector('#lead-form')
    formElement?.scrollIntoView({ behavior: 'smooth' })
  }

  const [beforeCore, afterCore] = content.split('## Our Core');
  const [_, afterCoreServices] = afterCore?.split('## Pricing') ?? ['', ''];

  return (
    <div className="prose lg:prose-lg max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0EA5E9] mb-6 leading-tight">
                {children}
              </h1>
              <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-8">
                Transform your business with our professional accounting services tailored specifically for your needs.
              </p>
              <Button 
                onClick={scrollToForm}
                className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white px-8 py-3 rounded-md text-lg transition-colors"
              >
                Get Started Today
              </Button>
            </div>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold text-[#0EA5E9] mt-16 mb-8 text-center">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-medium text-[#0EA5E9] mt-10 mb-6">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-600 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-4 my-8 max-w-2xl mx-auto">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
              <span className="text-[#0EA5E9] mt-1 flex-shrink-0">•</span>
              <span className="text-gray-600">{children}</span>
            </li>
          ),
        }}
      >
        {beforeCore}
      </ReactMarkdown>

      <h2 className="text-3xl font-bold mb-12 text-[#0EA5E9] text-center">Our Core Services</h2>
      <CoreServices />

      <h2 className="text-3xl font-bold mb-12 text-[#0EA5E9] text-center">Our Packages</h2>
      <PricingSection />

      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold text-[#0EA5E9] mt-16 mb-8 text-center">
              {children}
            </h2>
          ),
          p: ({ children }) => (
            <p className="text-gray-600 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
              {children}
            </p>
          ),
        }}
      >
        {afterCoreServices}
      </ReactMarkdown>
    </div>
  )
}
