import { Block } from 'payload'

export const FaqBlock: Block = {
  slug: 'faqBlock',
  interfaceName: 'faqBlock',
  fields: [
    {
      name: 'faq',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
    },
  ],
  graphQL: {
    singularName: 'FaqBlock',
  },
}
