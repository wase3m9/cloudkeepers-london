import ReactMarkdown from 'react-markdown'

interface MainContentProps {
  content: string;
}

export function MainContent({ content }: MainContentProps) {
  return (
    <div className="prose lg:prose-lg">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-4xl font-bold text-[#9b87f5] mb-6">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-semibold text-[#7E69AB] mt-8 mb-4">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-medium text-[#7E69AB] mt-6 mb-3">{children}</h3>,
          ul: ({ children }) => <ul className="space-y-2 my-4">{children}</ul>,
          li: ({ children }) => (
            <li className="flex items-start">
              <span className="text-[#9b87f5] mr-2">✓</span>
              <span>{children}</span>
            </li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}