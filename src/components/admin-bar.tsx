import { PageContext } from '@/types/page-context'
import { getServerSideURL } from '@/lib/get-url'
import { PlusCircle, LayoutDashboard, XCircle, Eye } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export async function AdminBar({ pageContext }: { pageContext: PageContext }) {
  if (!pageContext.user) return null

  const serverUrl = getServerSideURL()
  const collection = pageContext.isItAPost ? 'posts' : 'pages'
  const path = pageContext.slug === 'home' ? '/' : `/${pageContext.slug}`

  return (
    <div className="hidden lg:block border-b">
      <div className="flex h-12 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <Link href={`${serverUrl}/admin`}>
              <LayoutDashboard className="h-4 w-4" />
              <span className="font-medium">{pageContext.setting.appTitle || 'Dashboard'}</span>
            </Link>
          </Button>

          <Separator orientation="vertical" className="h-6" />
          
          {pageContext.draft ? (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-destructive hover:text-destructive/90"
              asChild
            >
              <Link href={`/api/draft/disable?path=${encodeURIComponent(path)}`}>
                <XCircle className="h-4 w-4" />
                <span>Exit Preview</span>
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-primary hover:text-primary/90"
              asChild
            >
              <Link href="/api/draft/enable">
                <Eye className="h-4 w-4" />
                <span>Enable Preview</span>
              </Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <Link href={`${serverUrl}/admin/collections/pages/create`}>
              <PlusCircle className="h-4 w-4" />
              <span>New Page</span>
            </Link>
          </Button>

          {pageContext.setting.enablePost && (
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <Link href={`${serverUrl}/admin/collections/posts/create`}>
                <PlusCircle className="h-4 w-4" />
                <span>New Post</span>
              </Link>
            </Button>
          )}

          {pageContext.page && (
            <Button variant="default" size="sm" asChild>
              <Link
                href={`${serverUrl}/admin/collections/${collection}/${typeof pageContext.page === 'object' && 'id' in pageContext.page ? pageContext.page.id : ''}`}
              >
                Edit {pageContext.isItAPost ? 'Post' : 'Page'}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}