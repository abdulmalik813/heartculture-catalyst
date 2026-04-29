import {
  CollectionBeforeChangeHook,
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload'
import type { Style } from '@/payload-types'
import { revalidateTag } from 'next/cache'
import { globalCSS } from '@/constants/global-css'
import { TAILWIND_GENERATOR } from '@/constants/init'

export const generateStylesheet: CollectionBeforeChangeHook<Style> = async ({ data }) => {
  if (data.tailwind !== false) {
    try {
      const response = await fetch(TAILWIND_GENERATOR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: data.className,
          inputCss: globalCSS,
          title: data.alias,
        }),
      })
      data.stylesheet = await response.text()
    } catch (error) {
      console.error('Error generating Tailwind CSS:', error)
    }
  }
  return data
}

export const revalidateCache: CollectionAfterChangeHook<Style> = async ({ doc }) => {
  revalidateTag('collection_styles', 'max')
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Style> = async () => {
  revalidateTag('collection_styles', 'max')
}
