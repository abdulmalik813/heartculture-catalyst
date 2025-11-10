import { Block } from 'payload'
import { card } from '@/fields/card'

export const CardBlock: Block = {
  slug: 'cardBlock',
  interfaceName: 'CardBlock',
  dbName: 'card',
  fields: card(),
  graphQL: {
    singularName: 'CardBlock',
  },
}