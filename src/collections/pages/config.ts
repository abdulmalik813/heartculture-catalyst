import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from 'payload'
import { revalidatePage, revalidateDelete, populatePublishedAt } from '@/collections/pages/hooks'
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
import { TableBlock } from '@/blocks/table/config'
import { LastModifiedBlock } from '@/blocks/last-modified/config'
import { grid } from '@/fields/grid'
import { TestimonialBlock } from '@/blocks/testimonial/config'
import { GalleryBlock } from '@/blocks/gallery/config'
import { HeadingBlock } from '@/blocks/heading/config'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'publishedAt', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data }) => generatePreviewPath(`${data?.slug}`),
    },
    preview: async (data) => {
      return generatePreviewPath(`${data?.slug}`)
    },
    listSearchableFields: ['title', 'slug'],
  },
  defaultPopulate: {
    title: true,
    slug: true,
    publishedAt: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
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
                          name: 'grid',
                          type: 'array',
                          fields: [
                            grid(),
                            {
                              name: 'blocks',
                              type: 'blocks',
                              blocks: [
                                ContentBlock,
                                CallToActionBlock,
                                CardBlock,
                                TabBlock,
                                AccordionBlock,
                                DividerBlock,
                                FormBlock,
                                TableBlock,
                                LastModifiedBlock,
                                TestimonialBlock,
                                GalleryBlock,
                                HeadingBlock
                              ],
                              required: false,
                            },
                          ],
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
