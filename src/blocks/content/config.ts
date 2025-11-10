import { Block } from 'payload'
import { defaultLexical } from '@/fields/lexical-field'
import { MediaBlock } from '@/blocks/media/config'
import { NavigationBlock } from '@/blocks/navigation/config'
import { TabBlock } from '@/blocks/tab/config'
import { CardBlock } from '@/blocks/card/config'
import { AccordionBlock } from '@/blocks/accordion/config'
import { DividerBlock } from '@/blocks/divider/config'
import { defaultLexicalValue } from '@/constants/default-lexical'
import { FormBlock } from '../form/config'
import { TableBlock } from '../table/config'
import { animate } from '@/fields/animate'

export const ContentBlock: Block = {
  slug: 'contentBlock',
  interfaceName: 'ContentBlock',
  fields: [
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
                blocks: [
                  MediaBlock,
                  NavigationBlock,
                  TabBlock,
                  CardBlock,
                  AccordionBlock,
                  DividerBlock,
                  FormBlock,
                  TableBlock,
                ],
                inlineBlocks: [NavigationBlock],
              },
            },
          }),
          defaultValue: defaultLexicalValue,
        },
      ],
    },
    {
      label: 'Animate',
      type: 'collapsible',
      admin: {
        initCollapsed: true
      },
      fields: [animate()],
    },
  ],
  graphQL: {
    singularName: 'ContentBlock',
  },
}
