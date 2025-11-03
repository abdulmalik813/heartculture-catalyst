import { NavigationBar, Page, Style, Icon } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { joinStyles } from '@/lib/make-styles'
import Link from 'next/link'
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { IconRender } from '@/components/icon-renderer'
import { ChevronDown } from 'lucide-react'

type NavItem = NonNullable<NavigationBar['navigation']>[number]

interface NavigationItemProps {
  item: NavItem
  isCTA?: boolean
}

export function NavigationItem({ item, isCTA }: NavigationItemProps) {
  const icon = typeof item.nav?.icon === "object" ? item.nav?.icon : null
  const iconStyles = item.nav?.iconStyles
  const iconPlacement = item.nav?.placement
  const hasIcon = icon?.name != "" && icon?.name != null

  const renderIcon = () => {
    if (!hasIcon) return null
    return <IconRender icon={icon.name ?? ''} iconStyles={joinStyles(iconStyles)} />
  }

  // Link or Button
  if (item.nav?.appearance === 'button' || item.nav?.appearance === 'link') {
    const href =
      item.nav.link?.type === 'custom'
        ? item.nav.link.url
        : item.nav.link?.reference?.relationTo === 'pages'
          ? typeof item.nav.link.reference.value === 'object'
            ? `/${item.nav.link.reference.value.slug}`
            : null
          : null
    
    if (!href) return null

    const isExternal = item.nav.link?.type === 'custom'
    const relProps = item.nav.link?.newTab
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {}

    if (item.nav?.appearance === 'button') {
      return (
        <Button
          asChild
          className={joinStyles(item.nav.styles)}
          size={item.nav.buttonSize || 'default'}
          variant={item.nav.buttonType || 'default'}
        >
          <Link 
            href={href} 
            {...relProps} 
            prefetch={!isExternal} 
            className={hasIcon ? 'flex items-center gap-2' : ''}
          >
            {iconPlacement !== 'after' && renderIcon()}
            {item.nav.label}
            {iconPlacement === 'after' && renderIcon()}
          </Link>
        </Button>
      )
    } else {
      return (
        <Link
          href={href}
          {...relProps}
          className={joinStyles(
            item.nav.styles, 
            'text-sm font-medium transition-colors hover:text-primary',
            hasIcon ? 'flex items-center gap-2' : ''
          )}
          prefetch={!isExternal}
        >
          {iconPlacement !== 'after' && renderIcon()}
          {item.nav.label}
          {iconPlacement === 'after' && renderIcon()}
        </Link>
      )
    }
  }

  // Dropdown
  if (item.nav?.appearance === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={joinStyles(item.nav?.styles, hasIcon ? 'flex items-center gap-2' : '')}
            size={item.nav?.buttonSize || 'default'}
            variant={item.nav?.buttonType || 'ghost'}
          >
            {iconPlacement !== 'after' && renderIcon()}
            {item.nav?.label}
            {iconPlacement === 'after' && renderIcon()}
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {item.nav?.dropdownItems?.map((dropItem, index) => {
            const href =
              dropItem.type === 'custom'
                ? dropItem.url
                : dropItem.reference?.relationTo === 'pages'
                  ? typeof dropItem.reference.value === 'object'
                    ? `/${dropItem.reference.value.slug}`
                    : null
                  : null

            if (!href) return null

            const isExternal = dropItem.type === 'custom'
            const relProps = dropItem.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

            return (
              <DropdownMenuItem key={index} asChild>
                <Link href={href} {...relProps} prefetch={!isExternal} className="w-full">
                  {dropItem.label}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return null
}