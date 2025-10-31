import { Block } from 'payload'
import { defaultLexical } from '@/fields/lexical-field'
import { MediaBlock } from '@/blocks/media/config'
import { NavigationBlock } from '@/blocks/navigation'
import { container } from '@/fields/container'

export const ContentBlock: Block = {
  slug: 'contentBlock',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'enableContainer',
      type: 'checkbox',
      label: 'Enable Container',
    },
    {
      type: 'collapsible',
      label: 'Content',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'content',
          type: 'richText',
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
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'ContentBlock',
  },
}
