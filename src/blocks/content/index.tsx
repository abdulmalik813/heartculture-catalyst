import { LexicalRenderer } from '@/components/lexical-renderer'
import { ContentBlock, Page, Post, Setting } from '@/payload-types'
import { SearchParams } from '@/types/search-params'

export async function ContentBlockUI({
  searchParams,
  setting,
  page,
  ...contentBlock
}: ContentBlock & { searchParams?: SearchParams } & { setting: Setting | null } & {
  page: Post | Page | null
}) {
  return (
    <LexicalRenderer
      content={contentBlock.content}
      contentStyles={contentBlock.contentStyles}
      searchParams={searchParams}
      setting={setting}
      page={page}
    />
  )
}
