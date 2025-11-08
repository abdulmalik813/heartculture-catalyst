import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const categories = await payload.find({
    collection: 'categories',
    limit: 1000,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return categories.docs?.map(({ slug }) => ({
    slug: slug,
  })) || []
}

interface CategoryProps {
  params: Promise<{
    slug: string
    category: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

export default async function Category({ params, searchParams }: Readonly<CategoryProps>) {
  const { slug, category: categorySlug } = await params
  const { page = '1' } = await searchParams
  const currentPage = parseInt(page)

  const category = await queryCategoryBySlug({ slug: categorySlug })
  
  if (!category) {
    notFound()
  }

  const postsPerPage = 12
  const posts = await queryPostsByCategory({
    categoryId: category.id,
    page: currentPage,
    limit: postsPerPage,
  })

  const totalPages = Math.ceil((posts.totalDocs || 0) / postsPerPage)

  return (
    <div className="container mx-auto py-12">
      {/* Category Header */}
      <div className="mb-12 text-center">
        <Badge variant={category.color || 'default'} className="mb-4 text-lg px-4 py-2">
          {category.name}
        </Badge>
        {category.description && (
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
      </div>

      {/* Posts Grid */}
      {posts.docs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.docs.map((post) => {
              const author = typeof post.author === 'object' ? post.author : null
              
              return (
                <article key={post.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/posts/${post.slug}`}>
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-2 hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      
                      {post.excerpt && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {post.publishedAt && (
                          <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </time>
                        )}
                        
                        {author && (
                          <span>{author.name || author.email}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {currentPage > 1 && (
                <Link 
                  href={`/posts/category/${slug}?page=${currentPage - 1}`}
                  className="px-4 py-2 border rounded hover:bg-accent"
                >
                  Previous
                </Link>
              )}
              
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              
              {currentPage < totalPages && (
                <Link 
                  href={`/posts/category/${slug}?page=${currentPage + 1}`}
                  className="px-4 py-2 border rounded hover:bg-accent"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No posts found in this category.
          </p>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: CategoryProps): Promise<Metadata> {
  const { slug } = await params
  const category = await queryCategoryBySlug({ slug })

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} - Blog`,
    description: category.description || `Browse posts in ${category.name}`,
  }
}

const queryCategoryBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const queryPostsByCategory = cache(async ({ 
  categoryId, 
  page = 1, 
  limit = 12 
}: { 
  categoryId: number
  page?: number
  limit?: number
}) => {
  const payload = await getPayload({ config: configPromise })

  return await payload.find({
    collection: 'posts',
    limit,
    page,
    where: {
      categories: {
        contains: categoryId,
      },
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
  })
})