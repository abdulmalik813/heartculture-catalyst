import Script from 'next/script'
import { articleSchema, imageSchema } from '@/lib/seo-schema'
import { Media, Page, Post, Setting } from '@/payload-types'

interface SchemaRendererProps {
  page: Post | Page | null
  isItAPost: boolean
  isPostListingPage: boolean
  setting: Setting
}

export async function SchemaRenderer({
  page,
  isItAPost,
  isPostListingPage,
  setting,
}: SchemaRendererProps) {
  const schemas: any[] = []

  if (isItAPost && page) {
    schemas.push(await articleSchema(page as Post, setting))
  }

  if (isPostListingPage) {
    schemas.push(await imageSchema(setting?.postMetaImage as Media, setting))
  } else if (page) {
    schemas.push(await imageSchema(page?.meta?.image as Media, setting))
  }

  if (schemas.length === 0) return null

  if (schemas.length > 1) {
    return (
      <Script id="schema" type="application/ld+json" strategy="lazyOnload">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': schemas,
        })}
      </Script>
    )
  }

  return (
    <Script id="schema" type="application/ld+json" strategy="lazyOnload">
      {JSON.stringify(schemas[0])}
    </Script>
  )
}