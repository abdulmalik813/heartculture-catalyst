import type { Metadata } from 'next'
import { getServerSideURL } from './get-url'
import { getAppSettings } from '@/constants/app'

export const mergeOpenGraph = async (og?: Metadata['openGraph']): Promise<Metadata['openGraph']> => {
  const appData = await getAppSettings()
  const serverUrl = getServerSideURL()

  const defaultOpenGraph: Metadata['openGraph'] = {
    type: 'website',
    description: appData.appDescription,
    images: [
      {
        url: serverUrl + appData.fallbackImage,
      },
    ],
    siteName: appData.appTitle,
    title: appData.appTitle,
  }

  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}