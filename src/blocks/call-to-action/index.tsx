import { CallToActionBlock } from '@/payload-types'
import { SearchParams } from '@/types/search-params'
import { CardBlockUI } from '@/blocks/card'
import type { Media as MediaCollection, Page, Post, Setting } from '@/payload-types'
import { MediaBlockUI } from '../media'

export async function CallToActionBlockUI({
  searchParams,
  setting,
  page,
  ...callToActionBlock
}: Partial<CallToActionBlock> & { searchParams: SearchParams } & { setting: Setting | null } & {
  page: Post | Page | null
}) {
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
            searchParams={searchParams}
            setting={setting}
            page={page}
          />
        </div>
      )}

      <div className="w-full max-w-2xl relative z-10">
        <CardBlockUI
          {...callToActionBlock.card}
          searchParams={searchParams}
          setting={setting}
          page={page}
        />
      </div>
    </div>
  )
}
