import { TestimonialBlock, Testimonial } from '@/payload-types'
import { PageContext } from '@/types/page-context'
import { TestimonialBlockClient } from '@/blocks/testimonial/client'

export async function TestimonialBlockUI({
  pageContext,
  ...block
}: Partial<TestimonialBlock> & { pageContext: PageContext }) {
  const testimonials = (block.testimonials || []).filter(
    (item): item is Testimonial => typeof item !== 'number',
  )

  return (
    <TestimonialBlockClient block={block} testimonials={testimonials} pageContext={pageContext} />
  )
}
