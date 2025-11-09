import { Page, Post, LastModifiedBlock, Setting } from '@/payload-types'
import { SearchParams } from '@/types/search-params'
import { AnimateWrapper } from '@/components/animate-wrapper'
import { Card, CardContent } from '@/components/ui/card'
import { joinStyles } from '@/lib/make-styles'

export function LastModifiedBlockUI({
  searchParams,
  setting,
  page,
  ...lastModifiedBlock
}: Partial<LastModifiedBlock> & { searchParams: SearchParams } & { className?: string } & {
  setting: Setting | null
} & { page: Post | Page | null }) {
  if (!page) {
    return <></>
  }

  const { updatedAt } = page

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(updatedAt))

  return (
    <Card className={joinStyles(lastModifiedBlock.cardStyles)}>
      <CardContent className={joinStyles(lastModifiedBlock.cardContentStyles)}>
        Last modified on {formattedDate}
        {page.author && typeof page.author === 'object' && page.author?.name && (
          <> by {page.author.name}</>
        )}
      </CardContent>
    </Card>
  )
}
