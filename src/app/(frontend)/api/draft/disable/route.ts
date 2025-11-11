import { getServerSideURL } from '@/lib/get-url'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest): Promise<Response> {
  const draft = await draftMode()
  draft.disable()

  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')

  if (path) {
    redirect(`/${path}`)
  }

  redirect(getServerSideURL())
}