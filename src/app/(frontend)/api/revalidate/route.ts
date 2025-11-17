import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidateAll } from '@/lib/revalidate'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get('tag')
  const path = searchParams.get('path')
  const collection = searchParams.get('collection')
  const global = searchParams.get('global')

  try {
    const payload = await getPayload({ config })

    const token = request.cookies.get('payload-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          error: 'Unauthorized - No token provided',
        },
        {
          status: 401,
        },
      )
    }

    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        {
          error: 'Unauthorized - Invalid token',
        },
        {
          status: 401,
        },
      )
    }

    if (tag) {
      revalidateTag(tag)
    } else if (path) {
      revalidatePath(path)
    } else if (collection) {
      revalidateTag(`collection_${collection}`)
    } else if (global) {
      revalidateTag(`global_${global}`)
    } else {
      await revalidateAll()
    }

    return NextResponse.json({
      revalidated: true,
      message: 'Cache invalidated successfully',
      now: Date.now(),
    })
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json(
      {
        revalidated: false,
        error: err instanceof Error ? err.message : 'Error revalidating cache',
      },
      {
        status: 500,
      },
    )
  }
}