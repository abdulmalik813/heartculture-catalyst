import { GroupField, Field, deepMerge } from "payload"

type IconType = (options?: { overrides?: Partial<GroupField> }) => Field

export const icon: IconType = ({ overrides = {} } = {}) => {
    const iconResult: GroupField = {
        label: "Icon",
        type: "group",
        fields: [
            {
                name: 'icon',
                type: 'relationship',
                relationTo: 'icons',
                label: 'Icon',
            },
            {
                type: 'row',
                fields: [
                    {
                        name: 'placement',
                        type: 'select',
                        defaultValue: 'before',
                        options: [
                            { label: 'Before', value: 'before' },
                            { label: 'After', value: 'after' }
                        ],
                        label: 'Position',
                        admin: {
                            width: '50%',
                        },
                    },
                    {
                        name: 'iconStyles',
                        type: 'relationship',
                        relationTo: 'styles',
                        hasMany: true,
                        label: 'Icon Styles',
                        admin: {
                            width: '50%',
                        },
                    },
                ],
            },
        ]
    }

    return deepMerge(iconResult, overrides)
}