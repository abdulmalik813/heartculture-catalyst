import type { Faq, FaqBlock } from '@/payload-types'
import { PageContext } from '@/types/page-context'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export async function FaqBlockUI({
  pageContext,
  ...faqBlock
}: FaqBlock & { pageContext: PageContext }) {
  if (!faqBlock || typeof faqBlock != 'object') {
    return null
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqBlock?.faq?.map((faq) => {
        if (typeof faq !== 'object') return null
        return (
          <AccordionItem value={`${faq.id}`} key={faq.id}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}