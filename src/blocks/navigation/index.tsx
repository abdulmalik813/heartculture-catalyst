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
import { IconRender } from '@/components/icon-renderer'

export function NavigationBlockUI({
  searchParams,
  ...navigationBlock
}: Partial<NavigationBlock> & { searchParams?: SearchParams }) {
  
  const icon = typeof navigationBlock.nav?.icon === "object" ? navigationBlock.nav?.icon : null
  const iconStyles = navigationBlock.nav?.iconStyles
  const iconPlacement = navigationBlock.nav?.placement

  const hasIcon = icon?.name != "" && icon?.name != null  

  const renderIcon = () => {
    if (!hasIcon) return null
    return <IconRender icon={icon.name ?? ''} iconStyles={joinStyles(iconStyles)} />
  }

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

    const isExternal = navigationBlock.nav.link?.type === 'custom'
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
          <Link 
            href={href} 
            {...relProps} 
            prefetch={!isExternal} 
            className={hasIcon ? 'flex items-center gap-2' : ''}
          >
            {iconPlacement !== 'after' && renderIcon()}
            {navigationBlock.nav.label}
            {iconPlacement === 'after' && renderIcon()}
          </Link>
        </Button>
      )
    } else {
      return (
        <Link
          href={href}
          {...relProps}
          className={joinStyles(navigationBlock.nav.styles, hasIcon ? 'flex items-center gap-2' : '')}
          prefetch={!isExternal}
        >
          {iconPlacement !== 'after' && renderIcon()}
          {navigationBlock.nav.label}
          {iconPlacement === 'after' && renderIcon()}
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
        <DropdownMenuTrigger className={hasIcon ? 'flex items-center gap-2' : ''}>
          {iconPlacement !== 'after' && renderIcon()}
          {navigationBlock.nav?.label}
          {iconPlacement === 'after' && renderIcon()}
        </DropdownMenuTrigger>
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

          const isExternal = item.type === 'custom'
          const relProps = item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

          return (
            <DropdownMenuItem key={index} asChild>
              <Link href={href} {...relProps} prefetch={!isExternal}>
                {item.label}
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}