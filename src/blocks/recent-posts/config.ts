import { grid } from '@/fields/grid'
import { Block } from 'payload'

export const RecentPostsBlock: Block = {
  slug: 'recentPostsBlock',
  interfaceName: 'RecentPostsBlock',
  dbName: 'recent_posts',
  fields: [
    grid(),
    {
      name: 'numberOfPosts',
      type: 'number',
      label: 'Number of Posts',
      defaultValue: 5,
      required: true,
    },
  ],
  graphQL: {
    singularName: 'RecentPostsBlock',
  },
}
