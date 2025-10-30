import { NavigationBlock } from '@/payload-types'
import { Button } from '../ui/button'
import { joinStyles } from '@/lib/make-styles'
import Link from 'next/link'
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
} from '../ui/dropdown-menu'

export function Navigation({ ...props }: Partial<NavigationBlock>) {
  if (props.nav?.appearance === 'button' || props.nav?.appearance === 'link') {
    const href =
      props.nav.link?.type === 'custom'
        ? props.nav.link.url
        : props.nav.link?.reference?.relationTo === 'pages'
          ? typeof props.nav.link.reference.value === 'object'
            ? `/${props.nav.link.reference.value.slug}`
            : null
          : null
    if (!href) return null

    const relProps = props.nav.link?.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

    if (props.nav?.appearance === 'button') {
      return (
        <Button
          asChild
          className={joinStyles(props.nav.styles)}
          size={props.nav.buttonSize}
          variant={props.nav.buttonType}
        >
          <Link href={href} {...relProps}>
            {props.nav.label}
          </Link>
        </Button>
      )
    } else {
      return (
        <Link href={href} {...relProps} className={joinStyles(props.nav.styles)}>
          {props.nav.label}
        </Link>
      )
    }
  }

  return (
    <DropdownMenu>
      <Button
        asChild
        className={joinStyles(props.nav?.styles)}
        size={props.nav?.buttonSize}
        variant={props.nav?.buttonType}
      >
        <DropdownMenuTrigger>{props.nav?.label}</DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent>
        {props.nav?.dropdownItems?.map((item, index) => {
          const href =
            item.type === 'custom'
              ? item.url
              : item.reference?.relationTo === 'pages'
                ? typeof item.reference.value === 'object'
                  ? `/${item.reference.value.slug}`
                  : null
                : null
          
          if (!href) return null

          const relProps = item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

          return (
            <DropdownMenuItem key={index} asChild>
              <Link href={href} {...relProps}>
                {item.label}
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
