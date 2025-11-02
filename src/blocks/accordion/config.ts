import { Block } from 'payload'
import { grid } from '@/fields/grid'
import { defaultLexical } from '@/fields/lexical-field'
import { MediaBlock } from '../media/config'
import { NavigationBlock } from '../navigation/config'
import { defaultLexicalValue } from '@/constants/default-lexical'

export const AccordionBlock = (disableGrid: boolean = true): Block => ({
  slug: 'accordionBlock',
  interfaceName: 'AccordionBlock',
  dbName: 'accordion',
  fields: [
    ...(disableGrid ? [] : [grid()]),
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      minRows: 1,
      required: true,
      fields: [
        {
          type: 'tabs',
          tabs: [
            {
              label: 'Content',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Title',
                },
                {
                  name: 'content',
                  type: 'richText',
                  required: true,
                  editor: defaultLexical({
                    features: {
                      blocks: {
                        blocks: [MediaBlock, NavigationBlock],
                        inlineBlocks: [MediaBlock, NavigationBlock],
                      },
                    },
                  }),
                  defaultValue: defaultLexicalValue,
                  label: 'Content',
                },
              ],
            },
            {
              label: 'Styles',
              fields: [
                {
                  name: 'titleStyles',
                  type: 'relationship',
                  relationTo: 'styles',
                  hasMany: true,
                  label: 'Title Styles',
                },
                {
                  name: 'contentStyles',
                  type: 'relationship',
                  relationTo: 'styles',
                  hasMany: true,
                  label: 'Content Styles',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'AccordionBlockAccordionBlock',
  },
})
