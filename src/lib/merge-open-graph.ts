import type { Metadata } from 'next'
import { getServerSideURL } from './get-url'
import { OPENGRAPH } from '@/constants/init'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: OPENGRAPH.DEFAULT_DESCRIPTION,
  images: [
    {
      url: getServerSideURL() + OPENGRAPH.DEFAULT_IMAGE_URL,
    },
  ],
  siteName: OPENGRAPH.SITE_NAME,
  title: OPENGRAPH.DEFAULT_TITLE,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
