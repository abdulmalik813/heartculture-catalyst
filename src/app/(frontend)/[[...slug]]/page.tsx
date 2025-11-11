import type { Metadata } from 'next'

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
import { Page, Post, Setting } from '@/payload-types'
import PostListingPage from '@/components/post-listing'
import { redirectCheck } from '@/lib/redirect'
import { SchemaRenderer } from '@/components/schema-renderer'
import { PageContext } from '@/types/page-context'
import { Footer } from '@/components/footer'
import { NavigationBarUI } from '@/components/navigation-bar'
import { SlugProps } from '@/types/slug-props'
import { AdminBar } from '@/components/admin-bar'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const setting = (await getCachedGlobal('settings', 1, false)) as Setting
  const isPostEnabled = setting.enablePost

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
    const postSlug = setting.postSlug || 'posts'

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

const gapClasses = {
  none: 'gap-0',
  small: 'gap-2',
  medium: 'gap-4',
  large: 'gap-6',
  xlarge: 'gap-8',
} as const

const colsSpanClasses = {
  full: 'col-span-4 lg:col-span-12',
  half: 'col-span-4 lg:col-span-6',
  'one-third': 'col-span-4 lg:col-span-4',
  'two-thirds': 'col-span-4 lg:col-span-8',
}

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

export default async function PageRoute({ params, searchParams }: Readonly<SlugProps>) {
  const { isEnabled: draft } = await draftMode()
  
  const setting = (await getCachedGlobal('settings', 1, draft)) as Setting
  const isPostEnabled = setting.enablePost
  const param = await params
  const slug = param?.slug ? param.slug.join('/') : 'home'
  await redirectCheck(slug, setting)
  let page: Post | Page | null = null
  let isPostListingPage = false
  let isItAPost = false
  if (isPostEnabled) {
    const postSlug = setting.postSlug || 'posts'

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
    page = await queryBySlug({
      slug,
      collection: 'pages',
      draft,
    })
  }

  if (!page && slug === 'home' && !isPostListingPage) {
    notFound()
  }

  if (!page && !isPostListingPage) {
    return notFound()
  }

  const pageContext: PageContext = {
    page,
    setting,
    searchParams,
    draft,
    slug,
    isItAPost,
    isPostListingPage,
  }
  return (
    <>
      <AdminBar pageContext={pageContext} />
      <NavigationBarUI pageContext={pageContext} />
      <main className="flex-1">
        <article className="min-h-[70vh]">
          {isPostListingPage ? (
            <>
              <PostListingPage pageContext={pageContext} />
            </>
          ) : (
            page && (
              <>
                <Hero hero={page.hero} pageContext={pageContext} />
                {page.layout?.map((layout, i) => (
                  <div
                    key={i}
                    className={joinStyles(
                      cn(layout.container && 'container mx-auto px-4'),
                      layout.styles,
                    )}
                  >
                    <div
                      className={cn(
                        'grid grid-cols-4 lg:grid-cols-12',
                        gapClasses[layout.gapSize || 'medium'],
                      )}
                    >
                      {layout.grid?.map((grid, index) => (
                        <div
                          key={index}
                          className={joinStyles(
                            colsSpanClasses[grid.gridSize],
                            grid.gridStyles,
                            cn({ 'md:col-span-2': grid.gridSize !== 'full' }),
                          )}
                        >
                          {grid.blocks?.map((block, index) => (
                            <BlockRenderer key={index} block={block} pageContext={pageContext} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )
          )}
          <SchemaRenderer pageContext={pageContext} />
        </article>
      </main>
      <Footer pageContext={pageContext} />
    </>
  )
}

export async function generateMetadata({ params }: SlugProps): Promise<Metadata> {
  const setting = (await getCachedGlobal('settings', 1, false)) as Setting
  const isPostEnabled = setting.enablePost
  const param = await params
  const slug = param?.slug ? param.slug.join('/') : 'home'
  let post = false
  let page: Post | Page | null = null

  if (isPostEnabled) {
    const postSlug = setting.postSlug || 'posts'

    if (isPostRoute(param?.slug, postSlug)) {
      const postItemSlug = extractPostSlug(param.slug!, postSlug)

      if (postItemSlug === null) {
        return generatePostsListingMeta(setting)
      } else if (postItemSlug) {
        post = true
        page = await queryBySlug({
          slug: postItemSlug,
          collection: 'posts',
          draft: false,
        })
      }
    }
  }

  if (!page) {
    page = await queryBySlug({
      slug,
      collection: 'pages',
      draft: false,
    })
  }

  return generateMeta(page, post, setting)
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
