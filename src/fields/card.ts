import { Field } from 'payload'
import { defaultLexical } from './lexical-field'
import { navigation } from './navigation'
import { MediaBlock } from '@/blocks/media/config'
import { NavigationBlock } from '@/blocks/navigation/config'
import { TabBlock } from '@/blocks/tab/config'

export const card = (): Field[] => {
  return [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Configuration',
          fields: [
            {
              name: 'enableTitle',
              type: 'checkbox',
              label: 'Enable Title',
              defaultValue: true,
            },
            {
              name: 'enableAction',
              type: 'checkbox',
              label: 'Enable Action',
              defaultValue: false,
            },
            {
              name: 'enableDescription',
              type: 'checkbox',
              label: 'Enable Description',
              defaultValue: false,
            },
            {
              name: 'enableContent',
              type: 'checkbox',
              label: 'Enable Content',
              defaultValue: false,
            },
            {
              name: 'enableFooter',
              type: 'checkbox',
              label: 'Enable Footer',
              defaultValue: false,
            },
          ],
        },
        {
          label: 'Card',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Card Title',
              admin: {
                condition: (_, data) => data.enableTitle,
              },
            },
            {
              type: 'collapsible',
              label: 'Card Action',
              admin: {
                condition: (_, data) => data.enableAction,
              },
              fields: [
                {
                  name: 'action',
                  type: 'group',
                  required: true,
                  label: 'Action Details',
                  fields: [navigation()],
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              label: 'Card Description',
              admin: {
                condition: (_, data) => data.enableDescription,
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: defaultLexical({
                features: {
                  blocks: {
                    blocks: [MediaBlock, NavigationBlock, TabBlock()],
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
              label: 'Card Content',
              admin: {
                condition: (_, data) => data.enableContent,
              },
            },
            {
              name: 'footer',
              type: 'text',
              required: true,
              label: 'Card Footer',
              admin: {
                condition: (_, data) => data.enableFooter,
              },
            },
          ],
        },
        {
          label: 'Styles',
          fields: [
            {
              name: 'cardStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Card Container Styles',
            },
            {
              name: 'titleStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Title Styles',
              admin: {
                condition: (_, data) => data.enableTitle,
              },
            },
            {
              name: 'actionStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Action Styles',
              admin: {
                condition: (_, data) => data.enableAction,
              },
            },
            {
              name: 'descriptionStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Description Styles',
              admin: {
                condition: (_, data) => data.enableDescription,
              },
            },
            {
              name: 'contentStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Content Styles',
              admin: {
                condition: (_, data) => data.enableContent,
              },
            },
            {
              name: 'footerStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Footer Styles',
              admin: {
                condition: (_, data) => data.enableFooter,
              },
            },
          ],
        },
      ],
    },
  ]
}
