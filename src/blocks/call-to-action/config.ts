import { Block } from 'payload'
import { media } from '@/fields/media'
import { grid } from '@/fields/grid'
import { card } from '@/fields/card'

export const CallToActionBlock: Block = {
  slug: 'callToActionBlock',
  interfaceName: 'CallToActionBlock',
  dbName: 'cta',
  fields: [
    grid(),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'card',
              type: 'group',
              fields: card()
            }
          ],
        },
        {
          label: 'Media',
          fields: media,
        }
      ],
    },
  ],
  graphQL: {
    singularName: 'CallToActionBlock',
  },
}
