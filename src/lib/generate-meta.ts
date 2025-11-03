import type { Metadata } from 'next'

import type { Media, Page, Config } from '../payload-types'

import { mergeOpenGraph } from './merge-open-graph'
import { getServerSideURL } from './get-url'
import { getAppSettings } from '@/constants/app'

const getImageURL = async (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()
  const appData = await getAppSettings()
  let url = appData.fallbackImage

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: { doc: Partial<Page> | null }): Promise<Metadata> => {
  const { doc } = args

  const ogImage = await getImageURL(doc?.meta?.image)
  const appData = await getAppSettings()

  const title = doc?.meta?.title ? doc?.meta?.title : appData.appTitle

  return {
    description: doc?.meta?.description,
    openGraph: await mergeOpenGraph({
      description: doc?.meta?.description || appData.appTitle,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}