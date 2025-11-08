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

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
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

  pages.docs?.forEach(({ slug }) => {
    params.push({ slug: slug?.split('/') })
  })
  params.push({ slug: [] })
  return params
}

interface PageProps {
  params: Promise<{
    slug?: string[]
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

export default async function Page({ params, searchParams }: Readonly<PageProps>) {
  const param = await params
  const slug = param?.slug ? param.slug.join('/') : 'home'
  const url = '/' + slug

  const page = await queryPageBySlug({
    slug,
  })

  if (!page && slug === 'home') {
    notFound()
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  return (
    <article className="min-h-[70vh]" suppressHydrationWarning>
      <PayloadRedirects disableNotFound url={url} />
      <Hero hero={page.hero} />
      {page.layout?.map((layout, i) => (
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const joinedSlug: string = slug ? slug.join('/') : 'home'
  const page = await queryPageBySlug({
    slug: joinedSlug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
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