import { NavigationBlock } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { joinStyles } from '@/lib/make-styles'
import Link from 'next/link'
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { SearchParams } from '@/types/search-params'

export function NavigationBlockUI({
  searchParams,
  ...navigationBlock
}: Partial<NavigationBlock> & { searchParams?: SearchParams }) {
  if (navigationBlock.nav?.appearance === 'button' || navigationBlock.nav?.appearance === 'link') {
    const href =
      navigationBlock.nav.link?.type === 'custom'
        ? navigationBlock.nav.link.url
        : navigationBlock.nav.link?.reference?.relationTo === 'pages'
          ? typeof navigationBlock.nav.link.reference.value === 'object'
            ? `/${navigationBlock.nav.link.reference.value.slug}`
            : null
          : null
    if (!href) return null

    const relProps = navigationBlock.nav.link?.newTab
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {}

    if (navigationBlock.nav?.appearance === 'button') {
      return (
        <Button
          asChild
          className={joinStyles(navigationBlock.nav.styles)}
          size={navigationBlock.nav.buttonSize}
          variant={navigationBlock.nav.buttonType}
        >
          <Link href={href} {...relProps}>
            {navigationBlock.nav.label}
          </Link>
        </Button>
      )
    } else {
      return (
        <Link href={href} {...relProps} className={joinStyles(navigationBlock.nav.styles)}>
          {navigationBlock.nav.label}
        </Link>
      )
    }
  }

  return (
    <DropdownMenu>
      <Button
        asChild
        className={joinStyles(navigationBlock.nav?.styles)}
        size={navigationBlock.nav?.buttonSize}
        variant={navigationBlock.nav?.buttonType}
      >
        <DropdownMenuTrigger>{navigationBlock.nav?.label}</DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent>
        {navigationBlock.nav?.dropdownItems?.map((item, index) => {
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
