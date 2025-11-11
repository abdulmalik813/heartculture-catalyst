import { Block } from 'payload'
import { defaultLexical } from '@/fields/lexical-field'
import { MediaBlock } from '@/blocks/media/config'
import { NavigationBlock } from '@/blocks/navigation/config'
import { defaultLexicalValue } from '@/constants/default-lexical'
import { AccordionBlock } from '@/blocks/accordion/config'
import { TestimonialBlock } from '@/blocks/testimonial/config'

export const TabBlock: Block = {
  slug: 'tabBlock',
  interfaceName: 'TabBlock',
  dbName: 'tab',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
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
                                blocks: [MediaBlock, NavigationBlock, AccordionBlock, TestimonialBlock],
                                inlineBlocks: [MediaBlock, NavigationBlock],
                              },
                            },
                          }),
                          defaultValue: defaultLexicalValue,
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
        },
        {
          label: 'Styles',
          fields: [
            {
              name: 'tabStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
            },
            {
              name: 'tabListStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
            },
          ],
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'TabBlock',
  },
}
