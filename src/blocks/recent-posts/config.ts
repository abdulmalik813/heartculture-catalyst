import { Block } from 'payload'
import { animate } from '@/fields/animate'

export const RecentPostsBlock: Block = {
  slug: 'recentPostsBlock',
  interfaceName: 'RecentPostsBlock',
  dbName: 'recent_posts',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Layout',
          fields: [
            {
              name: 'enableTitle',
              type: 'checkbox',
              label: 'Enable Title',
              defaultValue: true,
            },
            {
              name: 'numberOfPosts',
              type: 'number',
              label: 'Number of Posts',
              defaultValue: 5,
              required: true,
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Card Title',
              admin: {
                condition: (_, data) => data.enableTitle,
              },
            },
          ],
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
              name: 'titleStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              admin: {
                condition: (_, data) => data.enableTitle,
              },
            },
            {
              name: 'contentStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
            },
            {
              name: 'linkStyles',
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
    singularName: 'RecentPostsBlock',
  },
}
