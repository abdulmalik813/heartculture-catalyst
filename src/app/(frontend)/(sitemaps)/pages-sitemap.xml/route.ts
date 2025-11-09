import { getServerSideSitemap, ISitemapField } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getServerSideURL } from '@/lib/get-url'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const dateFallback = new Date().toISOString()
    const sitemap: ISitemapField[] = []

    try {
      const pages = await payload.find({
        collection: 'pages',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      })

      if (pages.docs && pages.docs.length > 0) {
        pages.docs
          .filter((page) => Boolean(page?.slug))
          .forEach((page) => {
            sitemap.push({
              loc: page?.slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${page.slug}`,
              lastmod: page.updatedAt || dateFallback,
            })
          })
      }
    } catch (error) {
      console.error('Error fetching pages for sitemap:', error)
    }

    return sitemap
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  try {
    const sitemap = await getPagesSitemap()
    return getServerSideSitemap(sitemap)
  } catch (error) {
    console.error('Error in sitemap GET handler:', error)
    
    const SITE_URL = getServerSideURL()
    return getServerSideSitemap([
      {
        loc: SITE_URL,
        lastmod: new Date().toISOString(),
      },
    ])
  }
}