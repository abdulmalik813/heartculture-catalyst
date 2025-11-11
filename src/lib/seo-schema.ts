import { getCachedGlobal } from '@/lib/get-globals'
import { getServerSideURL } from '@/lib/get-url'
import type { Page, Media, User, Social, Setting, Post, Category } from '@/payload-types'
import { getMediaUrl } from '@/lib/get-media-url'
import { mediaExtractor } from '@/lib/image-extractor'

const calculateWordCount = (content: any): number => {
  if (!content?.root?.children) return 0
  
  const extractText = (node: any): string => {
    if (!node) return ''
    if (node.text) return node.text
    if (node.children) {
      return node.children.map(extractText).join(' ')
    }
    return ''
  }
  
  const text = content.root.children.map(extractText).join(' ')
  return text.split(/\s+/).filter(Boolean).length
}

const extractPlainText = (content: any, maxLength: number = 500): string => {
  if (!content?.root?.children) return ''
  
  const extractText = (node: any): string => {
    if (!node) return ''
    if (node.text) return node.text
    if (node.children) {
      return node.children.map(extractText).join(' ')
    }
    return ''
  }
  
  const text = content.root.children.map(extractText).join(' ')
  return text.substring(0, maxLength).trim()
}

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

  const isHomePage = !page?.slug || page.slug === 'home' || page.slug === ''
  const slugParts = isHomePage ? [] : page.slug.split('/').filter(Boolean)

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: getServerSideURL(),
    },
  ]

  if (!isHomePage) {
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
  }

  const publishDate = page?.publishedAt || page?.createdAt
  const modifyDate = page?.updatedAt

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page?.meta?.title || page?.title || undefined,
    description: page?.meta?.description || undefined,
    url: `${getServerSideURL()}/${page?.slug}`,
    inLanguage: 'en-US',
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
          url: `${getServerSideURL()}/author/${(page.author as User)?.id}`,
          sameAs: socialLinks.length > 0 ? socialLinks : undefined,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: settings.appTitle || undefined,
      url: getServerSideURL(),
      logo: await imageSchema(settings.logo as Media, settings),
      sameAs: socialLinks.length > 0 ? socialLinks : undefined,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.page-title', '.page-content', '.hero-title', '.hero-description'],
    },
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${getServerSideURL()}/${page?.slug}`,
      },
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

  let wordCount = 0
  let articleBody = ''
  
  if (post?.layout) {
    for (const section of post.layout) {
      if (section.grid) {
        for (const gridItem of section.grid) {
          if (gridItem.blocks) {
            for (const block of gridItem.blocks) {
              if (block.blockType === 'contentBlock' && block.content) {
                wordCount += calculateWordCount(block.content)
                if (!articleBody) {
                  articleBody = extractPlainText(block.content)
                }
              }
            }
          }
        }
      }
    }
  }

  const keywords = post?.categories
    ?.map((cat) => (typeof cat === 'object' ? cat.name : ''))
    .filter(Boolean)
    .join(', ')

  const articleSection = post?.categories?.[0]
    ? typeof post.categories[0] === 'object'
      ? post.categories[0].name
      : undefined
    : undefined

  return {
    '@context': 'https://schema.org',
    '@type': ['BlogPosting', 'Article'],
    headline: post?.meta?.title || post?.title || undefined,
    description: post?.meta?.description || undefined,
    inLanguage: 'en-US',
    datePublished: publishDate ? new Date(publishDate).toISOString() : undefined,
    dateModified: modifyDate ? new Date(modifyDate).toISOString() : undefined,
    image: await imageSchema(post.meta?.image as Media, settings),
    thumbnailUrl:
      (post.meta?.image as Media)?.url || (settings.fallbackImage as Media)?.url || undefined,
    associatedMedia: associatedMediaSchemas.length > 0 ? associatedMediaSchemas : undefined,
    wordCount: wordCount > 0 ? wordCount : undefined,
    articleBody: articleBody || undefined,
    articleSection: articleSection,
    keywords: keywords || undefined,
    author: {
      '@type': 'Person',
      name: (post.author as User)?.name || undefined,
      url: `${getServerSideURL()}/author/${(post.author as User)?.id}`,
      sameAs: socialLinks.length > 0 ? socialLinks : undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: settings.appTitle || undefined,
      url: getServerSideURL(),
      logo: await imageSchema(settings.logo as Media, settings),
      sameAs: socialLinks.length > 0 ? socialLinks : undefined,
    },
    url: `${getServerSideURL()}/${settings.postSlug}/${post?.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${getServerSideURL()}/${settings.postSlug}/${post?.slug}`,
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
        {
          '@type': 'ListItem',
          position: 3,
          name: post?.title || undefined,
          item: `${getServerSideURL()}/${settings.postSlug}/${post?.slug}`,
        },
      ],
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.article-headline', '.article-content', '.hero-title'],
    },
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${getServerSideURL()}/${settings.postSlug}/${post?.slug}`,
      },
    },
  }
}

export const imageSchema = async (image: Media | null | undefined, settings: Setting) => {
  let imageToUse = null
  if (!image || !image.url) {
    imageToUse = settings.fallbackImage as Media
  } else {
    imageToUse = image
  }

  if (!imageToUse || !imageToUse.url) {
    return undefined
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: getMediaUrl(imageToUse.url),
    url: getMediaUrl(imageToUse.url),
    name: imageToUse?.alt || imageToUse?.filename || undefined,
    alternateName: imageToUse?.filename || undefined,
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
    creditText: imageToUse?.creditText || undefined,
    creator: imageToUse?.creator
      ? {
          '@type': 'Person',
          name: imageToUse.creator,
        }
      : undefined,
    license: imageToUse?.license || undefined,
    copyrightNotice: imageToUse?.copyrightNotice || undefined,
    acquireLicensePage: imageToUse?.acquireLicensePage || undefined,
    uploadDate: imageToUse?.createdAt ? new Date(imageToUse?.createdAt).toISOString() : undefined,
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
    alternateName: media.filename || undefined,
    description: media.caption || undefined,
    encodingFormat: media.mimeType || undefined,
    contentSize: media.filesize ? `${media.filesize}` : undefined,
    width: media.width || undefined,
    height: media.height || undefined,
    uploadDate: uploadDate ? new Date(uploadDate).toISOString() : undefined,
    creditText: media.creditText || undefined,
    creator: media?.creator
      ? {
          '@type': 'Person',
          name: media.creator,
        }
      : undefined,
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
    inLanguage: 'en-US',
    image: await imageSchema(settings.postMetaImage as Media, settings),
    thumbnailUrl:
      (settings.postMetaImage as Media)?.url || (settings.fallbackImage as Media)?.url || undefined,
    publisher: {
      '@type': 'Organization',
      name: settings.appTitle || undefined,
      url: getServerSideURL(),
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
          name: settings.postListingPageTitle || 'Posts',
          item: `${getServerSideURL()}/${settings.postSlug}`,
        },
      ],
    },
  }
}

export const websiteSchema = async (settings: Setting) => {
  const social = (await getCachedGlobal('social')) as Social
  
  const socialLinks = [
    social.facebook,
    social.instagram,
    social.linkedin,
    social.x,
    social.youtube,
    social.tiktok,
  ].filter((link) => link)

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.appTitle || undefined,
    description: settings.appDescription || undefined,
    url: getServerSideURL(),
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      name: settings.appTitle || undefined,
      url: getServerSideURL(),
      logo: await imageSchema(settings.logo as Media, settings),
      sameAs: socialLinks.length > 0 ? socialLinks : undefined,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${getServerSideURL()}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export const organizationSchema = async (settings: Setting) => {
  const social = (await getCachedGlobal('social')) as Social
  
  const socialLinks = [
    social.facebook,
    social.instagram,
    social.linkedin,
    social.x,
    social.youtube,
    social.tiktok,
  ].filter((link) => link)

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.appTitle || undefined,
    description: settings.appDescription || undefined,
    url: getServerSideURL(),
    logo: await imageSchema(settings.logo as Media, settings),
    sameAs: socialLinks.length > 0 ? socialLinks : undefined,
  }
}