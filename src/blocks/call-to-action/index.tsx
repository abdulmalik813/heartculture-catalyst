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
    <div className="relative min-h-[300px] flex items-center justify-center p-8 md:p-12 lg:p-16">
      {media && media.url && (
        <div className={`absolute inset-0 -z-10 overflow-hidden`}>
          {/* @ts-expect-error there may be some mismatch between the expected types here */}
          <MediaBlockUI
            {...callToActionBlock}
            className="w-full h-full object-cover"
            pageContext={pageContext}
          />
        </div>
      )}

      <div className="w-full max-w-2xl relative z-10">
        <CardBlockUI {...callToActionBlock.card} pageContext={pageContext} />
      </div>
    </div>
  )
}
