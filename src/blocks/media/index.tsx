import { MediaBlock } from '@/payload-types'
import { Media } from '@/components/media'
import { joinStyles } from '@/lib/make-styles'
import type { Media as MediaCollection, Page, Post, Setting } from '@/payload-types'
import Link from 'next/link'
import { getServerSideURL } from '@/lib/get-url'
import { Button } from '@/components/ui/button'
import { LexicalRenderer } from '@/components/lexical-renderer'
import { SearchParams } from '@/types/search-params'
import { browserPlayableTypes } from '@/constants/browser-media'

export function MediaBlockUI({
  searchParams,
  className,
  setting,
  page,
  ...mediaBlock
}: Partial<MediaBlock> & { searchParams?: SearchParams } & { className?: string } & {
  setting: Setting | null
} & { page: Post | Page | null }) {
  if (!mediaBlock.media) return null

  const media: MediaCollection = mediaBlock.media as MediaCollection
  const isPlayable = browserPlayableTypes.includes(media.mimeType || '')

  if (isPlayable)
    return (
      <Media
        className={joinStyles(mediaBlock.wrapperStyles)}
        imgClassName={joinStyles(className, mediaBlock.contentStyles)}
        videoClassName={joinStyles(mediaBlock.contentStyles)}
        resource={media}
      />
    )

  return (
    <div className={joinStyles(mediaBlock.wrapperStyles)}>
      <Link href={getServerSideURL() + media.url}>
        <Button className={joinStyles(className, mediaBlock.contentStyles)}>
          {media?.caption && (
            <LexicalRenderer
              content={media.caption}
              searchParams={searchParams}
              setting={setting}
              page={page}
            />
          )}
        </Button>
      </Link>
    </div>
  )
}
