import { Block } from 'payload'
import { defaultLexical } from '@/fields/lexical-field'
import { MediaBlock } from '@/blocks/media/config'
import { NavigationBlock } from '@/blocks/navigation/config'
import { grid } from '@/fields/grid'
import { TabBlock } from '@/blocks/tab/config'
import { CardBlock } from '@/blocks/card/config'
import { DividerBlock } from '@/blocks/divider/config'

export const ContentBlock: Block = {
  slug: 'contentBlock',
  interfaceName: 'ContentBlock',
  fields: [
    grid(),
    {
      type: 'collapsible',
      label: 'Content',
      fields: [
        {
          name: 'contentStyles',
          type: 'relationship',
          relationTo: 'styles',
          hasMany: true,
        },
        {
          name: 'content',
          type: 'richText',
          editor: defaultLexical({
            features: {
              blocks: {
                blocks: [MediaBlock, NavigationBlock, TabBlock(), CardBlock(), DividerBlock()],
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
