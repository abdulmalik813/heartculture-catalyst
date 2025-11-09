import { SearchParams } from '@/types/search-params'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { getCachedGlobal } from '@/lib/get-globals'
import { Setting } from '@/payload-types'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface PostProps {
  searchParams: SearchParams
  setting: Setting | null
}

export default async function PostListingPage({ searchParams, setting }: Readonly<PostProps>) {
  const search = await searchParams
  const { q: searchQuery, page = '1', category } = search
  const currentPage = parseInt(page as string)
  const postsPerPage = 12

  const postSlug = setting?.postSlug || 'posts'
  const postListingPageTitle = setting?.postListingPageTitle || 'Post'

  const payload = await getPayload({ config: configPromise })

  const whereClause: any = {
    _status: {
      equals: 'published',
    },
  }

  if (category) {
    const categoryDoc = await payload.find({
      collection: 'categories',
      where: {
        slug: {
          equals: category as string,
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

  let posts
  let totalDocs = 0
  let selectedCategory = null

  if (searchQuery) {
    const searchResults = await payload.find({
      collection: 'search',
      where: {
        and: [
          {
            or: [
              {
                title: {
                  like: searchQuery as string,
                },
              },
              {
                excerpt: {
                  like: searchQuery as string,
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
    posts = await payload.find({
      collection: 'posts',
      where: whereClause,
      limit: postsPerPage,
      page: currentPage,
      sort: '-publishedAt',
    })
    totalDocs = posts.totalDocs
  }

  if (category) {
    const categoryDoc = await payload.find({
      collection: 'categories',
      where: {
        slug: {
          equals: category as string,
        },
      },
      limit: 1,
    })
    selectedCategory = categoryDoc.docs[0] || null
  }

  const allCategories = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'name',
  })

  const totalPages = Math.ceil(totalDocs / postsPerPage)

  const buildUrl = (pageNum: number) => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery as string)
    if (category) params.set('category', category as string)
    if (pageNum > 1) params.set('page', pageNum.toString())
    const queryString = params.toString()
    return `/${postSlug}${queryString ? `?${queryString}` : ''}`
  }

  const renderPaginationItems = () => {
    const items = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink href={buildUrl(1)}>1</PaginationLink>
        </PaginationItem>,
      )
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink href={buildUrl(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href={buildUrl(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-12 space-y-6">
        <h1 className="text-4xl font-bold">{postListingPageTitle}</h1>

        <form action={`/${postSlug}`} method="get">
          <div className="relative max-w-2xl">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="search"
              name="q"
              placeholder="Search posts..."
              defaultValue={searchQuery as string}
              className="pl-10"
            />
          </div>
        </form>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Filter by category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/${postSlug}`}>
              <Button variant={!category ? 'default' : 'outline'} size="sm">
                All Posts
              </Button>
            </Link>
            {allCategories.docs.map((cat) => (
              <Link key={cat.id} href={`/${postSlug}?category=${cat.slug}`}>
                <Button variant={category === cat.slug ? (cat.color as any) : 'outline'} size="sm">
                  {cat.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {(searchQuery || selectedCategory) && (
          <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Showing results for:</span>
            {searchQuery && (
              <Badge variant="secondary" className="font-medium">
                "{searchQuery}"
              </Badge>
            )}
            {searchQuery && selectedCategory && (
              <span className="text-sm text-muted-foreground">in</span>
            )}
            {selectedCategory && (
              <Badge variant={selectedCategory.color as any}>{selectedCategory.name}</Badge>
            )}
            <Link href={`/${postSlug}`} className="ml-auto">
              <Button variant="ghost" size="sm">
                Clear filters
              </Button>
            </Link>
          </div>
        )}
      </div>

      {posts.docs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.docs.map((post: any) => {
              const author = typeof post.author === 'object' ? post.author : null
              const categories = Array.isArray(post.categories)
                ? post.categories.filter((cat: any): cat is any => typeof cat === 'object')
                : []

              return (
                <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Link href={`/${postSlug}/${post.slug}`}>
                      <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                    </Link>
                    {post.excerpt && (
                      <CardDescription className="line-clamp-3 mt-2">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                      {post.publishedAt && (
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      )}
                      {author && <span>• {author.name || author.email}</span>}
                    </div>

                    {categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat: any) => (
                          <Link
                            key={cat.id}
                            href={`/${postSlug}?category=${cat.slug}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Badge
                              variant={cat.color || 'default'}
                              className="cursor-pointer hover:opacity-80"
                            >
                              {cat.name}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Link href={`/${postSlug}/${post.slug}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        Read more
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={currentPage > 1 ? buildUrl(currentPage - 1) : undefined}
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    href={currentPage < totalPages ? buildUrl(currentPage + 1) : undefined}
                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-lg">
              {searchQuery || category
                ? `No ${postListingPageTitle.toLowerCase()} found matching your criteria.`
                : `No ${postListingPageTitle.toLowerCase()} available yet.`}
            </p>
            {(searchQuery || category) && (
              <Link href={`/${postSlug}`} className="inline-block mt-4">
                <Button variant="outline">View all posts</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
