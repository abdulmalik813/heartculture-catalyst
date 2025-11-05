import React from 'react'
import './theme.css'
import { draftMode } from 'next/headers'
import { AdminBar } from '@/components/admin-bar'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { getServerSideURL } from '@/lib/get-url'
import { LivePreviewListener } from '@/components/live-preview-listener'
import { Setting } from '@/payload-types'
import { getCachedGlobal } from '@/lib/get-globals'
import { Metadata } from 'next'
import { getAppSettings } from '@/constants/app'
import { NavigationBarUI } from '@/components/navigation-bar'

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

  const settings = (await getCachedGlobal('settings', 1, isEnabled)) as Setting

  const defaultFontFamily = settings?.default?.family || 'sans-serif'

  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ fontFamily: `'${defaultFontFamily}', sans-serif` }}
    >
      {isEnabled && <LivePreviewListener />}
      <head>
        <link href={`${getServerSideURL()}/api/stylesheet`} rel="stylesheet" />
      </head>
      <body className="flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <NavigationBarUI />
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
