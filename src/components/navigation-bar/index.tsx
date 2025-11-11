import { getCachedGlobal } from '@/lib/get-globals'
import { NavigationBar, Setting } from '@/payload-types'
import { Banner } from '@/components/navigation-bar/banner'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { NavigationBlockUI } from '@/blocks/navigation'
import { MediaBlockUI } from '@/blocks/media'
import { joinStyles } from '@/lib/make-styles'
import { MobileNavDropdown } from '@/components/navigation-bar/mobile-nav-dropdown'
import { PageContext } from '@/types/page-context'

export async function NavigationBarUI({ pageContext }: { pageContext: PageContext }) {
  const navBarData = (await getCachedGlobal('navigationBar', 1, pageContext.draft)) as NavigationBar
  const setting = (await getCachedGlobal('settings', 1, pageContext.draft)) as Setting

  const lightLogo = setting.logo
  const darkLogo = setting?.logoDark ?? setting.logo

  if (typeof lightLogo !== 'object' || typeof darkLogo !== 'object') return null

  return (
    <>
      <Banner {...navBarData.banner} pageContext={pageContext} />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0 h-full">
              <div className="h-full py-2">
                <MediaBlockUI
                  media={lightLogo}
                  pageContext={pageContext}
                  className={joinStyles('dark:hidden h-full w-auto', navBarData.logoStyles)}
                />
                <MediaBlockUI
                  media={darkLogo}
                  pageContext={pageContext}
                  className={joinStyles('hidden dark:block h-full w-auto', navBarData.logoStyles)}
                />
              </div>
              {navBarData.useTitleWithLogo && setting.appTitle && (
                <span className="text-lg font-semibold tracking-tight">{setting.appTitle}</span>
              )}
            </Link>

            <NavigationMenu className="hidden lg:flex z-50 mx-auto">
              <NavigationMenuList className="flex-wrap">
                {navBarData.navigation?.map((navItem) => {
                  if (navItem.nav?.appearance === 'dropdown') {
                    return (
                      <NavigationMenuItem key={navItem.id}>
                        <NavigationMenuTrigger className="h-9">
                          {navItem.nav.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid grid-cols-1 w-[240px] p-2">
                            {navItem.nav.items?.map((dropdownItem) => (
                              <li key={dropdownItem.id}>
                                <NavigationMenuLink key={dropdownItem.id} asChild>
                                  <NavigationBlockUI
                                    key={dropdownItem.id}
                                    dropdownItem={dropdownItem}
                                    pageContext={pageContext}
                                  />
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
                      <NavigationBlockUI {...navItem} pageContext={pageContext} />
                    </NavigationMenuItem>
                  )
                })}
              </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu className="hidden lg:flex z-50">
              <NavigationMenuList className="flex-wrap">
                {navBarData?.cta?.map((ctaItem) => {
                  if (ctaItem.nav?.appearance === 'dropdown') {
                    return (
                      <NavigationMenuItem key={ctaItem.id}>
                        <NavigationMenuTrigger className="h-9">
                          {ctaItem.nav.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid grid-cols-1 w-[240px] p-2">
                            {ctaItem.nav.items?.map((dropdownItem) => (
                              <li key={dropdownItem.id}>
                                <NavigationMenuLink key={dropdownItem.id} asChild>
                                  <NavigationBlockUI
                                    key={dropdownItem.id}
                                    dropdownItem={dropdownItem}
                                    pageContext={pageContext}
                                  />
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    )
                  }

                  return (
                    <NavigationMenuItem key={ctaItem.id}>
                      <NavigationBlockUI {...ctaItem} pageContext={pageContext} />
                    </NavigationMenuItem>
                  )
                })}
              </NavigationMenuList>
            </NavigationMenu>

            <MobileNavDropdown
              navigation={navBarData.navigation}
              cta={navBarData.cta}
              appTitle={setting.appTitle ?? undefined}
              lightLogo={lightLogo}
              darkLogo={darkLogo}
              logoStyles={navBarData.logoStyles}
              useTitleWithLogo={navBarData.useTitleWithLogo}
              pageContext={pageContext}
            />
          </div>
        </div>
      </header>
    </>
  )
}