import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook } from 'payload'

export const revalidateCollection: CollectionAfterChangeHook = async ({ doc, collection }) => {
  revalidateTag(`collection_${collection.slug}`, 'max')
  return doc
}
