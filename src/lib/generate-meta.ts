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

const buildContactMetadata = (settings: Setting) => {
  const contactMeta: Record<string, string> = {}

  if (settings.emails && settings.emails.length > 0) {
    contactMeta['contact:email'] = settings.emails.map((e: any) => e.email).join(',')
  }

  if (settings.phones && settings.phones.length > 0) {
    contactMeta['contact:phone_number'] = settings.phones.map((p: any) => p.number).join(',')
  }

  if (settings.locationText) {
    contactMeta['contact:locality'] = settings.locationText
  }

  if (settings.fullAddress) {
    if (settings.fullAddress.addressLocality) {
      contactMeta['contact:locality'] = settings.fullAddress.addressLocality
    }
    if (settings.fullAddress.addressRegion) {
      contactMeta['contact:region'] = settings.fullAddress.addressRegion
    }
    if (settings.fullAddress.postalCode) {
      contactMeta['contact:postal_code'] = settings.fullAddress.postalCode
    }
    if (settings.fullAddress.addressCountry) {
      contactMeta['contact:country_name'] = settings.fullAddress.addressCountry
    }
  }

  return Object.keys(contactMeta).length > 0 ? contactMeta : undefined
}

export const generateMeta = async (
  doc: Partial<Page> | Partial<Post> | null,
  post: boolean,
  settings: Setting,
): Promise<Metadata> => {
  const appData = await getAppSettings()
  const serverUrl = getServerSideURL()
  const title = doc?.meta?.title ? doc?.meta?.title : appData.appTitle
  const description = doc?.meta?.description || appData.appDescription
  const ogImage = await getImageURL(appData, doc?.meta?.image as Media)
  const slug = doc?.slug === 'home' ? '' : doc?.slug
  const url = `${serverUrl}/${post ? settings.postSlug + '/' : ''}${slug}`

  const contactMetadata = buildContactMetadata(settings)

  const metadata: Metadata = {
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
    ...(contactMetadata && { other: contactMetadata }),
  }

  return metadata
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

  const contactMetadata = buildContactMetadata(settings)

  const metadata: Metadata = {
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
    ...(contactMetadata && { other: contactMetadata }),
  }

  return metadata
}