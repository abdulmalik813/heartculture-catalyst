import { navigation } from '@/fields/navigation'
import { Block } from 'payload'

export const TestimonialBlock: Block = {
  slug: 'testimonialBlock',
  interfaceName: 'testimonialBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'carousel',
      options: [
        {
          label: 'Carousel',
          value: 'carousel',
        },
        {
          label: 'Grid',
          value: 'grid',
        },
      ],
    },
    {
      name: 'testimonialStyles',
      type: 'relationship',
      relationTo: 'styles',
      hasMany: true,
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      required: true,
      hasMany: true,
      label: 'Testimonials',
    },
    navigation({
      overrides: {
        admin: {
          condition: (_, data) => data.type == "carousel"
        }
      }
    }),
  ],
  graphQL: {
    singularName: 'TestimonialBlock',
  },
}
