import { ImageCarouselBlock } from '@/payload-types'
import { PageContext } from '@/types/page-context'

export async function ImageCarouselBlockUI({
  pageContext,
  ...imageCarouselBlock
}: Partial<ImageCarouselBlock> & { pageContext: PageContext }) {
  return <></>
}
