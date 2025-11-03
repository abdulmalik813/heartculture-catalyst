import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { getCachedGlobal } from '@/lib/get-globals'
import { Font } from '@/payload-types'

const getCachedStyles = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'styles',
      limit: 100000,
    })
    return result.docs
  },
  ['styles-cache'],
  {
    tags: ['styles-tag'],
    revalidate: false,
  },
)

const getCachedFontCSS = unstable_cache(
  async (fonts: string[]) => {
    if (fonts.length === 0) return ''
    
    const fontFamilies = fonts.map(font => `family=${font.replace(/ /g, '+')}`).join('&')
    const googleFontUrl = `https://fonts.googleapis.com/css2?${fontFamilies}&display=swap`
    
    try {
      const response = await fetch(googleFontUrl)
      return await response.text()
    } catch (error) {
      console.error('Failed to fetch Google Fonts:', error)
      return ''
    }
  },
  ['google-fonts-css'],
  {
    tags: ['fonts-tag'],
    revalidate: 60 * 60 * 24 * 7,
  }
)

async function fetchGoogleFonts(fonts: string[]) {
  if (fonts.length === 0) return ''
  
  const fontFamilies = fonts.map(font => `family=${font.replace(/ /g, '+')}`).join('&')
  const googleFontUrl = `https://fonts.googleapis.com/css2?${fontFamilies}&display=swap`
  
  try {
    const response = await fetch(googleFontUrl, { cache: 'no-store' })
    return await response.text()
  } catch (error) {
    console.error('Failed to fetch Google Fonts:', error)
    return ''
  }
}

export async function GET(req: NextRequest) {
  const { isEnabled: draft } = await draftMode()

  let styles
  let settings
  let googleFontsCSS

  if (draft) {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'styles',
      limit: 100000,
      overrideAccess: true,
    })
    styles = result.docs
    settings = await getCachedGlobal('settings', 1, true)
    
    const fonts = new Set<string>()

    if (settings.defaultFont && typeof settings.defaultFont === 'object') {
      const fontName = (settings.defaultFont as Font).name
      if (fontName) fonts.add(fontName)
    }

    if (settings.fontPrimary && typeof settings.fontPrimary === 'object') {
      const fontName = (settings.fontPrimary as Font).name
      if (fontName) fonts.add(fontName)
    }

    if (settings.fontSecondary && typeof settings.fontSecondary === 'object') {
      const fontName = (settings.fontSecondary as Font).name
      if (fontName) fonts.add(fontName)
    }

    if (settings.fontAccent && typeof settings.fontAccent === 'object') {
      const fontName = (settings.fontAccent as Font).name
      if (fontName) fonts.add(fontName)
    }

    googleFontsCSS = await fetchGoogleFonts(Array.from(fonts))
  } else {
    settings = await getCachedGlobal('settings', 1)
    styles = await getCachedStyles()
    
    const fonts = new Set<string>()

    if (settings.defaultFont && typeof settings.defaultFont === 'object') {
      const fontName = (settings.defaultFont as Font).name
      if (fontName) fonts.add(fontName)
    }

    if (settings.fontPrimary && typeof settings.fontPrimary === 'object') {
      const fontName = (settings.fontPrimary as Font).name
      if (fontName) fonts.add(fontName)
    }

    if (settings.fontSecondary && typeof settings.fontSecondary === 'object') {
      const fontName = (settings.fontSecondary as Font).name
      if (fontName) fonts.add(fontName)
    }

    if (settings.fontAccent && typeof settings.fontAccent === 'object') {
      const fontName = (settings.fontAccent as Font).name
      if (fontName) fonts.add(fontName)
    }

    googleFontsCSS = await getCachedFontCSS(Array.from(fonts))
  }

  const fontClasses: string[] = []

  if (settings.fontPrimary && typeof settings.fontPrimary === 'object') {
    const fontName = (settings.fontPrimary as Font).name ?? 'Inter'
    fontClasses.push(`.font-primary {\n  font-family: "${fontName}", sans-serif !important;\n}`)
  }

  if (settings.fontSecondary && typeof settings.fontSecondary === 'object') {
    const fontName = (settings.fontSecondary as Font).name ?? 'Inter'
    fontClasses.push(`.font-secondary {\n  font-family: "${fontName}", sans-serif !important;\n}`)
  }

  if (settings.fontAccent && typeof settings.fontAccent === 'object') {
    const fontName = (settings.fontAccent as Font).name ?? 'Inter'
    fontClasses.push(`.font-accent {\n  font-family: "${fontName}", sans-serif !important;\n}`)
  }

  const fontCSS = fontClasses.length > 0 ? `${fontClasses.join('\n\n')}\n\n` : ''

  const combinedCSS = styles
    .map((style) => style.stylesheet || '')
    .filter((css) => css.trim() !== '')
    .join('\n\n')

  return new NextResponse(
    googleFontsCSS + '\n\n' + fontCSS + settings.theme + '\n\n' + combinedCSS,
    {
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': draft ? 'no-store' : 'public, max-age=604800, immutable',
      },
    }
  )
}