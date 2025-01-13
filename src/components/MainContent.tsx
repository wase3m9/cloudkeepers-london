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

const PricingCard = ({ title, price, description, features }: { title: string, price: string, description: string, features: string[] }) => (
  <Card className="flex flex-col p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-[#E5DEFF]">
    <h3 className="text-xl font-bold mb-4 text-[#1B4332]">{title}</h3>
    <div className="mb-6">
      <p className="text-3xl font-bold text-[#0EA5E9]">{price}</p>
      <p className="text-gray-600 text-sm mt-2 leading-relaxed">{description}</p>
    </div>
    <ul className="space-y-4 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start space-x-3">
          <span className="text-[#0EA5E9] flex-shrink-0 mt-1">•</span>
          <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
        </li>
      ))}
    </ul>
    <Button 
      className="mt-8 w-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold py-6 transition-colors"
    >
      Get Started
    </Button>
  </Card>
)

const PricingSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
    <PricingCard
      title="Sole Trader Package"
      price="From £99/month"
      description="Perfect for sole traders at any stage, combining essential compliance and strategic financial planning."
      features={[
        "Bookkeeping",
        "Self-assessment filing",
        "Expense tracking tool",
        "WhatsApp support",
        "Tax planning",
        "FREE Allowable Expense Guide PDF"
      ]}
    />
    <PricingCard
      title="Limited Company Package"
      price="From £150/month"
      description="Ideal for limited companies focused on growth and compliance with strategic insights."
      features={[
        "Bookkeeping",
        "Payroll processing",
        "Statutory accounts",
        "Corporation tax filing",
        "VAT returns",
        "WhatsApp support",
        "Quarterly advisory sessions",
        "FREE Allowable Expense Guide PDF"
      ]}
    />
    <PricingCard
      title="SME Package"
      price="From £250/month"
      description="Designed for established businesses managing multiple operations and requiring advanced financial strategies."
      features={[
        "Full compliance services (Statutory accounts, VAT, payroll)",
        "Advanced tax planning",
        "Budgeting and forecasting",
        "Monthly management accounts",
        "WhatsApp support",
        "Monthly strategy review calls",
        "FREE Allowable Expense Guide PDF"
      ]}
    />
  </div>
)

export function MainContent({ content }: MainContentProps) {
  const scrollToForm = () => {
    const formElement = document.querySelector('#lead-form')
    formElement?.scrollIntoView({ behavior: 'smooth' })
  }

  const [beforeCore] = content.split('## Our Core')

  return (
    <div className="prose lg:prose-lg max-w-none">
      <div className="bg-[#FFF8E7] rounded-none p-8 md:p-12 lg:p-16 mb-16">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1B4332] mb-6 leading-tight">
                  {children}
                </h1>
                <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-8">
                  Transform your business with our professional accounting services tailored specifically for your needs.
                </p>
                <Button 
                  onClick={scrollToForm}
                  className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-8 py-6 rounded-md text-lg transition-colors"
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
          }}
        >
          {beforeCore}
        </ReactMarkdown>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16">
        <h2 className="text-3xl font-bold mb-12 text-[#1B4332] text-center">Our Core Services</h2>
        <CoreServices />

        <h2 className="text-3xl font-bold mb-12 text-[#1B4332] text-center mt-20">Our Packages</h2>
        <PricingSection />
      </div>
    </div>
  )
}
