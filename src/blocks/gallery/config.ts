import { Block } from 'payload'

export const GalleryBlock: Block = {
    slug: 'galleryBlock',
    interfaceName: 'GalleryBlock',
    fields: [
        {
            name: 'gallery',
            type: 'array',
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
            ],
        },
    ],
    graphQL: {
        singularName: 'GalleryBlock',
    },
}