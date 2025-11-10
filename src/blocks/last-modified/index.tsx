import { LastModifiedBlock } from '@/payload-types'
import { Card, CardContent } from '@/components/ui/card'
import { joinStyles } from '@/lib/make-styles'
import { TIMEZONES } from '@/constants/init'
import { GlobalData } from '@/types/global-data'

export function LastModifiedBlockUI({
  globalData,
  ...lastModifiedBlock
}: Partial<LastModifiedBlock> & { globalData: GlobalData }) {
  if (!globalData.page) {
    return <></>
  }

  const { updatedAt } = globalData.page
  const timeZone = TIMEZONES.DEFAULT_TIMEZONE

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timeZone,
  }).format(new Date(updatedAt))

  return (
    <Card className={joinStyles(lastModifiedBlock.cardStyles)}>
      <CardContent className={joinStyles(lastModifiedBlock.cardContentStyles)}>
        Last modified on {formattedDate}
        {globalData.page.author && typeof globalData.page.author === 'object' && globalData.page.author?.name && (
          <> by {globalData.page.author.name}</>
        )}
      </CardContent>
    </Card>
  )
}
