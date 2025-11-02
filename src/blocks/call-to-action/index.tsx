import { CallToActionBlock } from '@/payload-types'
import { SearchParams } from '@/types/search-params'
import { CardBlockUI } from '@/blocks/card'

export async function CallToActionBlockUI({
  searchParams,
  ...callToActionBlock
}: CallToActionBlock & { searchParams?: SearchParams }) {
  return (
    <div>
      cta goes here 
      <CardBlockUI 
        {...callToActionBlock.card}
        searchParams={searchParams}
      />
    </div>
  )
}