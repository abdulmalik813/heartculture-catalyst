import { AnimateWrapper } from '@/components/animate-wrapper'
import { LexicalRenderer } from '@/components/lexical-renderer'
import { joinStyles } from '@/lib/make-styles'
import { ContentBlock } from '@/payload-types'
import { PageContext } from '@/types/page-context'

export async function ContentBlockUI({
  pageContext,
  ...contentBlock
}: ContentBlock & { pageContext: PageContext }) {
  return (
    <AnimateWrapper
      animate={contentBlock.animate}
      className={joinStyles(contentBlock.contentStyles)}
    >
      <LexicalRenderer content={contentBlock.content} pageContext={pageContext} />
    </AnimateWrapper>
  )
}
