import { Field } from 'payload'

export const media: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'media',
        type: 'relationship',
        relationTo: 'media',
        admin: {
          width: '33%',
        },
      },
      {
        name: 'wrapperStyles',
        type: 'relationship',
        relationTo: 'styles',
        hasMany: true,
        admin: {
          width: '33%',
        },
      },
      {
        name: 'contentStyles',
        type: 'relationship',
        relationTo: 'styles',
        hasMany: true,
        admin: {
          width: '33%',
        },
      },
    ],
  },
]