import { revalidateSocial } from '@/hooks/revalidate-globals'
import { GlobalConfig } from 'payload'

const Social: GlobalConfig = {
  slug: 'social',
  label: 'Social Media',
  fields: [
    {
      name: 'facebook',
      label: 'Facebook URL',
      type: 'text',
      required: false,
    },
    {
      name: 'instagram',
      label: 'Instagram URL',
      type: 'text',
      required: false,
    },
    {
      name: 'x',
      label: 'X (formerly Twitter) URL',
      type: 'text',
      required: false,
    },
    {
      name: 'linkedin',
      label: 'LinkedIn URL',
      type: 'text',
      required: false,
    },
  ],
  hooks: {
    afterChange: [revalidateSocial],
  },
}

export default Social
