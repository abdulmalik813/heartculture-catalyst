import { Setting } from '@/payload-types'
import { revalidateTag, revalidatePath } from 'next/cache'
import { getCachedGlobal } from './get-globals'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function revalidateAll() {
  const payload = await getPayload({ config })

  revalidateTag('redirects')
  revalidateTag('pages-sitemap')
  revalidateTag('posts-sitemap')
  revalidateTag('styles-tag')
  revalidateTag('fonts-tag')
  revalidateTag('global_navigationBar')
  revalidateTag('global_footer')
  revalidateTag('global_settings')
  revalidateTag('global_social')

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
