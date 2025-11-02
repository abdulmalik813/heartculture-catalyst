import { GroupField, Field, deepMerge } from "payload"

type ContainerType = (options?: { overrides?: Partial<GroupField> }) => Field

export const container: ContainerType = ({ overrides = {} } = {}) => {
    const containerResult: GroupField = {
        label: "Container",
        type: "group",
        fields: [
            {
                name: 'enableContainer',
                type: 'checkbox',
                label: 'Enable Container',
                defaultValue: true,
            },
            {
                name: 'containerSize',
                type: 'select',
                label: 'Container Size',
                defaultValue: 'full',
                options: [
                    {
                        label: 'Full Width',
                        value: 'full',
                    },
                    {
                        label: 'Two Thirds (2/3)',
                        value: 'two-thirds',
                    },
                    {
                        label: 'Half (1/2)',
                        value: 'half',
                    },
                    {
                        label: 'One Third (1/3)',
                        value: 'one-third',
                    },
                ],
            },
            {
                name: 'styles',
                type: 'relationship',
                relationTo: 'styles',
                hasMany: true,
                label: 'Container Styles',
            },
        ]
    }

    return deepMerge(containerResult, overrides)
}