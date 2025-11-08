import { Field } from 'payload'

export const animate = (): Field => {
  return {
    name: 'animate',
    type: 'group',
    label: 'Animation',
    fields: [
      {
        name: 'type',
        type: 'select',
        defaultValue: 'none',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Fade In', value: 'fadeIn' },
          { label: 'Slide Up', value: 'slideUp' },
          { label: 'Slide Down', value: 'slideDown' },
          { label: 'Slide Left', value: 'slideLeft' },
          { label: 'Slide Right', value: 'slideRight' },
        ],
        label: 'Animation Type',
        admin: {
          description: 'Choose an animation effect',
        },
      },
      {
        type: 'row',
        fields: [
          {
            name: 'duration',
            type: 'number',
            defaultValue: 0.5,
            min: 0.1,
            max: 3,
            label: 'Duration (seconds)',
            admin: {
              width: '50%',
              description: 'Animation duration',
            },
          },
          {
            name: 'delay',
            type: 'number',
            defaultValue: 0,
            min: 0,
            max: 2,
            label: 'Delay (seconds)',
            admin: {
              width: '50%',
              description: 'Delay before animation starts',
            },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'animateOnScroll',
            type: 'checkbox',
            defaultValue: true,
            label: 'Animate on Scroll',
            admin: {
              width: '50%',
              description: 'Trigger when element enters viewport',
            },
          },
          {
            name: 'animateOnce',
            type: 'checkbox',
            defaultValue: true,
            label: 'Animate Once',
            admin: {
              width: '50%',
              description: 'Only animate first time (uncheck to re-animate)',
              condition: (data, siblingData) => siblingData?.animateOnScroll === true,
            },
          },
        ],
      },
      {
        name: 'viewportAmount',
        type: 'number',
        defaultValue: 0.3,
        min: 0,
        max: 1,
        label: 'Viewport Amount',
        admin: {
          description: 'How much of element must be visible to trigger (0-1)',
          condition: (data, siblingData) => siblingData?.animateOnScroll === true,
        },
      },
    ],
  }
}