import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    const token = request.cookies.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({
        error: 'Unauthorized - No token provided'
      }, {
        status: 401
      })
    }

    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({
        error: 'Unauthorized - Invalid token'
      }, {
        status: 401
      })
    }

    revalidateTag('global_footer')
    revalidateTag('global_header')
    revalidateTag('redirects')
    revalidateTag('global_styleSheet')
    revalidateTag('global_version_styleSheet')
    revalidateTag('pages-sitemap')
    revalidateTag('posts-sitemap')
    revalidateTag('global_font')
    revalidateTag('google-fonts')

    const pages = await payload.find({
      collection: 'pages',
      limit: 1000
    })
    revalidatePath("/")
    pages.docs.forEach((page) => revalidatePath("/" + page.slug))

    return NextResponse.json({
      revalidated: true,
      message: 'Cache invalidated successfully',
      now: Date.now()
    })
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json({
      revalidated: false,
      error: err instanceof Error ? err.message : 'Error revalidating cache'
    }, {
      status: 500
    })
  }
}