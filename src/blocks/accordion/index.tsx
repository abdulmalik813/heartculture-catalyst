import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { AccordionBlock, Page, Post, Setting } from '@/payload-types'
import { LexicalRenderer } from '@/components/lexical-renderer'
import { SearchParams } from '@/types/search-params'
import { joinStyles } from '@/lib/make-styles'

export async function AccordionBlockUI({
  searchParams,
  setting,
  page,
  ...accordionBlock
}: AccordionBlock & { searchParams: SearchParams } & { setting: Setting | null } & {
  page: Post | Page | null
}) {
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
            <LexicalRenderer
              content={item.content}
              searchParams={searchParams}
              setting={setting}
              page={page}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
