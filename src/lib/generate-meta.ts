import type { Metadata } from 'next'

import type { Media, Page, Config, Post, Setting } from '../payload-types'

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

export const generateMeta = async (args: { doc: Partial<Page> | Partial<Post> | null }): Promise<Metadata> => {
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

export const generatePostsListingMeta  = async (settings: Setting): Promise<Metadata> => {
  const { postMetaTitle, postMetaDescription, postMetaImage, postSlug } = settings
  const appData = await getAppSettings()
  
  const ogImage = await getImageURL(postMetaImage)
  const title = postMetaTitle || appData.appTitle
  const description = postMetaDescription || appData.appTitle
  const slug = postSlug || 'posts'

  return {
    description,
    openGraph: await mergeOpenGraph({
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: `/${slug}`,
    }),
    title,
  }
}