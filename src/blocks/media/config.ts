import { media } from '@/fields/media'
import { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'mediaBlock',
  fields: media,
  graphQL: {
    singularName: 'MediaBlock',
  },
}