import { AnimateWrapper } from '@/components/animate-wrapper'
import { LexicalRenderer } from '@/components/lexical-renderer'
import { joinStyles } from '@/lib/make-styles'
import { ContentBlock } from '@/payload-types'
import { GlobalData } from '@/types/global-data'

export async function ContentBlockUI({
  globalData,
  ...contentBlock
}: ContentBlock & { globalData: GlobalData }) {
  return (
    <AnimateWrapper animate={contentBlock.animate} className={joinStyles(contentBlock.contentStyles)}>
      <LexicalRenderer
        content={contentBlock.content}
        globalData={globalData}
      />
    </AnimateWrapper>
  )
}
