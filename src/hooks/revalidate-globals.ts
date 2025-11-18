import { revalidateAll } from '@/lib/revalidate'
import { Style } from '@/payload-types'
import { revalidateTag } from 'next/cache'
import { GlobalAfterChangeHook } from 'payload'

export const revalidateSettings: GlobalAfterChangeHook = async ({ doc, req }) => {
  const additionalFonts = doc.additionalFonts || []
  const activeFontFileIds = new Set()

  if (doc.defaultFont?.fontData?.fontFileIds) {
    doc.defaultFont.fontData.fontFileIds.forEach((id: string) => {
      activeFontFileIds.add(id)
    })
  }

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
    if (font?.fontData?.fontFileIds) {
      font.fontData.fontFileIds.forEach((id: string) => {
        activeFontFileIds.add(id)
      })
    }

    if (font?.title != null && font?.title?.trim() !== '') {
      const className = `font-${font.id}`
      const existingStyle = existingStyles.docs.find((style) => style.className === className)

      if (!existingStyle) {
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

  const allFontFiles = await req.payload.find({
    collection: 'font-files',
    limit: 1000,
  })

  const orphanedFontFiles = allFontFiles.docs.filter((file) => {
    return !activeFontFileIds.has(file.id)
  })

  for (const file of orphanedFontFiles) {
    await req.payload.delete({
      collection: 'font-files',
      id: file.id,
    })
  }

  const fontStyles = existingStyles.docs.filter((style: Style) =>
    style.className.startsWith('font-'),
  )

  const orphanedFontStyles = fontStyles.filter((style: Style) => {
    const styleId = style.className.replace('font-', '')
    return !currentFontIds.has(styleId)
  })

  for (const style of orphanedFontStyles) {
    await req.payload.delete({
      collection: 'styles',
      id: style.id,
    })
  }

  if (doc._status === 'draft') {
    return doc
  }
  
  await revalidateAll()
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

export const revalidateSocial: GlobalAfterChangeHook = async ({ doc }) => {
  if (doc._status === 'draft') {
    return doc
  }

  revalidateTag('global_social')
  return doc
}