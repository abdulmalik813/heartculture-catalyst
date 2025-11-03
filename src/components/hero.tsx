import { Page } from '@/payload-types'
import { SearchParams } from '@/types/search-params'
import { browserPlayableTypes } from '@/constants/browser-media'
import { CallToActionBlockUI } from '@/blocks/call-to-action'

export async function Hero({
  searchParams,
  hero,
}: {
  searchParams?: SearchParams
  hero: NonNullable<Page['hero']>
}) {

    if (hero.layout === "with-image") {
        return <CallToActionBlockUI {...hero}/>
    }
  return <></>
}
