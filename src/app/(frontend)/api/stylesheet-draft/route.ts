import { NextResponse } from 'next/server'
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

export async function GET() {
  const setting = (await getCachedGlobal('settings', 1, true)) as Setting
  const styles = (await getCachedDocuments('styles', true, 10000)()) as Style[]

  const fontClasses =
    setting.additionalFonts?.map(generateFontClass).filter(Boolean).join('\n\n') || ''

  const stylesCSS = styles
    .map((s) => s.stylesheet || '')
    .filter((css) => css.trim())
    .join('\n\n')

  const css = [fontClasses, setting.theme, stylesCSS].filter(Boolean).join('\n\n')

  return new NextResponse(css, {
    headers: {
      'Content-Type': 'text/css',
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })
}