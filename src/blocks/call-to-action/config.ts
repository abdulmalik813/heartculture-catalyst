import { Block } from 'payload'
import { media } from '@/fields/media'
import { card } from '@/fields/card'

export const CallToActionBlock: Block = {
  slug: 'callToActionBlock',
  interfaceName: 'CallToActionBlock',
  dbName: 'cta',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'card',
              type: 'group',
              fields: card(),
            },
            {
              name: 'backgroundStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Media',
          fields: media,
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'CallToActionBlock',
  },
}
