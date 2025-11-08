import { joinStyles } from '@/lib/make-styles'
import { AnimateWrapper } from '@/components/animate-wrapper'
import { LexicalRenderer } from '@/components/lexical-renderer'
import { NavigationBar } from '@/payload-types'

export async function Banner({ ...banner }: Partial<NavigationBar['banner']>) {
  if (!banner.enableBanner) {
    return null
  }

  return (
    <div className={joinStyles(banner.bannerStyles)}>
      {banner.content && (
        <div className={joinStyles(banner.contentStyles)}>
          <LexicalRenderer content={banner.content} />
        </div>
      )}
    </div>
  )
}
