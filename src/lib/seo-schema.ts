import { getCachedGlobal } from '@/lib/get-globals'
import { getServerSideURL } from '@/lib/get-url'
import type { Post, Media, User, Social, Setting } from '@/payload-types'
import { getMediaUrl } from '@/lib/get-media-url'

export const articleSchema = async (post: Post, settings: Setting) => {
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
    '@type': 'BlogPosting',
    headline: post?.meta?.title || '',
    description: post?.meta?.description || '',
    datePublished: new Date(post?.createdAt),
    dateModified: new Date(post?.updatedAt),
    image: [imageSchema(post.meta?.image as Media, settings)],
    author: {
      '@type': 'Person',
      name: (post.author as User)?.name || '',
      sameAs: socialLinks,
    },
    url: `${getServerSideURL()}/${settings.postSlug}/${post?.slug}`,
  }
}

export const imageSchema = async (image: Media | null | undefined, settings: Setting) => {
  let imageToUse = null
  if (!image || !image.url) {
    imageToUse = settings.logo as Media
  } else {
    imageToUse = image
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: getMediaUrl(imageToUse?.url || ''),
    creditText: image?.creditText || '',
    description: image?.caption || '',
    creator: image?.creator || '',
    license: image?.license || '',
    copyrightNotice: image?.copyrightNotice || '',
    acquireLicensePage: image?.acquireLicensePage || ''
  }
}
