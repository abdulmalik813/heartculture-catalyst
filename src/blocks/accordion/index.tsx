import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { AccordionBlock } from '@/payload-types'
import { LexicalRenderer } from '@/components/lexical-renderer'
import { SearchParams } from '@/types/search-params'

export async function AccordionBlockUI({
  searchParams,
  ...accordionBlock
}: AccordionBlock & { searchParams?: SearchParams }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {accordionBlock.items.map((item) => (
        <AccordionItem value={item.title} key={item.id}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>
            <LexicalRenderer content={item.content} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
