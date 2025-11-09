import { grid } from '@/fields/grid'
import { Block } from 'payload'
import { animate } from '@/fields/animate'

export const LastModifiedBlock: Block = {
  slug: 'lastModifiedBlock',
  interfaceName: 'LastModifiedBlock',
  dbName: 'last_modified',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Layout',
          fields: [grid()],
        },
        {
          label: 'Styles',
          fields: [
            {
              name: 'cardStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
            },
            {
              name: 'cardContentStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Animation',
          fields: [animate()],
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'LastModifiedBlock',
  },
}
