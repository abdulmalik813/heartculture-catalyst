import type { TextFieldSingleValidation } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  lexicalEditor,
  UnderlineFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  InlineCodeFeature,
  HeadingFeature,
  AlignFeature,
  IndentFeature,
  UnorderedListFeature,
  OrderedListFeature,
  ChecklistFeature,
  BlockquoteFeature,
  UploadFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  FixedToolbarFeature,
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
  TextStateFeature,
  type LinkFields,
} from '@payloadcms/richtext-lexical'
import { TagBlock } from '@/blocks/lexical/tag-block/config'

export const defaultLexical = lexicalEditor({
  features: [
    // Basic text formatting
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    InlineCodeFeature(),

    // Headings
    HeadingFeature({
      enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    }),

    // Alignment and indentation
    AlignFeature(),
    IndentFeature(),

    // Lists
    UnorderedListFeature(),
    OrderedListFeature(),
    ChecklistFeature(),

    // Links with custom configuration
    LinkFeature({
      enabledCollections: ['pages'],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ('name' in field && field.name === 'url') return false
          return true
        })

        return [
          ...defaultFieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            label: 'URL',
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
            },
            required: true,
            validate: ((value, options) => {
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                return true
              }
              return value ? true : 'URL is required'
            }) as TextFieldSingleValidation,
          },
        ]
      },
    }),

    // Block elements
    BlockquoteFeature(),
    HorizontalRuleFeature(),

    // Uploads
    UploadFeature({
      enabledCollections: ['media'],
    }),

    // Toolbars
    InlineToolbarFeature(),
    FixedToolbarFeature(),

    // Advanced features
    BlocksFeature({
      blocks: [],
      inlineBlocks: [TagBlock],
    }),

    // Table support (experimental)
    EXPERIMENTAL_TableFeature(),

    // Text State Feature - Colors and Highlights
    TextStateFeature({
      state: {
        color: {
          'color-primary': { 
            label: 'Primary Color', 
            css: { color: 'hsl(var(--primary))' } 
          },
          'color-secondary': { 
            label: 'Secondary Color', 
            css: { color: 'hsl(var(--secondary))' } 
          },
          'color-accent': { 
            label: 'Accent Color', 
            css: { color: 'hsl(var(--accent))' } 
          },
          'color-muted': { 
            label: 'Muted Color', 
            css: { color: 'hsl(var(--muted))' } 
          },
          'color-destructive': { 
            label: 'Destructive Color', 
            css: { color: 'hsl(var(--destructive))' } 
          },
        },
        highlight: {
          'highlight-primary': {
            label: 'Primary Highlight',
            css: {
              'background-color': 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            },
          },
          'highlight-secondary': {
            label: 'Secondary Highlight',
            css: {
              'background-color': 'hsl(var(--secondary))',
              color: 'hsl(var(--secondary-foreground))',
            },
          },
          'highlight-accent': {
            label: 'Accent Highlight',
            css: {
              'background-color': 'hsl(var(--accent))',
              color: 'hsl(var(--accent-foreground))',
            },
          },
          'highlight-muted': {
            label: 'Muted Highlight',
            css: { 
              'background-color': 'hsl(var(--muted))', 
              color: 'hsl(var(--muted-foreground))' 
            },
          },
          'highlight-destructive': {
            label: 'Destructive Highlight',
            css: {
              'background-color': 'hsl(var(--destructive))',
              color: 'hsl(var(--destructive-foreground))',
            },
          },
        },
      },
    }),
  ],
})