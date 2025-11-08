import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'

interface PostsPageProps {
  searchParams: Promise<{
    q?: string
    page?: string
    category?: string
  }>
}

export const metadata: Metadata = {
  title: 'Blog Posts',
  description: 'Browse our latest blog posts and articles',
}

export default async function PostsPage({ searchParams }: Readonly<PostsPageProps>) {
  const { q: searchQuery, page = '1', category } = await searchParams
  const currentPage = parseInt(page)
  const postsPerPage = 12

  const payload = await getPayload({ config: configPromise })

  // Build where clause
  const whereClause: any = {
    _status: {
      equals: 'published',
    },
  }

  // Add category filter if provided
  if (category) {
    const categoryDoc = await payload.find({
      collection: 'categories',
      where: {
        slug: {
          equals: category,
        },
      },
      limit: 1,
    })

    if (categoryDoc.docs[0]) {
      whereClause.categories = {
        contains: categoryDoc.docs[0].id,
      }
    }
  }

  // If search query exists, use the search collection
  let posts
  let totalDocs = 0
  let selectedCategory = null

  if (searchQuery) {
    // Search using the search collection
    const searchResults = await payload.find({
      collection: 'search',
      where: {
        and: [
          {
            or: [
              {
                title: {
                  like: searchQuery,
                },
              },
              {
                excerpt: {
                  like: searchQuery,
                },
              },
            ],
          },
          {
            'doc.relationTo': {
              equals: 'posts',
            },
          },
        ],
      },
      limit: postsPerPage,
      page: currentPage,
      sort: '-priority',
    })

    // Extract the actual post documents
    const postIds = searchResults.docs
      .map((result: any) => (typeof result.doc === 'object' ? result.doc.value : result.doc))
      .filter(Boolean)

    if (postIds.length > 0) {
      const postsQuery = await payload.find({
        collection: 'posts',
        where: {
          and: [
            {
              id: {
                in: postIds,
              },
            },
            whereClause,
          ],
        },
        limit: postsPerPage,
      })
      posts = postsQuery
      totalDocs = searchResults.totalDocs
    } else {
      posts = { docs: [], totalDocs: 0 }
      totalDocs = 0
    }
  } else {
    // Regular query without search
    posts = await payload.find({
      collection: 'posts',
      where: whereClause,
      limit: postsPerPage,
      page: currentPage,
      sort: '-publishedAt',
    })
    totalDocs = posts.totalDocs
  }

  // Get selected category if filtering
  if (category) {
    const categoryDoc = await payload.find({
      collection: 'categories',
      where: {
        slug: {
          equals: category,
        },
      },
      limit: 1,
    })
    selectedCategory = categoryDoc.docs[0] || null
  }

  // Get all categories for filter
  const allCategories = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'name',
  })

  const totalPages = Math.ceil(totalDocs / postsPerPage)

  return (
    <div className="container mx-auto py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        
        {/* Search Bar */}
        <form action="/posts" method="get" className="mb-8">
          <div className="relative max-w-2xl">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="search"
              name="q"
              placeholder="Search posts..."
              defaultValue={searchQuery}
              className="pl-10"
            />
          </div>
        </form>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Link href="/posts">
            <Badge variant={!category ? 'default' : 'outline'}>
              All Posts
            </Badge>
          </Link>
          {allCategories.docs.map((cat) => (
            <Link key={cat.id} href={`/posts?category=${cat.slug}`}>
              <Badge variant={category === cat.slug ? cat.color : 'outline'}>
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedCategory) && (
          <div className="mt-4 text-muted-foreground">
            Showing results for:{' '}
            {searchQuery && <span className="font-medium">"{searchQuery}"</span>}
            {searchQuery && selectedCategory && ' in '}
            {selectedCategory && (
              <Badge variant={selectedCategory.color} className="ml-1">
                {selectedCategory.name}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Posts Grid */}
      {posts.docs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.docs.map((post: any) => {
              const author = typeof post.author === 'object' ? post.author : null
              const categories = Array.isArray(post.categories)
                ? post.categories.filter((cat: any): cat is any => typeof cat === 'object')
                : []

              return (
                <article
                  key={post.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/posts/${post.slug}`}>
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-2 hover:text-primary transition-colors">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {post.publishedAt && (
                          <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </time>
                        )}

                        {author && <span>{author.name || author.email}</span>}
                      </div>

                      {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {categories.map((cat: any) => (
                            <Badge key={cat.id} variant={cat.color || 'default'}>
                              {cat.name}
                            </Badge>
                          ))}
                        </div>
                      )}
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
                  href={`/posts?${new URLSearchParams({
                    ...(searchQuery && { q: searchQuery }),
                    ...(category && { category }),
                    page: (currentPage - 1).toString(),
                  })}`}
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
                  href={`/posts?${new URLSearchParams({
                    ...(searchQuery && { q: searchQuery }),
                    ...(category && { category }),
                    page: (currentPage + 1).toString(),
                  })}`}
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
            {searchQuery || category
              ? 'No posts found matching your criteria.'
              : 'No posts available yet.'}
          </p>
        </div>
      )}
    </div>
  )
}