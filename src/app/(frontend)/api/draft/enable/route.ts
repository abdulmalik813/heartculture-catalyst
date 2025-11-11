import type { PayloadRequest } from 'payload'
import { getPayload } from 'payload'

import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

import configPromise from '@payload-config'
import { PAYLOAD } from '@/constants/init'
import { getServerSideURL } from '@/lib/get-url'

export async function GET(req: NextRequest): Promise<Response> {
  const payload = await getPayload({ config: configPromise })

  const { searchParams } = new URL(req.url)

  const path = searchParams.get('path')
  const previewSecret = searchParams.get('previewSecret')

  if (previewSecret !== PAYLOAD.PREVIEW) {
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  if (!path) {
    return new Response('Insufficient search params', { status: 404 })
  }

  let user

  try {
    const headersList = await headers()
    const authResult = await payload.auth({ headers: headersList })
    user = authResult.user
  } catch (error) {
    console.error('Auth error:', error)
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  const draft = await draftMode()

  if (!user) {
    draft.disable()
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  draft.enable()

  redirect(`${getServerSideURL()}/${path}`)
}