import React from 'react'
import './theme.css'
import { draftMode } from 'next/headers'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { getServerSideURL } from '@/lib/get-url'
import { Setting } from '@/payload-types'
import { getCachedGlobal } from '@/lib/get-globals'
import { Metadata } from 'next'
import { getAppSettings } from '@/constants/app'
import { isFontData } from '@/lib/is-font-data'
import { LivePreviewListener } from '@/components/live-preview-listener'

export async function generateMetadata(): Promise<Metadata> {
  const appData = await getAppSettings()

  return {
    description: appData.appDescription,
    title: appData.appTitle,
    icons: {
      icon: [
        ...(appData.favIcon ? [{ url: appData.favIcon, type: 'image/x-icon' as const }] : []),
        ...(appData.favIconPng ? [{ url: appData.favIconPng, type: 'image/png' as const }] : []),
        ...(appData.favIconSvg
          ? [{ url: appData.favIconSvg, type: 'image/svg+xml' as const }]
          : []),
      ],
    },
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const { children } = props

  const setting = (await getCachedGlobal('settings', 1, isEnabled)) as Setting

  const defaultFont = setting?.default
  const fontData =
    defaultFont?.fontData && isFontData(defaultFont.fontData) ? defaultFont.fontData : null

  const defaultFontFamily = fontData?.variable
    ? `'${fontData.family} Variable', sans-serif`
    : fontData?.family
      ? `'${fontData.family}', sans-serif`
      : 'sans-serif'

  const fontWeight = fontData?.weight || 400
  const fontStyle = fontData?.style || 'normal'

  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{
        fontFamily: defaultFontFamily,
        fontWeight: fontWeight,
        fontStyle: fontStyle,
      }}
    >
      {isEnabled && <LivePreviewListener />}
      <head>
        <link href={`${getServerSideURL()}/api/stylesheet`} rel="stylesheet" />
      </head>
      <body className="flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
