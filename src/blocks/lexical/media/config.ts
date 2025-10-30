import { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'mediaBlock',
  fields: [
    {
      name: 'media',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'wrapperStyles',
      type: 'relationship',
      relationTo: 'styles',
      hasMany: true,
    },
    {
      name: 'contentStyles',
      type: 'relationship',
      relationTo: 'styles',
      hasMany: true,
    },
  ],
  graphQL: {
    singularName: 'MediaBlock',
  },
}
