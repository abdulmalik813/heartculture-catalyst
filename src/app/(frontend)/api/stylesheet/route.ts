import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
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

const getCachedFontCSS = unstable_cache(
  async (fontsJson: string) => {
    const fonts: FontData[] = JSON.parse(fontsJson)
    if (fonts.length === 0) return ''
    
    const fontImports = fonts.map(font => {
      const baseUrl = `https://cdn.jsdelivr.net/npm/@fontsource/${font.id}@latest`
      if (font.variable) {
        return `@import url('${baseUrl}/${font.subset}-variable.css');`
      } else {
        return `@import url('${baseUrl}/${font.subset}-${font.weight}.css');`
      }
    }).join('\n')
    
    return fontImports
  },
  ['fontsource-css'],
  {
    tags: ['fonts-tag'],
    revalidate: 60 * 60 * 24 * 7,
  }
)

async function fetchFontsourceFonts(fonts: FontData[]) {
  if (fonts.length === 0) return ''
  
  const fontImports = fonts.map(font => {
    const baseUrl = `https://cdn.jsdelivr.net/npm/@fontsource/${font.id}@latest`
    if (font.variable) {
      return `@import url('${baseUrl}/${font.subset}-variable.css');`
    } else {
      return `@import url('${baseUrl}/${font.subset}-${font.weight}.css');`
    }
  }).join('\n')
  
  return fontImports
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

export async function GET(req: NextRequest) {
  const { isEnabled: draft } = await draftMode()

  let styles
  let settings
  let fontsourceCSS

  if (draft) {
    styles = await getCachedDocuments("styles", true)() as Style[]
    settings = await getCachedGlobal('settings', 1, true) as Setting
    
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

    fontsourceCSS = await fetchFontsourceFonts(fonts)
  } else {
    settings = await getCachedGlobal('settings', 1) as Setting
    styles = await getCachedDocuments("styles")() as Style[]
    
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

    fontsourceCSS = await getCachedFontCSS(JSON.stringify(fonts))
  }

  const fontClasses: string[] = []

  if (settings.additionalFonts && Array.isArray(settings.additionalFonts)) {
    settings.additionalFonts.forEach((font: any) => {
      if (font.id && font.family && font.fontData && isFontData(font.fontData)) {
        const fontData = font.fontData
        const fontFamilyValue = `'${fontData.family}', sans-serif`
        const fontWeight = fontData.variable ? 400 : fontData.weight
        const fontStyle = fontData.style || 'normal'
        
        fontClasses.push(
          `.font-${font.id} {\n  font-family: ${fontFamilyValue} !important;\n  font-weight: ${fontWeight} !important;\n  font-style: ${fontStyle} !important;\n}`
        )
      }
    })
  }

  const fontCSS = fontClasses.length > 0 ? `${fontClasses.join('\n\n')}\n\n` : ''

  const combinedCSS = styles
    .map((style) => style.stylesheet || '')
    .filter((css) => css.trim() !== '')
    .join('\n\n')

  return new NextResponse(
    fontsourceCSS + '\n\n' + fontCSS + settings.theme + '\n\n' + combinedCSS,
    {
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': 'no-store',
      },
    }
  )
}