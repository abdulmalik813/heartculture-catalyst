import type { Field, GroupField } from 'payload'
import deepMerge from '@/lib/deep-merge'
import { icon } from './icon'

type NavType = (options?: { overrides?: Partial<GroupField> }) => Field

const navFields: Field[] = [
  {
    type: 'collapsible',
    label: 'Link Configuration',
    admin: {
      initCollapsed: false,
    },
    fields: [
      {
        name: 'type',
        type: 'select',
        defaultValue: 'reference',
        label: 'Link Type',
        options: [
          { label: 'Internal Page', value: 'reference' },
          { label: 'Posts Page', value: 'postsPage' },
          { label: 'External URL', value: 'custom' },
        ],
        validate: async (value: any, { req }: any) => {
          if (value === 'postsPage') {
            const settings = await req.payload.findGlobal({
              slug: 'settings',
            })
            if (!settings?.enablePost) {
              return 'Posts must be enabled in settings to use Posts Page'
            }
          }
          return true
        },
      },
      {
        name: 'reference',
        type: 'relationship',
        admin: {
          condition: (_, data) => data?.type === 'reference',
        },
        relationTo: ['pages', 'posts'],
        filterOptions: async ({ req, relationTo }) => {
          const settings = await req.payload.findGlobal({
            slug: 'settings',
          })

          if (!settings?.enablePost && relationTo === 'posts') {
            return {
              id: {
                exists: false,
              },
            }
          }
          return true
        },
      },
      {
        name: 'postPageUrl',
        type: 'text',
        admin: {
          condition: () => false,
        },
        hooks: {
          beforeChange: [
            async ({ req, siblingData }) => {
              if (siblingData?.type === 'posts') {
                const settings = await req.payload.findGlobal({
                  slug: 'settings',
                })
                return settings?.postSlug || 'posts'
              }
              return undefined
            },
          ],
        },
      },
      {
        name: 'url',
        type: 'text',
        admin: {
          condition: (_, data) => data?.type === 'custom',
        },
        defaultValue: 'https://',
        label: 'URL',
        required: true,
      },
      {
        name: 'newTab',
        type: 'checkbox',
        label: 'Open in new tab',
      },
    ],
  },
]

export const navigation: NavType = ({ overrides = {} } = {}) =>
  deepMerge(
    {
      name: 'nav',
      type: 'group',
      label: 'Navigation',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Text to display',
          admin: {
            condition: (_, __, data) => {
              return data?.blockData?.text === undefined
            },
          },
        },
        {
          type: 'tabs',
          tabs: [
            {
              label: 'Link',
              fields: [
                {
                  name: 'appearance',
                  type: 'select',
                  defaultValue: 'link',
                  label: 'Display As',
                  options: [
                    { label: 'Text Link', value: 'link' },
                    { label: 'Button', value: 'button' },
                    { label: 'Dropdown Menu', value: 'dropdown' },
                  ],
                },
                {
                  name: 'link',
                  type: 'group',
                  label: false,
                  admin: {
                    condition: (_, siblingData) => siblingData?.appearance !== 'dropdown',
                  },
                  fields: navFields,
                },
                {
                  name: 'items',
                  type: 'array',
                  label: 'Dropdown Items',
                  fields: [
                    {
                      type: 'tabs',
                      tabs: [
                        {
                          label: 'Link',
                          fields: [
                            {
                              name: 'label',
                              type: 'text',
                              label: 'Label',
                              required: true,
                            },
                            ...navFields,
                          ],
                        },
                        {
                          label: 'Icon',
                          fields: icon(),
                        },
                      ],
                    },
                  ],
                  admin: {
                    condition: (_, siblingData) => siblingData?.appearance === 'dropdown',
                  },
                },
              ],
            },
            {
              label: 'Styling',
              fields: [
                {
                  type: 'collapsible',
                  label: 'Button Settings',
                  admin: {
                    condition: (_, siblingData) => siblingData?.appearance !== 'link',
                    initCollapsed: false,
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'buttonType',
                          type: 'select',
                          label: 'Button Style',
                          defaultValue: 'default',
                          admin: {
                            width: '50%',
                          },
                          options: [
                            { label: 'Primary', value: 'default' },
                            { label: 'Destructive', value: 'destructive' },
                            { label: 'Outline', value: 'outline' },
                            { label: 'Secondary', value: 'secondary' },
                            { label: 'Ghost', value: 'ghost' },
                            { label: 'Link Style', value: 'link' },
                          ],
                        },
                        {
                          name: 'buttonSize',
                          type: 'select',
                          label: 'Button Size',
                          defaultValue: 'default',
                          admin: {
                            width: '50%',
                          },
                          options: [
                            { label: 'Small', value: 'sm' },
                            { label: 'Medium', value: 'default' },
                            { label: 'Large', value: 'lg' },
                            { label: 'Icon', value: 'icon' },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'styles',
                  type: 'relationship',
                  relationTo: 'styles',
                  hasMany: true,
                  label: 'Appearance Styling',
                },
              ],
            },
            {
              label: 'Icon',
              fields: icon(),
            },
          ],
        },
      ],
    } as GroupField,
    overrides,
  )
