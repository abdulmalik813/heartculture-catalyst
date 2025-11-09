import type { Metadata } from 'next'

import type { Media, Page, Post, Setting } from '../payload-types'

import { mergeOpenGraph } from './merge-open-graph'
import { getServerSideURL } from './get-url'
import { getAppSettings } from '@/constants/app'

const getImageURL = async (appData: any, image?: Media) => {
  const serverUrl = getServerSideURL()
  let url = appData.fallbackImage

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (doc: Partial<Page> | Partial<Post> | null, post: boolean, settings: Setting): Promise<Metadata> => {
  const appData = await getAppSettings()
  const title = doc?.meta?.title ? doc?.meta?.title : appData.appTitle
  const ogImage = await getImageURL(appData, doc?.meta?.image as Media)
  return {
    description: doc?.meta?.description,
    alternates: {
      canonical: `${getServerSideURL}/${post ? settings.postSlug + '/' : ''}${doc?.slug === "home" ? "" : doc?.slug}`,
    },
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
      url: `${getServerSideURL}/${post ? settings.postSlug + '/' : ''}${doc?.slug}`,
    }),
    title,
  }
}

export const generatePostsListingMeta  = async (settings: Setting): Promise<Metadata> => {
  const { postMetaTitle, postMetaDescription, postMetaImage, postSlug } = settings
  const appData = await getAppSettings()
  const ogImage = await getImageURL(appData, postMetaImage as Media)
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
      url: `${getServerSideURL}/${slug}`,
    }),
    title,
  }
}