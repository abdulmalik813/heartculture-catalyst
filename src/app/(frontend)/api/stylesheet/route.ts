import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { getCachedGlobal } from '@/lib/get-globals'
import { Setting, Style } from '@/payload-types'
import { getCachedDocuments } from '@/lib/get-document'
import { isFontData } from '@/lib/is-font-data'

function generateFontClass(font: any): string | null {
  if (!font.id || !font.family || !font.fontData || !isFontData(font.fontData)) {
    return null
  }

  const fontData = font.fontData
  const family = fontData.variable
    ? `'${fontData.family} Variable', sans-serif`
    : `'${fontData.family}', sans-serif`

  return `.font-${font.id} {
  font-family: ${family};
  font-weight: ${fontData.weight};
  font-style: ${fontData.style || 'normal'};
}`
}

const getCachedStylesheet = unstable_cache(
  async (settingJson: string, stylesJson: string) => {
    const setting: Setting = JSON.parse(settingJson)
    const styles: Style[] = JSON.parse(stylesJson)

    const fontClasses =
      setting.additionalFonts?.map(generateFontClass).filter(Boolean).join('\n\n') || ''

    const stylesCSS = styles
      .map((s) => s.stylesheet || '')
      .filter((css) => css.trim())
      .join('\n\n')

    return [fontClasses, setting.theme, stylesCSS].filter(Boolean).join('\n\n')
  },
  ['stylesheet_published'],
  { tags: ['stylesheet_published', 'fonts_tag'], revalidate: 3600 }
)

export async function GET() {
  const setting = (await getCachedGlobal('settings', 1, false)) as Setting
  const styles = (await getCachedDocuments('styles', false, 10000)()) as Style[]

  const css = await getCachedStylesheet(JSON.stringify(setting), JSON.stringify(styles))

  return new NextResponse(css, {
    headers: {
      'Content-Type': 'text/css',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}