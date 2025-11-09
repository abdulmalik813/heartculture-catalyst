import { joinStyles } from '@/lib/make-styles'
import { LexicalRenderer } from '@/components/lexical-renderer'
import { NavigationBar, Setting } from '@/payload-types'

export async function Banner({ setting, ...banner }: Partial<NavigationBar['banner']>& { setting: Setting }) {
  if (!banner.enableBanner) {
    return null
  }

  return (
    <div className={joinStyles(banner.bannerStyles)}>
      {banner.content && (
        <div className={joinStyles(banner.contentStyles)}>
          <LexicalRenderer content={banner.content} searchParams={null} setting={setting} page={null} />
        </div>
      )}
    </div>
  )
}
