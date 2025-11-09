import { getCachedGlobal } from '@/lib/get-globals'
import { getServerSideURL } from '@/lib/get-url'
import type { Post, Media, User, Social, Setting } from '@/payload-types'

export const articleSchema = async (props: Post) => {
  const image = props.meta?.image as Media | undefined
  const author = props.author as User
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
    const settings = (await getCachedGlobal('settings')) as Setting
    const logo = settings.logo as Media
    imageUrl = logo.url || ''
  } else {
    imageUrl = image.url
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: props.title,
    datePublished: new Date(props.createdAt),
    dateModified: new Date(props.updatedAt),
    image: [`${getServerSideURL()}/${imageUrl}`],
    author: {
      '@type': 'Person',
      name: author.name,
      sameAs: socialLinks,
    },
  }
}

export const imageSchema = async (props: Media | null | undefined) => {
  let contentUrl: string

  if (!props || !props.url) {
    const settings = (await getCachedGlobal('settings')) as Setting
    const logo = settings.logo as Media
    contentUrl = logo.url || ''
  } else {
    contentUrl = props.url
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: `${getServerSideURL()}/${contentUrl}`,
    creditText: props?.creditText,
  }
}