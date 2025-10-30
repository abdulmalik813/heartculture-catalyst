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
  HorizontalRuleFeature,
  InlineToolbarFeature,
  FixedToolbarFeature,
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
  type LinkFields,
  type LexicalEditorProps,
} from '@payloadcms/richtext-lexical'
import deepMerge from '@/lib/deep-merge'
import { navigation } from './navigation'

type FeatureConfig = {
  paragraph?: boolean | Parameters<typeof ParagraphFeature>[0]
  bold?: boolean | Parameters<typeof BoldFeature>[0]
  italic?: boolean | Parameters<typeof ItalicFeature>[0]
  underline?: boolean | Parameters<typeof UnderlineFeature>[0]
  strikethrough?: boolean | Parameters<typeof StrikethroughFeature>[0]
  subscript?: boolean | Parameters<typeof SubscriptFeature>[0]
  superscript?: boolean | Parameters<typeof SuperscriptFeature>[0]
  inlineCode?: boolean | Parameters<typeof InlineCodeFeature>[0]
  heading?: boolean | Parameters<typeof HeadingFeature>[0]
  align?: boolean | Parameters<typeof AlignFeature>[0]
  indent?: boolean | Parameters<typeof IndentFeature>[0]
  unorderedList?: boolean | Parameters<typeof UnorderedListFeature>[0]
  orderedList?: boolean | Parameters<typeof OrderedListFeature>[0]
  checklist?: boolean | Parameters<typeof ChecklistFeature>[0]
  link?: boolean | Parameters<typeof LinkFeature>[0]
  blockquote?: boolean | Parameters<typeof BlockquoteFeature>[0]
  horizontalRule?: boolean | Parameters<typeof HorizontalRuleFeature>[0]
  inlineToolbar?: boolean | Parameters<typeof InlineToolbarFeature>[0]
  fixedToolbar?: boolean | Parameters<typeof FixedToolbarFeature>[0]
  blocks?: boolean | Parameters<typeof BlocksFeature>[0]
  table?: boolean | Parameters<typeof EXPERIMENTAL_TableFeature>[0]
}

type LexicalEditorType = (options?: {
  overrides?: Partial<LexicalEditorProps>
  features?: FeatureConfig
}) => ReturnType<typeof lexicalEditor>

export const defaultLexical: LexicalEditorType = ({ overrides = {}, features = {} } = {}) => {
  // Default configurations for each feature
  const defaultFeatures: FeatureConfig = {
    paragraph: true,
    bold: true,
    italic: true,
    underline: true,
    strikethrough: true,
    subscript: true,
    superscript: true,
    inlineCode: true,
    heading: {
      enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    align: true,
    indent: true,
    unorderedList: true,
    orderedList: true,
    checklist: true,
    link: {
      enabledCollections: ['pages'],
      fields: ({ defaultFields }) => {
        return [
          defaultFields[0],
          navigation()
        ]
      },
    },
    blockquote: true,
    horizontalRule: true,
    inlineToolbar: true,
    fixedToolbar: true,
    blocks: {
      blocks: [],
      inlineBlocks: [],
    },
    table: true,
  }

  // Merge default features with user-provided features
  const mergedFeatures = deepMerge(defaultFeatures, features)

  const enabledFeatures: any[] = []

  // Helper function to add feature if not false
  const addFeature = (config: any, Feature: any) => {
    if (config === false) return
    enabledFeatures.push(config === true ? Feature() : Feature(config))
  }

  // Build features array
  addFeature(mergedFeatures.paragraph, ParagraphFeature)
  addFeature(mergedFeatures.bold, BoldFeature)
  addFeature(mergedFeatures.italic, ItalicFeature)
  addFeature(mergedFeatures.underline, UnderlineFeature)
  addFeature(mergedFeatures.strikethrough, StrikethroughFeature)
  addFeature(mergedFeatures.subscript, SubscriptFeature)
  addFeature(mergedFeatures.superscript, SuperscriptFeature)
  addFeature(mergedFeatures.inlineCode, InlineCodeFeature)
  addFeature(mergedFeatures.heading, HeadingFeature)
  addFeature(mergedFeatures.align, AlignFeature)
  addFeature(mergedFeatures.indent, IndentFeature)
  addFeature(mergedFeatures.unorderedList, UnorderedListFeature)
  addFeature(mergedFeatures.orderedList, OrderedListFeature)
  addFeature(mergedFeatures.checklist, ChecklistFeature)
  addFeature(mergedFeatures.link, LinkFeature)
  addFeature(mergedFeatures.blockquote, BlockquoteFeature)
  addFeature(mergedFeatures.horizontalRule, HorizontalRuleFeature)
  addFeature(mergedFeatures.inlineToolbar, InlineToolbarFeature)
  addFeature(mergedFeatures.fixedToolbar, FixedToolbarFeature)
  addFeature(mergedFeatures.blocks, BlocksFeature)
  addFeature(mergedFeatures.table, EXPERIMENTAL_TableFeature)

  const editorConfig: LexicalEditorProps = {
    features: enabledFeatures,
  }

  if (overrides && Object.keys(overrides).length > 0) {
    return lexicalEditor(deepMerge(editorConfig, overrides))
  }

  return lexicalEditor(editorConfig)
}
