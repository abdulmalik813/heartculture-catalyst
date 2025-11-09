import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Page, Post, RecentPostsBlock, Setting } from '@/payload-types'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { SearchParams } from '@/types/search-params'

export async function RecentPostsBlockUI({
  searchParams,
  setting,
  page,
  ...recentPostsBlock
}: Partial<RecentPostsBlock> & { searchParams?: SearchParams } & { className?: string } & {
  setting: Setting | null
} & { page: Post | Page | null }) {
  const payload = await getPayload({ config: configPromise })

  const recentPosts = await payload.find({
    collection: 'posts',
    limit: recentPostsBlock.numberOfPosts,
    where: {
      id: {
        not_equals: page?.id,
      },
    },
    sort: '-publishedAt',
    depth: 1,
  })

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Recent Posts</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Post Title</TableHead>
            <TableHead>Categories</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentPosts.docs.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {post.categories?.map(
                    (category) =>
                      typeof category === 'object' && (
                        <Badge key={category.id}>{category.name}</Badge>
                      ),
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
