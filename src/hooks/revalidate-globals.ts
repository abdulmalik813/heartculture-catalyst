import { getCachedDocuments } from '@/lib/get-document'
import { Page } from '@/payload-types'
import { revalidatePath, revalidateTag } from 'next/cache'
import { GlobalAfterChangeHook } from 'payload'

export const revalidateSettings: GlobalAfterChangeHook = async ({ doc, req }) => {
  const additionalFonts = doc.additionalFonts || []
  const existingStyles = await req.payload.find({
    collection: 'styles',
    where: {
      className: {
        like: 'font-%',
      },
    },
    limit: 1000,
  })

  const currentFontIds = new Set(additionalFonts.map((font: any) => font.id))

  for (const font of additionalFonts) {
    if (font?.title != null || font?.title?.trim() != '') {
      const className = `font-${font.id}`
      const existingStyle = existingStyles.docs.find((style) => style.className === className)

      if (existingStyle) {
        if (existingStyle.alias !== font.title) {
          await req.payload.update({
            collection: 'styles',
            id: existingStyle.id,
            data: {
              alias: font.title,
            },
          })
        }
      } else {
        await req.payload.create({
          collection: 'styles',
          data: {
            alias: font.title,
            className: className,
            tailwind: false,
            stylesheet: '',
          },
        })
      }
    }
  }
  for (const style of existingStyles.docs) {
    const styleId = style.className.replace('font-', '')
    if (!currentFontIds.has(styleId)) {
      await req.payload.delete({
        collection: 'styles',
        id: style.id,
      })
    }
  }

  if (doc._status === 'draft') {
    return doc
  }

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

export const revalidateNavBar: GlobalAfterChangeHook = async ({ doc }) => {
  if (doc._status === 'draft') {
    return doc
  }

  revalidateTag('global_navigationBar')
  return doc
}

export const revalidateFooter: GlobalAfterChangeHook = async ({ doc }) => {
  if (doc._status === 'draft') {
    return doc
  }

  revalidateTag('global_footer')
  return doc
}
