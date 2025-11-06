import { grid } from '@/fields/grid'
import { defaultLexical } from '@/fields/lexical-field'
import type { Block } from 'payload'

export const FormBlock = (disableGrid: boolean = true): Block => ({
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  fields: [
    ...(disableGrid ? [] : [grid()]),
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'enableDescription',
      type: 'checkbox',
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        condition: (_, { enableDescription }) => Boolean(enableDescription),
      },
      editor: defaultLexical(),
    },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
})
