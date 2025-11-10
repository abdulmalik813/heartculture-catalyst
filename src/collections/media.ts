import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'creditText',
      type: 'text',
    },

    {
      name: 'creator',
      type: 'text',
      required: false,
    },
    {
      name: 'license',
      type: 'select',
      options: [
        { label: 'MIT License', value: 'MIT' },
        { label: 'GNU General Public License (GPL)', value: 'GPL' },
        { label: 'Apache License', value: 'Apache' },
        { label: 'CC BY (Attribution)', value: 'CC_BY' },
        { label: 'CC BY-SA (Attribution-ShareAlike)', value: 'CC_BY_SA' },
        { label: 'CC BY-ND (Attribution-NoDerivs)', value: 'CC_BY_ND' },
        { label: 'CC BY-NC (Attribution-NonCommercial)', value: 'CC_BY_NC' },
        { label: 'CC0 (No Rights Reserved)', value: 'CC0' },
        { label: 'Proprietary', value: 'Proprietary' },
      ],
      required: false,
    },
    {
      name: 'copyrightNotice',
      type: 'text',
      required: false,
    },
    {
      name: 'acquireLicensePage',
      type: 'text',
      required: false,
    },
  ],
  upload: {
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
