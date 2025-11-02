import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0, draft: boolean) {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    draft
  })

  return global
}

async function getGlobalVersion(slug: Global) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.findGlobalVersions({
    slug: slug,
    limit: 1,
    sort: '-createdAt',
    select: {
      version: {
        id: true
      }
    }
  })
  return result.docs[0]?.id
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (
  slug: Global,
  depth = 0,
  draft = false
) => {
  return draft
    ? getGlobal(slug, depth, draft)
    : unstable_cache(async () => getGlobal(slug, depth, draft), [slug], {
        tags: [`global_${slug}`],
      })()
}

export const getCachedGlobalVersion = (slug: Global, draft = false) => {
  return draft 
    ? getGlobalVersion(slug)
    : unstable_cache(async () => getGlobalVersion(slug), [slug], {
        tags: [`global_version_${slug}`],
      })()
}