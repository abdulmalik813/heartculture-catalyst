import React from 'react'
import './theme.css'
import { draftMode } from 'next/headers'
import { AdminBar } from '@/components/admin-bar'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { getServerSideURL } from '@/lib/get-url'
import { LivePreviewListener } from '@/components/live-preview-listener'
import { Font, Setting } from '@/payload-types'
import { getCachedGlobal } from '@/lib/get-globals'
import { Metadata } from 'next'
import { getAppSettings } from '@/constants/app'
import { Header } from '@/components/header'

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

  const defaultFont =
    settings.defaultFont && typeof settings.defaultFont === 'object'
      ? (settings.defaultFont as Font).name || 'Inter'
      : 'Inter'

  return (
    <html lang="en" suppressHydrationWarning style={{ fontFamily: `'${defaultFont}', sans-serif` }}>
      {isEnabled && <LivePreviewListener />}
      <head>
        <link href={`${getServerSideURL()}/api/stylesheet`} rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <main>
            <Header />
            {children}
            </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
