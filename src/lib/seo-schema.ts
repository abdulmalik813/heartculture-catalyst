import { getCachedGlobal } from '@/lib/get-globals'
import { getServerSideURL } from '@/lib/get-url'
import type { Post, Media, User, Social, Setting } from '@/payload-types'
import { getMediaUrl } from './get-media-url'

export const articleSchema = async (post: Post, settings: Setting) => {
  const image = post.meta?.image as Media | undefined
  const author = post.author as User
  const social = (await getCachedGlobal('social')) as Social

  const socialLinks = [
    social.facebook,
    social.instagram,
    social.linkedin,
    social.x,
    social.youtube,
    social.tiktok,
  ].filter((link) => link)

  let imageUrl: string

  if (!image || !image.url) {
    const logo = settings.logo as Media
    imageUrl = logo.url || ''
  } else {
    imageUrl = image.url
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post?.title,
    datePublished: new Date(post?.createdAt),
    dateModified: new Date(post?.updatedAt),
    image: [getMediaUrl(imageUrl)],
    author: {
      '@type': 'Person',
      name: author?.name,
      sameAs: socialLinks,
    },
    url: `${getServerSideURL()}/${settings.postSlug}/${post?.slug}`,
  }
}

export const imageSchema = async (image: Media | null | undefined, settings: Setting) => {
  let contentUrl: string

  if (!image || !image.url) {
    const logo = settings.logo as Media
    contentUrl = logo.url || ''
  } else {
    contentUrl = image.url
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: getMediaUrl(contentUrl),
    creditText: image?.creditText,
    description: image?.caption 
  }
}
