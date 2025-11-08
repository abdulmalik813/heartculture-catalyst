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
import { SearchParams } from '@/types/search-params'
import { getCachedGlobal } from '@/lib/get-globals'
import { Page, Post, Setting } from '@/payload-types'
import PostListingPage from '@/components/post-listing'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const postSlug = ((await getCachedGlobal('settings', 1, false)) as Setting).postSlug || 'posts'

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

  const params: { slug: string[] }[] = []

  params.push({ slug: postSlug.split('/') })

  pages.docs?.forEach(({ slug }) => {
    params.push({ slug: slug?.split('/') })
  })

  posts.docs?.forEach(({ slug }) => {
    const correctSlug = `${postSlug}/${slug}`
    params.push({ slug: correctSlug?.split('/') })
  })

  params.push({ slug: [] })
  return params
}

interface PageProps {
  params: Promise<{
    slug?: string[]
  }>
  searchParams: SearchParams
}

const gapClasses = {
  none: 'gap-0',
  small: 'gap-2',
  medium: 'gap-4',
  large: 'gap-6',
  xlarge: 'gap-8',
}

export default async function Slug({ params, searchParams }: Readonly<PageProps>) {
  const { isEnabled: draft } = await draftMode()
  const postSlug = ((await getCachedGlobal('settings', 1, draft)) as Setting).postSlug || 'posts'
  let isPostPage = false
  const param = await params
  const slug = param?.slug ? param.slug.join('/') : 'home'
  const url = '/' + slug

  let page: Post | Page | null = null
  if (param?.slug?.includes(postSlug)) {
    if (param?.slug.length === 1 && param?.slug[0] === postSlug) {
      isPostPage = true
    } else if (param?.slug[0] === postSlug) {
      let postItemSlug = param?.slug.slice(1).join('/')
      page = await queryBySlug({
        slug: postItemSlug,
        collection: 'posts',
        draft,
      })
    }
  } else {
    page = await queryBySlug({
      slug,
      collection: 'pages',
      draft,
    })
  }

  if (!page && slug === 'home') {
    notFound()
  }

  if (!page && !isPostPage) {
    return <PayloadRedirects url={url} />
  }

  return (
    <article className="min-h-[70vh]">
      <PayloadRedirects disableNotFound url={url} />
      {isPostPage ? (
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
          </>
        )
      )}
    </article>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const settings = (await getCachedGlobal('settings', 1, false)) as Setting
  const postSlug = settings.postSlug || 'posts'
  const param = await params
  const slug = param?.slug ? param.slug.join('/') : 'home'

  let page: Post | Page | null = null

  if (param?.slug?.includes(postSlug)) {
    if (param?.slug.length === 1 && param?.slug[0] === postSlug) {
      return generatePostsListingMeta(settings)
    } else if (param?.slug[0] === postSlug) {
      let postItemSlug = param?.slug.slice(1).join('/')
      page = await queryBySlug({
        slug: postItemSlug,
        collection: 'posts',
        draft: false,
      })
    }
  } else {
    page = await queryBySlug({
      slug,
      collection: 'pages',
      draft: false,
    })
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