
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  // Extract headings from content
  const headings = content.match(/<h[1-6].*?>(.*?)<\/h[1-6]>/g)?.map(heading => {
    const level = parseInt(heading.match(/<h([1-6])/)?.[1] || "1");
    const text = heading.replace(/<[^>]*>/g, '');
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return { level, text, id };
  }) || [];

  return (
    <div className={cn("my-8 p-6 bg-gray-50 rounded-lg", className)}>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Table of Contents</h2>
      <Separator className="my-4" />
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="toc">
          <AccordionTrigger className="text-lg font-semibold">Quick Navigation</AccordionTrigger>
          <AccordionContent>
            <nav className="space-y-2">
              {headings.map((heading, index) => (
                <a
                  key={index}
                  href={`#${heading.id}`}
                  className={cn(
                    "block text-gray-600 hover:text-primary transition-colors",
                    heading.level === 1 && "font-semibold",
                    heading.level === 2 && "ml-4",
                    heading.level === 3 && "ml-8"
                  )}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
