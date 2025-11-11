import type { PayloadRequest } from 'payload'
import { getPayload } from 'payload'

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

import configPromise from '@payload-config'
import { PAYLOAD } from '@/constants/init'

export async function GET(req: NextRequest): Promise<Response> {
  console.log('=== Preview Route Handler Started ===')
  console.log('Timestamp:', new Date().toISOString())
  
  try {
    console.log('Step 1: Getting Payload instance...')
    const payload = await getPayload({ config: configPromise })
    console.log('✓ Payload instance obtained successfully')
    console.log('Payload config loaded:', !!payload)
  } catch (error) {
    console.error('✗ FATAL: Failed to get Payload instance:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return new Response('Internal server error', { status: 500 })
  }

  const payload = await getPayload({ config: configPromise })

  try {
    console.log('Step 2: Parsing URL and search params...')
    const { searchParams } = new URL(req.url)
    console.log('✓ URL parsed successfully')
    console.log('Full request URL:', req.url)
    console.log('Search params object:', Object.fromEntries(searchParams.entries()))
    console.log('All search param keys:', Array.from(searchParams.keys()))

    const path = searchParams.get('path')
    const previewSecret = searchParams.get('previewSecret')

    console.log('Step 3: Validating parameters...')
    console.log('Path parameter:', path)
    console.log('Path type:', typeof path)
    console.log('Preview secret provided:', previewSecret ? '[REDACTED]' : 'null/undefined')
    console.log('Preview secret length:', previewSecret?.length || 0)
    console.log('Expected preview secret length:', PAYLOAD.PREVIEW?.length || 0)
    console.log('Preview secret matches:', previewSecret === PAYLOAD.PREVIEW)
    console.log('PAYLOAD.PREVIEW exists:', !!PAYLOAD.PREVIEW)

    if (previewSecret !== PAYLOAD.PREVIEW) {
      console.error('✗ Preview secret validation failed')
      console.error('Expected:', PAYLOAD.PREVIEW ? '[REDACTED]' : 'undefined/null')
      console.error('Received:', previewSecret ? '[REDACTED]' : 'undefined/null')
      return new Response('You are not allowed to preview this page', { status: 403 })
    }
    console.log('✓ Preview secret validated')

    if (!path) {
      console.error('✗ Path parameter is missing or empty')
      return new Response('Insufficient search params', { status: 404 })
    }
    console.log('✓ Path parameter validated')

  } catch (error) {
    console.error('✗ Error during parameter validation:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown',
    })
    return new Response('Bad request', { status: 400 })
  }

  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')

  let user

  try {
    console.log('Step 4: Starting authentication...')
    console.log('Request method:', req.method)
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))
    console.log('Has authorization header:', req.headers.has('authorization'))
    console.log('Has cookie header:', req.headers.has('cookie'))
    
    user = await payload.auth({
      req: req as unknown as PayloadRequest,
      headers: req.headers,
    })
    
    console.log('✓ Authentication call completed')
    console.log('User result:', user ? {
      id: user.id,
      email: user.email,
      collection: user.collection,
      _strategy: user._strategy,
    } : 'null/undefined')
    
  } catch (error) {
    console.error('✗ Authentication failed with error')
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  try {
    console.log('Step 5: Managing draft mode...')
    const draft = await draftMode()
    console.log('✓ Draft mode instance obtained')

    if (!user) {
      console.warn('✗ No authenticated user found')
      console.log('Disabling draft mode...')
      draft.disable()
      console.log('✓ Draft mode disabled')
      return new Response('You are not allowed to preview this page', { status: 403 })
    }

    console.log('✓ User authenticated, enabling draft mode')
    draft.enable()
    console.log('✓ Draft mode enabled')

  } catch (error) {
    console.error('✗ Error managing draft mode:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace',
    })
    return new Response('Internal server error', { status: 500 })
  }

  try {
    console.log('Step 6: Redirecting...')
    console.log('Redirect target:', `/${path}`)
    console.log('=== Preview Route Handler Complete ===')
    
    redirect(`/${path}`)
  } catch (error) {
    console.error('✗ Redirect failed:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace',
    })
    // Note: Next.js redirect() throws an error by design to stop execution
    // This might be expected behavior, so we rethrow it
    throw error
  }
}