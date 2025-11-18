import { AnimateWrapper } from '@/components/animate-wrapper'
import { joinStyles } from '@/lib/make-styles'
import { HeadingBlock } from '@/payload-types'

export function HeadingBlockUI({ ...headingBlock }: HeadingBlock) {
  const { headingTag: Tag, headingText, headingStyles } = headingBlock

  return (
    <AnimateWrapper className={joinStyles(headingStyles)}>
      <Tag>{headingText}</Tag>
    </AnimateWrapper>
  )
}
