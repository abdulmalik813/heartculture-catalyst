import { joinStyles } from '@/lib/make-styles'
import type { TagBlock as TagBlockProps } from '@/payload-types'

export function TagBlock({ ...tagFields }: TagBlockProps) {
    if (!tagFields?.tag) return null

    const className = joinStyles(tagFields?.styles)
    
    if (tagFields.location === "start") {
        return <span className="__tag-marker__">{`START::${tagFields.tag}::${className}`}</span>
    } else {
        return <span className="__tag-marker__">{`END::${tagFields.tag}`}</span>
    }
}