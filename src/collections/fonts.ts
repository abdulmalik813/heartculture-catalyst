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
    },
    {
      name: 'filename',
      type: 'text',
    },
  ],
  upload: true,
}