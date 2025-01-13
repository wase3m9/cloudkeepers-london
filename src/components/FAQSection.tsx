import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQSectionProps {
  content: string;
}

export function FAQSection({ content }: FAQSectionProps) {
  if (!content) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-center mb-8">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {content.split('###').slice(1).map((qa, index) => {
          const [question, ...answerParts] = qa.split('\n')
          const answer = answerParts.join('\n').trim()
          return (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                {question.trim()}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                {answer}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}