import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { AccordionBlock } from '@/payload-types'
import { LexicalRenderer } from '@/components/lexical-renderer'
import { SearchParams } from '@/types/search-params'
import { joinStyles } from '@/lib/make-styles'

export async function AccordionBlockUI({
  searchParams,
  ...accordionBlock
}: AccordionBlock & { searchParams?: SearchParams }) {
  return (
    <Accordion type="single" collapsible className={joinStyles(accordionBlock.accordionStyles)}>
      {accordionBlock.items.map((item) => (
        <AccordionItem
          value={item.trigger}
          key={item.id}
          className={joinStyles(accordionBlock.accordionItemStyles)}
        >
          <AccordionTrigger className={joinStyles(item.triggerStyles)}>
            {item.trigger}
          </AccordionTrigger>
          <AccordionContent className={joinStyles(item.contentStyles)}>
            <LexicalRenderer content={item.content} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
