import { media } from '@/fields/media'
import { Block } from 'payload'

export const ImageCarouselBlock = (dbPrefix: string = ''): Block => ({
  slug: 'imageCarouselBlock',
  interfaceName: 'imageCarouselBlock',
  dbName: `${dbPrefix}imageCarousel`,
  fields: [
    {
      name: 'medias',
      type: 'array',
      fields: media,
    },
  ],
  graphQL: {
    singularName: 'ImageCarouselBlock',
  },
})
