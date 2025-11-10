import type { Metadata } from 'next'
import type { Media, Page, Post, Setting } from '@/payload-types'
import { mergeOpenGraph } from '@/lib/merge-open-graph'
import { getServerSideURL } from '@/lib/get-url'
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
  const serverUrl = getServerSideURL()
  const title = doc?.meta?.title ? doc?.meta?.title : appData.appTitle
  const description = doc?.meta?.description || appData.appDescription
  const ogImage = await getImageURL(appData, doc?.meta?.image as Media)
  const slug = doc?.slug === "home" ? "" : doc?.slug
  const url = `${serverUrl}/${post ? settings.postSlug + '/' : ''}${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: await mergeOpenGraph({
      title,
      description,
      url,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
    }),
  }
}

export const generatePostsListingMeta = async (settings: Setting): Promise<Metadata> => {
  const { postMetaTitle, postMetaDescription, postMetaImage, postSlug } = settings
  const appData = await getAppSettings()
  const serverUrl = getServerSideURL()
  const ogImage = await getImageURL(appData, postMetaImage as Media)
  const title = postMetaTitle || appData.appTitle
  const description = postMetaDescription || appData.appDescription
  const slug = postSlug || 'posts'
  const url = `${serverUrl}/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: await mergeOpenGraph({
      title,
      description,
      url,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
    }),
  }
}