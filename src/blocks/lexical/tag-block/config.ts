import { Block } from 'payload'

export const TagBlock: Block = {
  slug: 'tagBlock',
  interfaceName: 'tagBlock',
  fields: [
    {
      name: 'tag',
      type: 'text',
      label: 'HTML Tag',
      required: true,
    },
    {
      name: 'location',
      type: 'radio',
      options: [
        {
          label: 'Start',
          value: 'start',
        },
        {
          label: 'End',
          value: 'end',
        },
      ],
      defaultValue: 'start',
      required: true,
      admin: {
        layout: 'horizontal',
      },
    },
    {
      name: 'styles',
      type: 'relationship',
      relationTo: 'styles',
      admin: {
        condition: (_, siblingData) => siblingData.location === 'start',
      },
      hasMany: true,
    },
  ],
  graphQL: {
    singularName: 'TagBlock',
  },
}
