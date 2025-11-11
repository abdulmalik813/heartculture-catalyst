import { PageContext } from '@/types/page-context'
import { getServerSideURL } from '@/lib/get-url'
import { PlusCircle, LayoutDashboard, XCircle } from 'lucide-react'
import Link from 'next/link'

export async function AdminBar({ pageContext }: { pageContext: PageContext }) {
  if (!pageContext.user) return null

  const serverUrl = getServerSideURL()
  const collection = pageContext.isItAPost ? 'posts' : 'pages'
  const redirectUrl = pageContext.slug === 'home' ? '/' : `/${pageContext.slug}`
  
  return (
    <div className="hidden lg:block py-2 px-4 bg-primary text-primary-foreground border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href={`${serverUrl}/admin`}
            className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="font-medium">{pageContext.setting.appTitle || 'Dashboard'}</span>
          </Link>
          
          {pageContext.draft && (
            <Link
              href={`/api/exit-preview?redirect=${encodeURIComponent(redirectUrl)}`}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium"
            >
              <XCircle className="h-4 w-4" />
              <span>Exit Preview</span>
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            href={`${serverUrl}/admin/collections/pages/create`}
            className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors text-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Page</span>
          </Link>
          
          {pageContext.setting.enablePost && (
            <Link
              href={`${serverUrl}/admin/collections/posts/create`}
              className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors text-sm"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Post</span>
            </Link>
          )}
          
          {pageContext.page && (
            <Link
              href={`${serverUrl}/admin/collections/${collection}/${typeof pageContext.page === 'object' && 'id' in pageContext.page ? pageContext.page.id : ''}`}
              className="flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              Edit {pageContext.isItAPost ? 'Post' : 'Page'}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}