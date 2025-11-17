import { Setting } from '@/payload-types'
import { revalidateTag, revalidatePath } from 'next/cache'
import { getCachedGlobal } from '@/lib/get-globals'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function revalidateAll() {
  const payload = await getPayload({ config })

  const collections = payload.config.collections
  for (const collection of collections) {
    revalidateTag(`collection_${collection.slug}`)
  }

  const globals = payload.config.globals
  for (const global of globals) {
    revalidateTag(`global_${global.slug}`)
  }
  
  revalidateTag('redirects')
  revalidateTag('pages_sitemap')
  revalidateTag('posts_sitemap')
  revalidateTag('fonts_tag')

  const pages = await payload.find({
    collection: 'pages',
    limit: 1000,
  })
  revalidatePath('/')
  pages.docs.forEach((page) => revalidatePath('/' + page.slug))

  const posts = await payload.find({
    collection: 'posts',
    limit: 1000,
  })

  const postSlug = ((await getCachedGlobal('settings')) as Setting).postSlug
  revalidatePath(`/${postSlug}`)
  posts.docs.forEach((post) => revalidatePath(`/${postSlug}/${post.slug}`))
  payload.logger.info('Site Revalidation Complete')
}
