import { getCachedGlobal } from '@/lib/get-globals'
import { getServerSideURL } from '@/lib/get-url'
import type { Page, Media, User, Social, Setting, Post, Thumbnail, Faq, Testimonial } from '@/payload-types'
import { getMediaUrl } from '@/lib/get-media-url'
import { mediaExtractor } from '@/lib/image-extractor'
import { getCachedDocuments } from '@/lib/get-document'

const hasFaqsInContent = (content: Page | Post): boolean => {
  const checkNode = (node: any): boolean => {
    if (!node) return false
    
    if (node.blockType === 'faqBlock') {
      return true
    }
    
    if (node.type === 'block' && node.fields?.blockType === 'faqBlock') {
      return true
    }
    
    if (node.children && Array.isArray(node.children)) {
      return node.children.some((child: any) => checkNode(child))
    }
    
    if (node.root?.children && Array.isArray(node.root.children)) {
      return node.root.children.some((child: any) => checkNode(child))
    }
    
    if (node.fields) {
      return checkNode(node.fields)
    }
    
    return false
  }
  
  if (content.layout && Array.isArray(content.layout)) {
    if (content.layout.some((block: any) => checkNode(block))) {
      return true
    }
  }
  
  const lexicalFields = ['richText', 'content', 'body', 'description']
  for (const field of lexicalFields) {
    const fieldValue = (content as any)[field]
    if (fieldValue) {
      if (checkNode(fieldValue)) {
        return true
      }
    }
  }
  
  return false
}

const hasTestimonialsInContent = (content: Page | Post): boolean => {
  const checkNode = (node: any): boolean => {
    if (!node) return false
    
    if (node.blockType === 'testimonialBlock') {
      return true
    }
    
    if (node.type === 'block' && node.fields?.blockType === 'testimonialBlock') {
      return true
    }
    
    if (node.children && Array.isArray(node.children)) {
      return node.children.some((child: any) => checkNode(child))
    }
    
    if (node.root?.children && Array.isArray(node.root.children)) {
      return node.root.children.some((child: any) => checkNode(child))
    }
    
    if (node.fields) {
      return checkNode(node.fields)
    }
    
    return false
  }
  
  if (content.layout && Array.isArray(content.layout)) {
    if (content.layout.some((block: any) => checkNode(block))) {
      return true
    }
  }
  
  const lexicalFields = ['richText', 'content', 'body', 'description']
  for (const field of lexicalFields) {
    const fieldValue = (content as any)[field]
    if (fieldValue) {
      if (checkNode(fieldValue)) {
        return true
      }
    }
  }
  
  return false
}

const faqSchema = async () => {
  const faqs = await getCachedDocuments("faqs")() as Faq[]
  
  if (!faqs || faqs.length === 0) {
    return undefined
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer,
      },
    })),
  }
}

const testimonialSchema = async (settings: Setting) => {
  const testimonials = await getCachedDocuments("testimonials")() as Testimonial[]
  
  if (!testimonials || testimonials.length === 0) {
    return undefined
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.appTitle || undefined,
    review: await Promise.all(
      testimonials.map(async (testimonial) => ({
        '@type': 'Review',
        author: {
          '@type': testimonial.type === 'company' ? 'Organization' : 'Person',
          name: testimonial.name,
          ...(testimonial.avatar && {
            image: await imageSchema(testimonial.avatar as Media, settings),
          }),
        },
        reviewBody: testimonial.content,
        ...(testimonial.rating && {
          reviewRating: {
            '@type': 'Rating',
            ratingValue: testimonial.rating,
            bestRating: 5,
          },
        }),
        datePublished: new Date(testimonial.createdAt).toISOString(),
        ...(testimonial.position && { jobTitle: testimonial.position }),
        ...(testimonial.company && { 
          worksFor: {
            '@type': 'Organization',
            name: testimonial.company,
          },
        }),
      })),
    ),
  }
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
    medias.map((media) => mediaSchema(media as Media, settings)),
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
  
  const hasFaqs = hasFaqsInContent(page)
  const hasTestimonials = hasTestimonialsInContent(page)

  const baseSchema = {
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

  if (hasFaqs) {
    const faqData = await faqSchema()
    if (faqData) {
      return [baseSchema, faqData]
    }
  }

  if (hasTestimonials) {
    const testimonialData = await testimonialSchema(settings)
    if (testimonialData) {
      return [baseSchema, testimonialData]
    }
  }

  if (hasFaqs && hasTestimonials) {
    const faqData = await faqSchema()
    const testimonialData = await testimonialSchema(settings)
    const additionalSchemas = [faqData, testimonialData].filter(Boolean)
    if (additionalSchemas.length > 0) {
      return [baseSchema, ...additionalSchemas]
    }
  }

  return baseSchema
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
    medias.map((media) => mediaSchema(media as Media, settings)),
  ).then((schemas) => schemas.filter(Boolean))

  const publishDate = post?.publishedAt || post?.createdAt
  const modifyDate = post?.updatedAt
  
  const hasFaqs = hasFaqsInContent(post)
  const hasTestimonials = hasTestimonialsInContent(post)

  const baseSchema = {
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

  const additionalSchemas = []
  
  if (hasFaqs) {
    const faqData = await faqSchema()
    if (faqData) additionalSchemas.push(faqData)
  }

  if (hasTestimonials) {
    const testimonialData = await testimonialSchema(settings)
    if (testimonialData) additionalSchemas.push(testimonialData)
  }

  return additionalSchemas.length > 0 ? [baseSchema, ...additionalSchemas] : baseSchema
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

export const mediaSchema = async (media: Media | null | undefined, settings: Setting) => {
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
      (media.videoThumbnail as Thumbnail) || (settings.fallbackImage as Media) || null
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
          name: settings.postListingPageTitle || 'Posts',
          item: `${getServerSideURL()}/${settings.postSlug}`,
        },
      ],
    },
  }
}