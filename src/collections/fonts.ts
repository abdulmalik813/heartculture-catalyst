import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

export const FontFiles: CollectionConfig = {
  slug: 'font-files',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    hidden: true,
    group: 'System',
  },
  fields: [
    {
      name: 'fontId',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The font family ID (e.g., "nunito")',
      },
    },
    {
      name: 'filename',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['font/woff2', 'font/woff', 'application/font-woff2', 'application/font-woff'],
  },
}