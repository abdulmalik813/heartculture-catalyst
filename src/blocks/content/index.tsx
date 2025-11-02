import { LexicalRenderer } from '@/components/lexical-renderer'
import { ContentBlock } from '@/payload-types'
import { SearchParams } from '@/types/search-params'

export async function ContentBlockUI({
  searchParams,
  ...contentBlock
}: ContentBlock & { searchParams?: SearchParams }) {
  return (
    <LexicalRenderer
      content={contentBlock.content}
      contentStyles={contentBlock.contentStyles}
      searchParams={searchParams}
    />
  )
}
