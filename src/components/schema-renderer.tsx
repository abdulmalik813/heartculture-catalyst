import Script from 'next/script'
import { blogSchema, postListingSchema, pageSchema } from '@/lib/seo-schema'
import { Page, Post, Setting } from '@/payload-types'

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
  let schema = null

  if (isPostListingPage) {
    schema = await postListingSchema(setting)
  } else if (isItAPost && page) {
    schema = await blogSchema(page as Post, setting)
  } else if (page) {
    schema = await pageSchema(page as Page, setting)
  }

  if (!schema) return null

  return (
    <Script id="schema" type="application/ld+json" strategy="lazyOnload">
      {JSON.stringify(schema)}
    </Script>
  )
}