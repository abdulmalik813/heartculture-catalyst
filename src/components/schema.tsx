import { getCachedGlobal } from '@/lib/get-globals'
import { getServerSideURL } from '@/lib/get-url'
import type { Post, Media, User, Social } from '@/payload-types'

export const articleSchema = async (props: Post) => {
  const image = props.meta?.image as Media
  const author = props.author as User
  const social = (await getCachedGlobal('social')) as Social

  const socialLinks = Object.values(social)
    .filter((value) => typeof value === 'string' && value.length > 0)
    .filter((value) => value.startsWith('http')) as string[]

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: props.title,
    datePublished: new Date(props.createdAt),
    dateModified: new Date(props.updatedAt),
    image: [`${getServerSideURL()}/${image.url}`],
    author: {
      '@type': 'Person',
      name: author.name,
      sameAs: socialLinks,
    },
  }
}

export const imageSchema = (props: Media) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: `${process.env.S3_ENDPOINT}/${props.filename}`,
    creditText: props.creditText,
  }
}