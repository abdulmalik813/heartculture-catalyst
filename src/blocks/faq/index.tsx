import type { FaqBlock } from '@/payload-types'
import { PageContext } from '@/types/page-context'

export async function FaqBlockUI({
  pageContext,
  ...faqBlock
}: FaqBlock & { pageContext: PageContext }) {
  return <></>
}1