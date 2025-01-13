import { FileText, Calculator, Receipt, ChartBar } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

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

export function MainContent({ content }: MainContentProps) {
  // Split the content at the Core Services section
  const [beforeCore, afterCore] = content.split('## Our Core');
  const [_, afterCoreServices] = afterCore?.split('## Pricing') ?? ['', ''];

  return (
    <div className="prose lg:prose-lg">
      <ReactMarkdown>{beforeCore}</ReactMarkdown>
      <h2 className="text-3xl font-bold mb-6">Our Core Services</h2>
      <CoreServices />
      <ReactMarkdown>{afterCoreServices}</ReactMarkdown>
    </div>
  )
}