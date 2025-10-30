import { navigation } from '@/fields/navigation'
import { Block } from 'payload'

export const NavigationBlock: Block = {
  slug: 'navigationBlock',
  interfaceName: 'navigationBlock',
  fields: [
    navigation()
  ],
  graphQL: {
    singularName: 'NavigationBlock',
  },
}
