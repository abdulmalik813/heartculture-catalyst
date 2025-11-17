import { Setting } from '@/payload-types'
import { isFontData } from '@/lib/is-font-data'
import { FontData } from '@/types/font-data'
import { unstable_cache } from 'next/cache'

function generateFontFaceRule(fontData: FontData): string {
  const fontPath = fontData.variable
    ? `https://cdn.jsdelivr.net/npm/@fontsource-variable/${fontData.id}@latest/files/${fontData.id}-${fontData.subset}-wght-${fontData.style}.woff2`
    : `https://cdn.jsdelivr.net/npm/@fontsource/${fontData.id}@latest/files/${fontData.id}-${fontData.subset}-${fontData.weight}-${fontData.style}.woff2`

  const fontFamily = fontData.variable ? `'${fontData.family} Variable'` : `'${fontData.family}'`
  
  if (fontData.variable) {
    return `
@font-face {
  font-family: ${fontFamily};
  font-style: ${fontData.style};
  font-display: swap;
  font-weight: 100 900;
  src: url('${fontPath}') format('woff2-variations');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}`.trim()
  } else {
    return `
@font-face {
  font-family: ${fontFamily};
  font-style: ${fontData.style};
  font-display: swap;
  font-weight: ${fontData.weight};
  src: url('${fontPath}') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}`.trim()
  }
}

function generateFontClass(font: any): string | null {
  if (!font.fontData || !isFontData(font.fontData)) {
    return null
  }

  const fontData = font.fontData
  const family = fontData.variable
    ? `'${fontData.family} Variable', sans-serif`
    : `'${fontData.family}', sans-serif`

  return `.font-${font.fontData.id} {
  font-family: ${family};
  font-weight: ${fontData.weight};
  font-style: ${fontData.style || 'normal'};
}`
}

const getCachedInlineFontCSS = unstable_cache(
  async (settingJson: string) => {
    const setting: Setting = JSON.parse(settingJson)
    const fontRules: string[] = []

    if (setting.default?.fontData && isFontData(setting.default.fontData)) {
      fontRules.push(generateFontFaceRule(setting.default.fontData))
    }

    if (setting.additionalFonts && Array.isArray(setting.additionalFonts)) {
      setting.additionalFonts.forEach((font: any) => {
        if (font.fontData && isFontData(font.fontData)) {
          fontRules.push(generateFontFaceRule(font.fontData))
          const fontClass = generateFontClass(font)
          if (fontClass) fontRules.push(fontClass)
        }
      })
    }

    return fontRules.join('\n\n')
  },
  ['inline_font_css'],
  { tags: ['fonts_tag', 'inline_font_css'], revalidate: 3600 }
)

export async function generateInlineFontCSS(setting: Setting): Promise<string> {
  return getCachedInlineFontCSS(JSON.stringify(setting))
}