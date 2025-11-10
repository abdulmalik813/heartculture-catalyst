import { Block } from 'payload'

export const LastModifiedBlock: Block = {
  slug: 'lastModifiedBlock',
  interfaceName: 'LastModifiedBlock',
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
  graphQL: {
    singularName: 'LastModifiedBlock',
  },
}
