import Script from 'next/script'
import {
  blogSchema,
  postListingSchema,
  pageSchema,
  websiteSchema,
  organizationSchema,
} from '@/lib/seo-schema'
import { Post, Page } from '@/payload-types'
import { PageContext } from '@/types/page-context'

export async function SchemaRenderer({ pageContext }: { pageContext: PageContext }) {
  const { page, isItAPost, isPostListingPage, setting } = pageContext

  const schemas = []

  if (setting.enablePost) {
    const websiteSchemaData = await websiteSchema(setting)
    schemas.push(websiteSchemaData)
  }

  const organizationSchemaData = await organizationSchema(setting)
  schemas.push(organizationSchemaData)

  if (isPostListingPage) {
    const listingSchema = await postListingSchema(setting)
    schemas.push(listingSchema)
  } else if (isItAPost && page) {
    const blogSchemaData = await blogSchema(page as Post, setting)
    schemas.push(blogSchemaData)
  } else if (page) {
    const pageSchemaData = await pageSchema(page as Page, setting)
    schemas.push(pageSchemaData)
  }

  if (schemas.length === 0) return null

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': schemas,
  }

  return (
    <Script id="schema" type="application/ld+json" strategy="lazyOnload">
      {JSON.stringify(combinedSchema)}
    </Script>
  )
}
