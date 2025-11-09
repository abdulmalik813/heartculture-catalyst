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
import { getHref } from '@/lib/get-href'

function getIconData(item: any) {
  const icon = typeof item?.icon === 'object' ? item?.icon : null
  const iconStyles = item?.iconStyles
  const iconPlacement = item?.placement
  const hasIcon = icon?.name != '' && icon?.name != null

  const renderIcon = () => {
    if (!hasIcon) return null
    return <IconRender icon={icon.name ?? ''} iconStyles={joinStyles(iconStyles)} />
  }

  return { hasIcon, iconPlacement, renderIcon }
}

type DropdownItem = NonNullable<NonNullable<NavigationBlock['nav']>['items']>[number]

type LinkItem = {
  type?: ('reference' | 'custom' | 'postListingPage') | null
  newTab?: boolean | null
  icon?: any
  iconStyles?: any
  placement?: string | null
  label?: string | null
}

function LinkWithIcon({
  href,
  item,
  label,
  className = '',
  dropdownItem = false,
}: {
  href: string
  item: LinkItem
  label: string
  className?: string
  dropdownItem?: boolean
}) {
  const isExternal = item?.type === 'custom'
  const relProps = item?.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  const { hasIcon, iconPlacement, renderIcon } = getIconData(item)

  return (
    <Link
      href={href}
      {...relProps}
      className={joinStyles(
        className,
        hasIcon
          ? !dropdownItem
            ? 'flex items-center gap-2'
            : 'flex flex-row items-center gap-2'
          : '',
      )}
      prefetch={!isExternal}
    >
      {iconPlacement !== 'after' && renderIcon()}
      {label}
      {iconPlacement === 'after' && renderIcon()}
    </Link>
  )
}

export function NavigationBlockUI({
  searchParams,
  dropdownItem,
  className,
  ...navigationBlock
}: Partial<NavigationBlock> & {
  className?: string
  searchParams?: SearchParams
  dropdownItem?: DropdownItem
}) {
  const { hasIcon, iconPlacement, renderIcon } = getIconData(navigationBlock.nav)

  if (navigationBlock.nav?.appearance === 'button' || navigationBlock.nav?.appearance === 'link') {
    const href = getHref(navigationBlock.nav.link)
    if (!href) return null

    if (navigationBlock.nav?.appearance === 'button') {
      return (
        <Button
          asChild
          className={joinStyles(className, navigationBlock.nav.styles)}
          size={navigationBlock.nav.buttonSize}
          variant={navigationBlock.nav.buttonType}
        >
          <LinkWithIcon
            href={href}
            item={navigationBlock.nav}
            label={navigationBlock.nav.label ?? ''}
          />
        </Button>
      )
    } else {
      return (
        <LinkWithIcon
          href={href}
          item={navigationBlock.nav}
          label={navigationBlock.nav.label ?? ''}
          className={joinStyles(className, navigationBlock.nav.styles)}
        />
      )
    }
  }

  if (dropdownItem) {
    const href = getHref(dropdownItem)
    if (!href) return null
    return (
      <LinkWithIcon
        href={href}
        item={dropdownItem}
        label={dropdownItem.label ?? ''}
        className={className}
        dropdownItem
      />
    )
  }

  return (
    <DropdownMenu>
      <Button
        asChild
        className={joinStyles(className, navigationBlock.nav?.styles)}
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
        {navigationBlock.nav?.items?.map((item, index) => {
          const href = getHref(item)
          if (!href) return null

          return (
            <DropdownMenuItem key={index} asChild>
              <LinkWithIcon href={href} item={item} label={item.label ?? ''} />
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
