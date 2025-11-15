import { navigation } from '@/fields/navigation'
import { Block } from 'payload'

export const GalleryBlock: Block = {
  slug: 'galleryBlock',
  interfaceName: 'GalleryBlock',
  fields: [
    {
      name: 'format',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Grid',
          value: 'grid',
        },
        {
          label: 'Carousel',
          value: 'carousel',
        },
        {
          label: 'Focus',
          value: 'focus',
        },
      ],
    },
    navigation({
      overrides: {
        admin: {
          condition: (_, siblingData) => siblingData.format === 'focus',
        },
      },
    }),
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'GalleryBlock',
  },
}
