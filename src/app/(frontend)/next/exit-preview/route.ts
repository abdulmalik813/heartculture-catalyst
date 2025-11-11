import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest): Promise<Response> {
  const draft = await draftMode()
  draft.disable()
  
  const { searchParams } = new URL(request.url)
  const redirectUrl = searchParams.get('redirect')
  
  if (redirectUrl) {
    redirect(redirectUrl)
  }
  
  redirect('/')
}