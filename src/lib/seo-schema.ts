import { getCachedGlobal } from '@/lib/get-globals'
import { getServerSideURL } from '@/lib/get-url'
import type { Page, Media, User, Social, Setting, Post } from '@/payload-types'
import { getMediaUrl } from '@/lib/get-media-url'
import { mediaExtractor } from '@/lib/image-extractor'

export const pageSchema = async (page: Page, settings: Setting) => {
  const social = (await getCachedGlobal('social')) as Social
  const medias = mediaExtractor(page)

  const socialLinks = [
    social.facebook,
    social.instagram,
    social.linkedin,
    social.x,
    social.youtube,
    social.tiktok,
  ].filter((link) => link)

  const associatedMediaSchemas = await Promise.all(
    medias.map((media) => mediaSchema(media as Media)),
  ).then((schemas) => schemas.filter(Boolean))

  const slugParts = page?.slug?.split('/').filter(Boolean) || []
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: getServerSideURL(),
    },
  ]

  let currentPath = ''
  slugParts.forEach((part, index) => {
    currentPath += `/${part}`
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: index + 2,
      name: part
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      item: `${getServerSideURL()}${currentPath}`,
    })
  })

  const publishDate = page?.publishedAt || page?.createdAt
  const modifyDate = page?.updatedAt

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page?.meta?.title || page?.title || undefined,
    description: page?.meta?.description || undefined,
    url: `${getServerSideURL()}/${page?.slug}`,
    datePublished: publishDate ? new Date(publishDate).toISOString() : undefined,
    dateModified: modifyDate ? new Date(modifyDate).toISOString() : undefined,
    image: await imageSchema(page.meta?.image as Media, settings),
    thumbnailUrl:
      (page.meta?.image as Media)?.url || (settings.fallbackImage as Media)?.url || undefined,
    associatedMedia: associatedMediaSchemas.length > 0 ? associatedMediaSchemas : undefined,
    author: page?.author
      ? {
          '@type': 'Person',
          name: (page.author as User)?.name || undefined,
          sameAs: socialLinks.length > 0 ? socialLinks : undefined,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: settings.appTitle || undefined,
      logo: await imageSchema(settings.logo as Media, settings),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    },
  }
}

export const blogSchema = async (post: Post, settings: Setting) => {
  const social = (await getCachedGlobal('social')) as Social
  const medias = mediaExtractor(post)

  const socialLinks = [
    social.facebook,
    social.instagram,
    social.linkedin,
    social.x,
    social.youtube,
    social.tiktok,
  ].filter((link) => link)

  const associatedMediaSchemas = await Promise.all(
    medias.map((media) => mediaSchema(media as Media)),
  ).then((schemas) => schemas.filter(Boolean))

  const publishDate = post?.publishedAt || post?.createdAt
  const modifyDate = post?.updatedAt

  return {
    '@context': 'https://schema.org',
    '@type': ['BlogPosting', 'Article'],
    headline: post?.meta?.title || post?.title || undefined,
    description: post?.meta?.description || undefined,
    datePublished: publishDate ? new Date(publishDate).toISOString() : undefined,
    dateModified: modifyDate ? new Date(modifyDate).toISOString() : undefined,
    image: await imageSchema(post.meta?.image as Media, settings),
    thumbnailUrl:
      (post.meta?.image as Media)?.url || (settings.fallbackImage as Media)?.url || undefined,
    associatedMedia: associatedMediaSchemas.length > 0 ? associatedMediaSchemas : undefined,
    author: {
      '@type': 'Person',
      name: (post.author as User)?.name || undefined,
      sameAs: socialLinks.length > 0 ? socialLinks : undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: settings.appTitle || undefined,
      logo: await imageSchema(settings.logo as Media, settings),
    },
    url: `${getServerSideURL()}/${settings.postSlug}/${post?.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: getServerSideURL(),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: settings.postListingPageTitle || 'Blog',
          item: `${getServerSideURL()}/${settings.postSlug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post?.title || undefined,
          item: `${getServerSideURL()}/${settings.postSlug}/${post?.slug}`,
        },
      ],
    },
  }
}

export const imageSchema = async (image: Media | null | undefined, settings: Setting) => {
  let imageToUse = null
  if (!image || !image.url) {
    imageToUse = settings.logo as Media
  } else {
    imageToUse = image
  }

  if (!imageToUse || !imageToUse.url) {
    return undefined
  }

  const uploadDate = imageToUse?.createdAt

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: getMediaUrl(imageToUse.url),
    url: getMediaUrl(imageToUse.url),
    name: imageToUse?.alt || imageToUse?.filename || undefined,
    description: imageToUse?.caption || undefined,
    width: imageToUse?.width || undefined,
    height: imageToUse?.height || undefined,
    thumbnail: imageToUse?.sizes?.thumbnail?.url
      ? {
          '@type': 'ImageObject',
          contentUrl: getMediaUrl(imageToUse.sizes.thumbnail.url),
          width: imageToUse.sizes.thumbnail.width || undefined,
          height: imageToUse.sizes.thumbnail.height || undefined,
        }
      : undefined,
    creditText: image?.creditText || undefined,
    creator: image?.creator || undefined,
    license: image?.license || undefined,
    copyrightNotice: image?.copyrightNotice || undefined,
    acquireLicensePage: image?.acquireLicensePage || undefined,
    uploadDate: uploadDate ? new Date(uploadDate).toISOString() : undefined,
    encodingFormat: imageToUse?.mimeType || undefined,
  }
}

export const mediaSchema = async (media: Media | null | undefined) => {
  if (!media || !media.url) {
    return null
  }

  const isVideo = media.mimeType?.startsWith('video/')
  const isImage = media.mimeType?.startsWith('image/')
  const isAudio = media.mimeType?.startsWith('audio/')

  const uploadDate = media?.createdAt

  const baseSchema = {
    '@context': 'https://schema.org',
    contentUrl: getMediaUrl(media.url),
    url: getMediaUrl(media.url),
    name: media.alt || media.filename || undefined,
    description: media.caption || undefined,
    encodingFormat: media.mimeType || undefined,
    contentSize: media.filesize ? `${media.filesize}` : undefined,
    width: media.width || undefined,
    height: media.height || undefined,
    uploadDate: uploadDate ? new Date(uploadDate).toISOString() : undefined,
    creditText: media.creditText || undefined,
    creator: media.creator || undefined,
    license: media.license || undefined,
    copyrightNotice: media.copyrightNotice || undefined,
    acquireLicensePage: media.acquireLicensePage || undefined,
  }

  if (isVideo) {
    return {
      ...baseSchema,
      '@type': 'VideoObject',
      thumbnailUrl: media.thumbnailURL
        ? getMediaUrl(media.thumbnailURL)
        : media.sizes?.thumbnail?.url
          ? getMediaUrl(media.sizes.thumbnail.url)
          : undefined,
      thumbnail:
        media.thumbnailURL || media.sizes?.thumbnail?.url
          ? {
              '@type': 'ImageObject',
              contentUrl: getMediaUrl(media.thumbnailURL || media.sizes?.thumbnail?.url || ''),
              width: media.sizes?.thumbnail?.width || undefined,
              height: media.sizes?.thumbnail?.height || undefined,
            }
          : undefined,
    }
  }

  if (isAudio) {
    return {
      ...baseSchema,
      '@type': 'AudioObject',
    }
  }

  if (isImage) {
    return {
      ...baseSchema,
      '@type': 'ImageObject',
      thumbnail: media.sizes?.thumbnail?.url
        ? {
            '@type': 'ImageObject',
            contentUrl: getMediaUrl(media.sizes.thumbnail.url),
            width: media.sizes.thumbnail.width || undefined,
            height: media.sizes.thumbnail.height || undefined,
          }
        : undefined,
      thumbnailUrl: media.sizes?.thumbnail?.url
        ? getMediaUrl(media.sizes.thumbnail.url)
        : undefined,
    }
  }

  return {
    ...baseSchema,
    '@type': 'MediaObject',
  }
}

export const postListingSchema = async (settings: Setting, social?: Social) => {
  const socialData = social || ((await getCachedGlobal('social')) as Social)

  const socialLinks = [
    socialData.facebook,
    socialData.instagram,
    socialData.linkedin,
    socialData.x,
    socialData.youtube,
    socialData.tiktok,
  ].filter((link) => link)

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: settings.postListingPageTitle || 'Posts',
    description: settings.postMetaDescription || undefined,
    url: `${getServerSideURL()}/${settings.postSlug}`,
    image: await imageSchema(settings.postMetaImage as Media, settings),
    thumbnailUrl:
      (settings.postMetaImage as Media)?.url || (settings.fallbackImage as Media)?.url || undefined,
    publisher: {
      '@type': 'Organization',
      name: settings.appTitle || undefined,
      logo: await imageSchema(settings.logo as Media, settings),
      sameAs: socialLinks.length > 0 ? socialLinks : undefined,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: getServerSideURL(),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: settings.postListingPageTitle || 'Blog',
          item: `${getServerSideURL()}/${settings.postSlug}`,
        },
      ],
    },
  }
}
