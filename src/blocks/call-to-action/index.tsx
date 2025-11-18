import { CallToActionBlock } from '@/payload-types'
import { CardBlockUI } from '@/blocks/card'
import type { Media as MediaCollection } from '@/payload-types'
import { MediaBlockUI } from '@/blocks/media'
import { PageContext } from '@/types/page-context'

export async function CallToActionBlockUI({
  pageContext,
  ...callToActionBlock
}: Partial<CallToActionBlock> & { pageContext: PageContext }) {
  if (!callToActionBlock.card) return null

  const media = callToActionBlock.media as MediaCollection | undefined

  return (
    <div className="overflow-hidden">
      <div className="relative w-screen min-h-[300px] flex items-center justify-center -mx-[50vw] left-1/2 right-1/2 py-16 sm:py-24">
        {media && media.url && (
          <div className={`absolute inset-0 w-full h-full select-none`}>
            {/* @ts-expect-error there may be some mismatch between the expected types here */}
            <MediaBlockUI
              {...callToActionBlock}
              className="w-full h-full object-cover select-none pointer-events-none"
              pageContext={pageContext}
              priority
            />
          </div>
        )}

        <div className="relative z-20 p-4 max-w-4xl mx-auto w-full">
          <CardBlockUI {...callToActionBlock.card} pageContext={pageContext} />
        </div>
      </div>{' '}
    </div>
  )
}
