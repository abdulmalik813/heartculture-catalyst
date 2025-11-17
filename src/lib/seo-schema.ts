import { getCachedGlobal } from '@/lib/get-globals'
import { getServerSideURL } from '@/lib/get-url'
import type {
  Page,
  Media,
  User,
  Social,
  Setting,
  Post,
  Thumbnail,
  Faq,
  Testimonial,
} from '@/payload-types'
import { getMediaUrl } from '@/lib/get-media-url'
import { mediaExtractor } from '@/lib/image-extractor'
import { getCachedDocuments } from '@/lib/get-document'
import { checkBlock } from '@/lib/check-block'

const faqSchema = async (page: Page | Post) => {
  if (!checkBlock(page, 'faqBlock')) return []
  const faqs = (await getCachedDocuments('faqs')()) as Faq[]

  if (!faqs || faqs.length === 0) {
    return []
  }

  return faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  }))
}

const testimonialSchema = async (page: Page | Post, setting: Setting) => {
  if (!checkBlock(page, 'testimonialBlock')) return null
  const testimonials = (await getCachedDocuments('testimonials')()) as Testimonial[]

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  const testimonialsWithRatings = testimonials.filter((t) => t.rating)
  const ratingCount = testimonialsWithRatings.length
  const ratingSum = testimonialsWithRatings.reduce((sum, t) => sum + (t.rating || 0), 0)
  const averageRating = ratingCount > 0 ? ratingSum / ratingCount : null

  const reviews = testimonials.map((testimonial) => {
    const author =
      testimonial.type === 'company'
        ? {
            '@type': 'Organization' as const,
            name: testimonial.company || testimonial.name,
          }
        : {
            '@type': 'Person' as const,
            name: testimonial.name,
            ...(testimonial.position && { jobTitle: testimonial.position }),
            ...(testimonial.company && {
              worksFor: {
                '@type': 'Organization' as const,
                name: testimonial.company,
              },
            }),
          }

    const review: any = {
      '@type': 'Review',
      author,
    }

    if (testimonial.content) {
      review.reviewBody = testimonial.content
    }

    if (testimonial.rating) {
      review.reviewRating = {
        '@type': 'Rating',
        ratingValue: testimonial.rating,
        bestRating: 5,
      }
    }

    return review
  })

  return {
    '@type': 'Organization',
    name: setting.appTitle || '',
    ...(averageRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: ratingCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    review: reviews,
  }
}

export const pageSchema = async (page: Page, setting: Setting) => {
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
    medias.map((media) => mediaSchema(media as Media, setting)),
  ).then((schemas) => schemas.filter(Boolean))

  const isHomePage = page.slug === 'home'
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

  const faqData = await faqSchema(page)
  const testimonialData = await testimonialSchema(page, setting)

  const pageUrl = isHomePage ? getServerSideURL() : `${getServerSideURL()}/${page?.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page?.meta?.title || page?.title || undefined,
    description: page?.meta?.description || undefined,
    url: pageUrl,
    datePublished: publishDate ? new Date(publishDate).toISOString() : undefined,
    dateModified: modifyDate ? new Date(modifyDate).toISOString() : undefined,
    image: await imageSchema(page.meta?.image as Media, setting),
    thumbnailUrl:
      (page.meta?.image as Media)?.url || (setting.fallbackImage as Media)?.url || undefined,
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
      name: setting.appTitle || undefined,
      logo: await imageSchema(setting.logo as Media, setting),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    },
    ...(Array.isArray(faqData) && faqData.length > 0 ? { mainEntity: faqData } : {}),
    ...(testimonialData ? { mentions: testimonialData } : {}),
  }
}

export const blogSchema = async (post: Post, setting: Setting) => {
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
    medias.map((media) => mediaSchema(media as Media, setting)),
  ).then((schemas) => schemas.filter(Boolean))

  const publishDate = post?.publishedAt || post?.createdAt
  const modifyDate = post?.updatedAt

  const faqData = await faqSchema(post)
  const testimonialData = await testimonialSchema(post, setting)

  return {
    '@context': 'https://schema.org',
    '@type': ['BlogPosting', 'Article'],
    headline: post?.meta?.title || post?.title || undefined,
    description: post?.meta?.description || undefined,
    datePublished: publishDate ? new Date(publishDate).toISOString() : undefined,
    dateModified: modifyDate ? new Date(modifyDate).toISOString() : undefined,
    image: await imageSchema(post.meta?.image as Media, setting),
    thumbnailUrl:
      (post.meta?.image as Media)?.url || (setting.fallbackImage as Media)?.url || undefined,
    associatedMedia: associatedMediaSchemas.length > 0 ? associatedMediaSchemas : undefined,
    author: {
      '@type': 'Person',
      name: (post.author as User)?.name || undefined,
      sameAs: socialLinks.length > 0 ? socialLinks : undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: setting.appTitle || undefined,
      logo: await imageSchema(setting.logo as Media, setting),
    },
    url: `${getServerSideURL()}/${setting.postSlug}/${post?.slug}`,
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
          name: setting.postListingPageTitle || 'Blog',
          item: `${getServerSideURL()}/${setting.postSlug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post?.title || undefined,
          item: `${getServerSideURL()}/${setting.postSlug}/${post?.slug}`,
        },
      ],
    },
    ...(Array.isArray(faqData) && faqData.length > 0 ? { mainEntity: faqData } : {}),
    ...(testimonialData ? { mentions: testimonialData } : {}),
  }
}

export const imageSchema = async (image: Media | null | undefined, setting: Setting) => {
  let imageToUse = null
  if (!image || !image.url) {
    imageToUse = setting.fallbackImage as Media
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

export const mediaSchema = async (media: Media | null | undefined, setting: Setting) => {
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
    const videoThumbnail =
      (media.videoThumbnail as Thumbnail) || (setting.fallbackImage as Media) || null
    return {
      ...baseSchema,
      '@type': 'VideoObject',
      thumbnailUrl: videoThumbnail
        ? getMediaUrl(
            videoThumbnail?.thumbnailURL ||
              videoThumbnail?.sizes?.thumbnail?.url ||
              videoThumbnail?.url,
          )
        : undefined,
      thumbnail:
        videoThumbnail.thumbnailURL || videoThumbnail?.sizes?.thumbnail?.url || videoThumbnail?.url
          ? {
              '@type': 'ImageObject',
              contentUrl: getMediaUrl(
                videoThumbnail.thumbnailURL || videoThumbnail?.sizes?.thumbnail?.url || '',
              ),
              width: videoThumbnail?.sizes?.thumbnail?.width || undefined,
              height: videoThumbnail?.sizes?.thumbnail?.height || undefined,
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

export const postListingSchema = async (setting: Setting, social?: Social) => {
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
    name: setting.postListingPageTitle || 'Posts',
    description: setting.postMetaDescription || undefined,
    url: `${getServerSideURL()}/${setting.postSlug}`,
    image: await imageSchema(setting.postMetaImage as Media, setting),
    thumbnailUrl:
      (setting.postMetaImage as Media)?.url || (setting.fallbackImage as Media)?.url || undefined,
    publisher: {
      '@type': 'Organization',
      name: setting.appTitle || undefined,
      logo: await imageSchema(setting.logo as Media, setting),
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
          name: setting.postListingPageTitle || 'Posts',
          item: `${getServerSideURL()}/${setting.postSlug}`,
        },
      ],
    },
  }
}