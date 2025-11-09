import { NextRequest, NextResponse } from 'next/server'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { getCachedGlobal } from '@/lib/get-globals'
import { Setting, Style } from '@/payload-types'
import { getCachedDocuments } from '@/lib/get-document'

interface FontData {
  id: string
  family: string
  category: string
  variable: boolean
  weight: number
  style: string
  subset: string
}

function isFontData(data: unknown): data is FontData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'family' in data &&
    'category' in data &&
    'variable' in data &&
    'weight' in data &&
    'style' in data &&
    'subset' in data
  )
}

function generateFontImport(font: FontData): string {
  if (font.variable) {
    return `@import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/${font.id}@latest/files/${font.subset}-wght.css');`
  }
  return `@import url('https://cdn.jsdelivr.net/npm/@fontsource/${font.id}@latest/files/${font.subset}-${font.weight}.css');`
}

function generateFontClass(font: any): string | null {
  if (!font.id || !font.family || !font.fontData || !isFontData(font.fontData)) {
    return null
  }
  
  const fontData = font.fontData
  const family = `'${fontData.family}', sans-serif`
  const weight = fontData.variable ? 400 : fontData.weight
  const style = fontData.style || 'normal'
  
  return `.font-${font.id} {\n  font-family: ${family} !important;\n  font-weight: ${weight} !important;\n  font-style: ${style} !important;\n}`
}

function collectFonts(settings: Setting): FontData[] {
  const fonts: FontData[] = []
  
  if (settings.default?.fontData && isFontData(settings.default.fontData)) {
    fonts.push(settings.default.fontData)
  }
  
  if (settings.additionalFonts && Array.isArray(settings.additionalFonts)) {
    settings.additionalFonts.forEach((font: any) => {
      if (font.fontData && isFontData(font.fontData)) {
        fonts.push(font.fontData)
      }
    })
  }
  
  return fonts
}

const getCachedFontCSS = unstable_cache(
  async (fontsJson: string) => {
    const fonts: FontData[] = JSON.parse(fontsJson)
    return fonts.map(generateFontImport).join('\n')
  },
  ['fontsource-css'],
  { tags: ['fonts-tag'], revalidate: 60 * 60 * 24 * 7 }
)

export async function GET(req: NextRequest) {
  const { isEnabled: draft } = await draftMode()
  
  const settings = await getCachedGlobal('settings', 1, draft) as Setting
  const styles = await getCachedDocuments("styles", draft)() as Style[]
  
  const fonts = collectFonts(settings)
  
  const fontsourceCSS = draft 
    ? fonts.map(generateFontImport).join('\n')
    : await getCachedFontCSS(JSON.stringify(fonts))
  
  const fontClasses = settings.additionalFonts
    ?.map(generateFontClass)
    .filter(Boolean)
    .join('\n\n') || ''
  
  const stylesCSS = styles
    .map(s => s.stylesheet || '')
    .filter(css => css.trim())
    .join('\n\n')
  
  const css = [fontsourceCSS, fontClasses, settings.theme, stylesCSS]
    .filter(Boolean)
    .join('\n\n')
  
  return new NextResponse(css, {
    headers: {
      'Content-Type': 'text/css',
      'Cache-Control': 'no-store',
    },
  })
}