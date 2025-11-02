import { Block } from 'payload'
import { grid } from '@/fields/grid'
import { defaultLexical } from '@/fields/lexical-field'
import { MediaBlock } from '../media/config'
import { NavigationBlock } from '../navigation/config'

export const TabBlock = (disableGrid: boolean = true): Block => ({
  slug: 'tabBlock',
  interfaceName: 'TabBlock',
  dbName: 'tab',
  fields: [
    ...(disableGrid ? [] : [grid()]),
    {
      name: 'tabs',
      type: 'array',
      label: 'Tabs',
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
                  label: 'Tab Title',
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
                  defaultValue: {
                    root: {
                      children: [
                        {
                          children: [],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'paragraph',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'root',
                      version: 1,
                    },
                  },
                  label: 'Tab Content',
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
    singularName: 'TabBlockTabBlock',
  },
})
