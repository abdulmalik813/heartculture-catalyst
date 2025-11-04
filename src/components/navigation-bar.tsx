import { getCachedGlobal } from '@/lib/get-globals'
import { NavigationBar, Setting } from '@/payload-types'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu'
import { NavigationBlockUI } from '@/blocks/navigation'

export async function NavigationBarUI() {
  const { isEnabled } = await draftMode()
  const navBarData = (await getCachedGlobal('navigationBar', 1, isEnabled)) as NavigationBar
  const settings = (await getCachedGlobal('settings', 1, isEnabled)) as Setting

  const lightLogo = settings.logo
  const darkLogo = settings?.logoDark ?? settings.logo

  if (typeof lightLogo !== 'object' || typeof darkLogo !== 'object') return null

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src={lightLogo.url || ''}
              alt={lightLogo.alt || 'Logo'}
              width={40}
              height={40}
              className="dark:hidden"
            />
            <Image
              src={darkLogo.url || ''}
              alt={darkLogo.alt || 'Logo'}
              width={40}
              height={40}
              className="hidden dark:block"
            />
            {navBarData.useTitleWithLogo && settings.appTitle && (
              <span className="ml-2 text-xl font-semibold">{settings.appTitle}</span>
            )}
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navBarData.navigation?.map((navItem) => {
                if (navItem.nav?.appearance === 'dropdown') {
                  return (
                    <NavigationMenuItem key={navItem.id}>
                      <NavigationMenuTrigger>{navItem.nav.label}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {navItem.nav.items?.map((dropdownItem, index) => (
                            <li key={index}>
                              <NavigationMenuLink asChild>
                                <NavigationBlockUI dropdownItem={dropdownItem} />
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )
                }

                return (
                  <NavigationMenuItem key={navItem.id}>
                    <NavigationBlockUI {...navItem} />
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>

          <div className="flex items-center gap-2">
            {navBarData?.cta?.map((ctaItem) => (
              <NavigationBlockUI key={ctaItem.id} {...ctaItem} />
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
