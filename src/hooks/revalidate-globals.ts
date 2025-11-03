import { getCachedDocuments } from '@/lib/get-document'
import { Page } from '@/payload-types'
import { revalidatePath, revalidateTag } from 'next/cache'
import { GlobalAfterChangeHook } from 'payload'

export const revalidateSettings: GlobalAfterChangeHook = async ({ doc, req }) => {
  const pages = (await getCachedDocuments('pages', true)()) as Page[]

  revalidatePath('/', 'layout')
  for (const page of pages) {
    if (page.slug) {
      revalidatePath(`/${page.slug}`)
    }
  }
  revalidateTag('fonts-tag')
  revalidateTag('global_settings')
  return doc
}
