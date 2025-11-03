import { NavigationBar } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { joinStyles } from '@/lib/make-styles'
import Link from 'next/link'
import { IconRender } from '@/components/icon-renderer'

type NavItem = NonNullable<NavigationBar['navigation']>[number]
type DropdownItem = NonNullable<NonNullable<NavItem['nav']>['dropdownItems']>[number]

interface MobileNavItemProps {
  item: NavItem | DropdownItem
  isCTA?: boolean
  onNavigate: () => void
}

function isDropdownItem(item: NavItem | DropdownItem): item is DropdownItem {
  return 'type' in item && !('nav' in item)
}

export function MobileNavItem({ item, isCTA, onNavigate }: MobileNavItemProps) {
  // Handle dropdown items (simpler structure)
  if (isDropdownItem(item)) {
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
      <Link
        href={href}
        {...relProps}
        className="py-2 text-sm font-medium transition-colors hover:text-primary"
        prefetch={!isExternal}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    )
  }

  // Handle regular nav items
  const icon = typeof item.nav?.icon === "object" ? item.nav?.icon : null
  const iconStyles = item.nav?.iconStyles
  const iconPlacement = item.nav?.placement
  const hasIcon = icon?.name != "" && icon?.name != null

  const renderIcon = () => {
    if (!hasIcon) return null
    return <IconRender icon={icon.name ?? ''} iconStyles={joinStyles(iconStyles)} />
  }

  const href =
    item.nav?.link?.type === 'custom'
      ? item.nav.link.url
      : item.nav?.link?.reference?.relationTo === 'pages'
        ? typeof item.nav.link.reference.value === 'object'
          ? `/${item.nav.link.reference.value.slug}`
          : null
        : null

  if (!href) return null

  const isExternal = item.nav?.link?.type === 'custom'
  const relProps = item.nav?.link?.newTab
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  if (item.nav?.appearance === 'button' || isCTA) {
    return (
      <Button
        asChild
        className={joinStyles(item.nav?.styles, 'w-full')}
        size={item.nav?.buttonSize || 'default'}
        variant={item.nav?.buttonType || 'default'}
      >
        <Link
          href={href}
          {...relProps}
          prefetch={!isExternal}
          onClick={onNavigate}
          className={hasIcon ? 'flex items-center gap-2' : ''}
        >
          {iconPlacement !== 'after' && renderIcon()}
          {item.nav?.label}
          {iconPlacement === 'after' && renderIcon()}
        </Link>
      </Button>
    )
  }

  return (
    <Link
      href={href}
      {...relProps}
      className={joinStyles(
        item.nav?.styles,
        'flex items-center py-2 text-sm font-medium transition-colors hover:text-primary',
        hasIcon ? 'gap-2' : ''
      )}
      prefetch={!isExternal}
      onClick={onNavigate}
    >
      {iconPlacement !== 'after' && renderIcon()}
      {item.nav?.label}
      {iconPlacement === 'after' && renderIcon()}
    </Link>
  )
}