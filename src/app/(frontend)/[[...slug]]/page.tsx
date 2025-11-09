import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/payload-redirect'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { generateMeta, generatePostsListingMeta } from '@/lib/generate-meta'
import { notFound } from 'next/navigation'
import { joinStyles } from '@/lib/make-styles'
import { cn } from '@/lib/utils'
import { BlockRenderer } from '@/components/block-renderer'
import { Hero } from '@/components/hero'
import { getCachedGlobal } from '@/lib/get-globals'
import { Media, Page, Post, Setting } from '@/payload-types'
import PostListingPage from '@/components/post-listing'
import { articleSchema, imageSchema } from '@/lib/seo-schema'
import Script from 'next/script'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const settings = (await getCachedGlobal('settings', 1, false)) as Setting
  const isPostEnabled = settings.enablePost

  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params: { slug: string[] }[] = []

  if (isPostEnabled) {
    const postSlug = settings.postSlug || 'posts'

    const posts = await payload.find({
      collection: 'posts',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    params.push({ slug: postSlug.split('/').filter(Boolean) })

    posts.docs?.forEach(({ slug }) => {
      const correctSlug = `${postSlug}/${slug}`
      params.push({ slug: correctSlug.split('/').filter(Boolean) })
    })
  }

  pages.docs?.forEach(({ slug }) => {
    params.push({ slug: slug?.split('/').filter(Boolean) || [] })
  })

  params.push({ slug: [] })
  return params
}

interface SlugProps {
  params: Promise<{
    slug?: string[]
  }>
  searchParams: Promise<Record<string, string | string[] | undefined | null>>
}

const gapClasses = {
  none: 'gap-0',
  small: 'gap-2',
  medium: 'gap-4',
  large: 'gap-6',
  xlarge: 'gap-8',
} as const

function isPostRoute(slugArray: string[] | undefined, postSlug: string): boolean {
  if (!slugArray || slugArray.length === 0) return false

  const postSlugParts = postSlug.split('/').filter(Boolean)

  if (slugArray.length < postSlugParts.length) return false

  return postSlugParts.every((part, index) => slugArray[index] === part)
}

function extractPostSlug(slugArray: string[], postSlug: string): string | null {
  const postSlugParts = postSlug.split('/').filter(Boolean)

  if (slugArray.length === postSlugParts.length) {
    return null
  }

  return slugArray.slice(postSlugParts.length).join('/')
}

export default async function Slug({ params, searchParams }: Readonly<SlugProps>) {
  const { isEnabled: draft } = await draftMode()
  const settings = (await getCachedGlobal('settings', 1, draft)) as Setting
  const isPostEnabled = settings.enablePost
  const param = await params
  const slug = param?.slug ? param.slug.join('/') : 'home'
  const url = '/' + slug

  let page: Post | Page | null = null
  let isPostListingPage = false
  let isItAPost = false
  if (isPostEnabled) {
    const postSlug = settings.postSlug || 'posts'

    if (isPostRoute(param?.slug, postSlug)) {
      const postItemSlug = extractPostSlug(param.slug!, postSlug)

      if (postItemSlug === null) {
        isPostListingPage = true
      } else if (postItemSlug) {
        isItAPost = true
        page = await queryBySlug({
          slug: postItemSlug,
          collection: 'posts',
          draft,
        })
      }
    }
  }

  if (!page && !isPostListingPage) {
    try {
      page = await queryBySlug({
        slug,
        collection: 'pages',
        draft,
      })
    } catch (error) {
      console.error('Error fetching page:', error)
    }
  }

  if (!page && slug === 'home' && !isPostListingPage) {
    notFound()
  }

  if (!page && !isPostListingPage) {
    return <PayloadRedirects url={url} />
  }

  const renderPostSchema = (post: Post) => {
    const schema = [
      imageSchema(post.meta?.image as Media),
      articleSchema(post)
    ]
    return <Script type={'application/ld+json'} strategy='lazyOnload'>{JSON.stringify(schema)}</Script>
  }

  return (
    <article className="min-h-[70vh]">
      <PayloadRedirects disableNotFound url={url} />
      {isPostListingPage ? (
        <PostListingPage searchParams={searchParams} />
      ) : (
        page && (
          <>
            <Hero hero={page.hero} />
            {page.layout?.map((layout, i) => (
              <div
                key={i}
                className={joinStyles(cn(layout.container && 'container mx-auto'), layout.styles)}
              >
                <div
                  className={cn(
                    'grid grid-cols-4 lg:grid-cols-12',
                    gapClasses[layout.gapSize || 'medium'],
                  )}
                >
                  {layout.blocks?.map((block, index) => (
                    <BlockRenderer key={index} searchParams={searchParams} block={block} />
                  ))}
                </div>
              </div>
            ))}
            {isItAPost && renderPostSchema(page)}
          </>
        )
      )}
    </article>
  )
}

export async function generateMetadata({ params }: SlugProps): Promise<Metadata> {
  const settings = (await getCachedGlobal('settings', 1, false)) as Setting
  const isPostEnabled = settings.enablePost
  const param = await params
  const slug = param?.slug ? param.slug.join('/') : 'home'

  let page: Post | Page | null = null

  if (isPostEnabled) {
    const postSlug = settings.postSlug || 'posts'

    if (isPostRoute(param?.slug, postSlug)) {
      const postItemSlug = extractPostSlug(param.slug!, postSlug)

      if (postItemSlug === null) {
        return generatePostsListingMeta(settings)
      } else if (postItemSlug) {
        try {
          page = await queryBySlug({
            slug: postItemSlug,
            collection: 'posts',
            draft: false,
          })
        } catch (error) {
          console.error('Error fetching post metadata:', error)
        }
      }
    }
  }

  if (!page) {
    try {
      page = await queryBySlug({
        slug,
        collection: 'pages',
        draft: false,
      })
    } catch (error) {
      console.error('Error fetching page metadata:', error)
    }
  }

  return generateMeta({ doc: page })
}

const queryBySlug = cache(
  async ({
    slug,
    collection,
    draft,
  }: {
    slug: string
    collection: 'pages' | 'posts'
    draft: boolean
  }) => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection,
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  },
)
