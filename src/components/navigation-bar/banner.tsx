import { joinStyles } from '@/lib/make-styles'
import { LexicalRenderer } from '@/components/lexical-renderer'
import { NavigationBar } from '@/payload-types'
import { PageContext } from '@/types/page-context'

export async function Banner({
  pageContext,
  ...banner
}: Partial<NavigationBar['banner']> & { pageContext: PageContext }) {
  if (!banner.enableBanner) {
    return null
  }

  return (
    <div className={joinStyles(banner.bannerStyles)}>
      {banner.content && (
        <div className={joinStyles(banner.contentStyles)}>
          <LexicalRenderer content={banner.content} pageContext={pageContext} />
        </div>
      )}
    </div>
  )
}
