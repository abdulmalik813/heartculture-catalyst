import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/payload-redirect'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { generateMeta } from '@/lib/generate-meta'
import { notFound } from 'next/navigation'
import { joinStyles } from '@/lib/make-styles'
import { cn } from '@/lib/utils'
import { BlockRenderer } from '@/components/block-renderer'
import { Hero } from '@/components/hero'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
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

  return posts.docs?.map(({ slug }) => ({
    slug: slug,
  })) || []
}

interface PostProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

const gapClasses = {
  none: 'gap-0',
  small: 'gap-2',
  medium: 'gap-4',
  large: 'gap-6',
  xlarge: 'gap-8',
}

export default async function Post({ params, searchParams }: Readonly<PostProps>) {
  const { slug } = await params
  const url = `/posts/${slug}`

  const post = await queryPostBySlug({
    slug,
  })

  if (!post) {
    return <PayloadRedirects url={url} />
  }

  const author = typeof post.author === 'object' ? post.author : null
  const categories = Array.isArray(post.categories) 
    ? post.categories.filter((cat): cat is any => typeof cat === 'object')
    : []

  return (
    <article className="min-h-[70vh]" suppressHydrationWarning>
      <PayloadRedirects disableNotFound url={url} />
      <Hero hero={post.hero} />
      
      {/* Post Meta */}
      <div className="container mx-auto py-6">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          )}
          
          {author && (
            <span>
              by <span className="font-medium text-foreground">{author.name || author.email}</span>
            </span>
          )}
          
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link key={category.id} href={`/posts/category/${category.slug}`}>
                  <Badge variant={category.color || 'default'}>
                    {category.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      {post.layout?.map((layout, i) => (
        <div
          key={i}
          className={joinStyles(cn(layout.container && 'container mx-auto'), layout.styles)}
        >
          <div className={cn('grid grid-cols-4 lg:grid-cols-12', gapClasses[layout.gapSize || 'medium'])}>
            {layout.blocks?.map((block, index) => (
              <BlockRenderer key={index} searchParams={searchParams} block={block} />
            ))}
          </div>
        </div>
      ))}
    </article>
  )
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
  const { slug } = await params
  const post = await queryPostBySlug({
    slug,
  })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
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
})