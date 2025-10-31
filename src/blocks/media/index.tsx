import { MediaBlock as MediaBlockProps } from '@/payload-types'
import { Media } from '@/components/media'
import { joinStyles } from '@/lib/make-styles'
import type { Media as MediaCollection } from '@/payload-types'
import Link from 'next/link'
import { getServerSideURL } from '@/lib/get-url'
import { Button } from '@/components/ui/button'
import { LexicalRenderer } from '@/components/lexical-renderer'

const browserPlayableTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']

export function MediaBlock({ ...mediaBlock }: MediaBlockProps) {
  if (!mediaBlock.media) return null

  const media: MediaCollection = mediaBlock.media as MediaCollection
  const isPlayable = browserPlayableTypes.includes(media.mimeType || '')

  if (isPlayable)
    return (
      <Media
        className={joinStyles(mediaBlock.wrapperStyles)}
        imgClassName={joinStyles(mediaBlock.contentStyles)}
        videoClassName={joinStyles(mediaBlock.contentStyles)}
        resource={media}
      />
    )

  return <div className={joinStyles(mediaBlock.wrapperStyles)}>

    <Link href={getServerSideURL() + media.url}>
        <Button className={ joinStyles(mediaBlock.contentStyles) }>
            {media?.caption && <LexicalRenderer content={media.caption} />}
        </Button>
    </Link>
  </div>
}