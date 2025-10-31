import React from 'react'
import './theme.css'
import { draftMode } from 'next/headers'
import { AdminBar } from '@/components/admin-bar'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { getServerSideURL } from '@/lib/get-url'
import { LivePreviewListener } from '@/components/live-preview-listener'
import { APP_DESCRIPTION, APP_TITLE } from '@/constants/init'

export const metadata = {
  description: APP_DESCRIPTION,
  title: APP_TITLE,
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      {isEnabled && <LivePreviewListener />}
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link href={`${getServerSideURL()}/api/stylesheet`} rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
