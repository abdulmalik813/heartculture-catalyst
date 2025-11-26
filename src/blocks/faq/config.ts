import { Block } from 'payload'

export const FaqBlock: Block = {
  slug: 'faqBlock',
  interfaceName: 'faqBlock',
  fields: [
    {
      name: 'accordionStyles',
      type: 'relationship',
      relationTo: 'styles',
      hasMany: true,
      label: 'Accordion Styles',
    },
    {
      name: 'itemStyles',
      type: 'relationship',
      relationTo: 'styles',
      hasMany: true,
      label: 'Item Styles',
    },
    {
      name: 'questionStyles',
      type: 'relationship',
      relationTo: 'styles',
      hasMany: true,
      label: 'Question Styles',
    },
    {
      name: 'answerStyles',
      type: 'relationship',
      relationTo: 'styles',
      hasMany: true,
      label: 'Answer Styles',
    },
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
