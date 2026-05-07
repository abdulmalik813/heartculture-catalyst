import { Setting, Style } from '@/payload-types'
import { getCachedDocuments } from '@/lib/get-document'
import { isFontData } from '@/lib/is-font-data'
import { unstable_cache } from 'next/cache'

function generateFontClass(font: any): string | null {
  if (!font?.id || !font?.family || !font?.fontData || !isFontData(font.fontData)) {
    return null
  }

  const fontData = font.fontData

  const family = fontData.variable
    ? `'${fontData.family} Variable', sans-serif`
    : `'${fontData.family}', sans-serif`

  const weight = fontData.weight
  const style = fontData.style || 'normal'

  return `.font-${font.id} {
  font-family: ${family} !important;
  font-weight: ${weight} !important;
  font-style: ${style} !important;
  font-display: swap;
}`
}

function buildSettingsCSS(setting: Setting): string {
  let css = ''

  const defaultFont = setting.default?.fontData
  if (defaultFont && isFontData(defaultFont) && (defaultFont as any)?.fontCSS) {
    css += (defaultFont as any).fontCSS + '\n\n'
  }

  if (Array.isArray(setting.additionalFonts)) {
    for (const font of setting.additionalFonts) {
      const fontData = font?.fontData
      if (
        fontData &&
        isFontData(fontData) &&
        (fontData as any)?.fontCSS
      ) {
        css += ((fontData as any).fontCSS || '') + '\n\n'
      }
    }
  }

  return css
}

export const getSettingsCSS = unstable_cache(
  async (setting: Setting) => {
    const fontsBaseCSS = buildSettingsCSS(setting)

    const fontClasses =
      setting.additionalFonts
        ?.map(generateFontClass)
        .filter(Boolean)
        .join('\n\n') || ''

    const themeCSS = setting.theme || ''

    return [fontsBaseCSS, fontClasses, themeCSS]
      .filter(Boolean)
      .join('\n\n')
  },
  ['settings-css'],
  {
    tags: ['global-settings'],
  }
)

async function buildStylesheet(setting: Setting, draft: boolean) {
  const styles = (await getCachedDocuments('styles', draft, 10000)()) as Style[]

  const settingsCSS = await getSettingsCSS(setting)

  const stylesCSS = styles
    .map((s) => s.stylesheet || '')
    .filter(Boolean)
    .join('\n\n')

  return [settingsCSS, stylesCSS]
    .filter(Boolean)
    .join('\n\n')
}

export const generateStylesheet = unstable_cache(
  async (setting: Setting, draft: boolean) => {
    return buildStylesheet(setting, draft)
  },
  ['compiled-stylesheet'],
  {
    tags: ['collection-styles', 'global-settings'],
  }
)