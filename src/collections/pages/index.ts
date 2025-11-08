import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from 'payload'
import { revalidatePage, revalidateDelete, populatePublishedAt } from './hooks'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { generatePreviewPath } from '@/lib/generate-preview-path'
import { hero } from '@/fields/hero'
import { ContentBlock } from '@/blocks/content/config'
import { CallToActionBlock } from '@/blocks/call-to-action/config'
import { CardBlock } from '@/blocks/card/config'
import { TabBlock } from '@/blocks/tab/config'
import { AccordionBlock } from '@/blocks/accordion/config'
import { DividerBlock } from '@/blocks/divider/config'
import { FormBlock } from '@/blocks/form/config'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [hero],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'array',
              fields: [
                {
                  type: 'tabs',
                  tabs: [
                    {
                      label: 'Content',
                      fields: [
                        {
                          name: 'blocks',
                          type: 'blocks',
                          blocks: [
                            ContentBlock,
                            CallToActionBlock,
                            CardBlock(false),
                            TabBlock(false),
                            AccordionBlock(false),
                            DividerBlock(false),
                            FormBlock(false),
                          ],
                          required: false,
                        },
                      ],
                    },
                    {
                      label: 'Styles',
                      fields: [
                        {
                          name: 'container',
                          type: 'checkbox',
                        },
                        {
                          name: 'gapSize',
                          type: 'select',
                          required: true,
                          defaultValue: 'medium',
                          options: [
                            {
                              label: 'None',
                              value: 'none',
                            },
                            {
                              label: 'Small',
                              value: 'small',
                            },
                            {
                              label: 'Medium',
                              value: 'medium',
                            },
                            {
                              label: 'Large',
                              value: 'large',
                            },
                            {
                              label: 'Extra Large',
                              value: 'xlarge',
                            },
                          ],
                        },
                        {
                          name: 'styles',
                          type: 'relationship',
                          relationTo: 'styles',
                          hasMany: true,
                          label: 'Layout Styles',
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
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
