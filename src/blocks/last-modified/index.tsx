import { Page, Post, LastModifiedBlock, Setting } from '@/payload-types'
import { SearchParams } from '@/types/search-params'

export function LastModifiedBlockUI({
  searchParams,
  setting,
  page,
  ...lastModifiedBlock
}: Partial<LastModifiedBlock> & { searchParams?: SearchParams } & { className?: string } & {
  setting: Setting | null
} & { page: Post | Page | null }) {
  if (!page) {
    return null
  }

  const { updatedAt } = page

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(updatedAt))

  return (
    <div className="text-right">
      <p className="text-sm text-muted-foreground">
        Last modified on {formattedDate}
        {page.author && typeof page.author === 'object' && page.author?.name && <> by {page.author.name}</>}
      </p>
    </div>
  )
}
