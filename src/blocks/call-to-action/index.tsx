import { CallToActionBlock } from '@/payload-types'
import { SearchParams } from '@/types/search-params'
import { CardBlockUI } from '@/blocks/card'
import { Media } from '@/components/media'
import { joinStyles } from '@/lib/make-styles'
import type { Media as MediaCollection } from '@/payload-types'
import Link from 'next/link'
import { getServerSideURL } from '@/lib/get-url'
import { Button } from '@/components/ui/button'
import { LexicalRenderer } from '@/components/lexical-renderer'

const browserPlayableTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']

export async function CallToActionBlockUI({
  searchParams,
  ...callToActionBlock
}: CallToActionBlock & { searchParams?: SearchParams }) {
  const media = callToActionBlock.media as MediaCollection | undefined
  const isPlayable = media && browserPlayableTypes.includes(media.mimeType || '')

  return (
    <div className="relative min-h-[300px] flex items-center justify-center p-8 md:p-12 lg:p-16">
      {media && (
        <div className={`absolute inset-0 -z-10 overflow-hidden ${joinStyles(callToActionBlock.wrapperStyles)}`}>
          {isPlayable ? (
            <Media
              className="w-full h-full"
              imgClassName={`object-cover w-full h-full ${joinStyles(callToActionBlock.contentStyles)}`}
              videoClassName={`object-cover w-full h-full ${joinStyles(callToActionBlock.contentStyles)}`}
              resource={media}
            />
          ) : (
            <Link href={getServerSideURL() + media.url} className="block w-full h-full">
              <Button className={joinStyles(callToActionBlock.contentStyles)}>
                {media?.caption && <LexicalRenderer content={media.caption} />}
              </Button>
            </Link>
          )}
        </div>
      )}

      <div className="w-full max-w-2xl relative z-10">
        <CardBlockUI {...callToActionBlock.card} searchParams={searchParams} />
      </div>
    </div>
  )
}