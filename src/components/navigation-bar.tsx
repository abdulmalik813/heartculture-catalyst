import { getCachedGlobal } from '@/lib/get-globals'
import { NavigationBar, Setting } from '@/payload-types'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { NavigationBlockUI } from '@/blocks/navigation'
import { MediaBlockUI } from '@/blocks/media'
import { joinStyles } from '@/lib/make-styles'

export async function NavigationBarUI() {
  const { isEnabled } = await draftMode()
  const navBarData = (await getCachedGlobal('navigationBar', 1, isEnabled)) as NavigationBar
  const settings = (await getCachedGlobal('settings', 1, isEnabled)) as Setting

  const lightLogo = settings.logo
  const darkLogo = settings?.logoDark ?? settings.logo

  if (typeof lightLogo !== 'object' || typeof darkLogo !== 'object') return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <MediaBlockUI
              media={lightLogo}
              className={joinStyles('dark:hidden', navBarData.logoStyles)}
            />
            <MediaBlockUI
              media={darkLogo}
              className={joinStyles('hidden dark:block', navBarData.logoStyles)}
            />
            {navBarData.useTitleWithLogo && settings.appTitle && (
              <span className="text-xl font-semibold tracking-tight">{settings.appTitle}</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu viewport={false} className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              {navBarData.navigation?.map((navItem) => {
                if (navItem.nav?.appearance === 'dropdown') {
                  return (
                    <NavigationMenuItem key={navItem.id}>
                      <NavigationMenuTrigger className="h-10 px-4 py-2">
                        {navItem.nav.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[240px] gap-1 p-2">
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
          </NavigationMenu>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-2 lg:flex">
            {navBarData?.cta?.map((ctaItem) => (
              <NavigationBlockUI key={ctaItem.id} {...ctaItem} />
            ))}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-2">
                  <MediaBlockUI
                    media={lightLogo}
                    className={joinStyles('dark:hidden h-8 w-auto', navBarData.logoStyles)}
                  />
                  <MediaBlockUI
                    media={darkLogo}
                    className={joinStyles('hidden dark:block h-8 w-auto', navBarData.logoStyles)}
                  />
                  {settings.appTitle && (
                    <span className="text-lg font-semibold">{settings.appTitle}</span>
                  )}
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-4">
                {/* Mobile Navigation Links */}
                <div className="flex flex-col gap-2">
                  {navBarData.navigation?.map((navItem) => {
                    if (navItem.nav?.appearance === 'dropdown') {
                      return (
                        <div key={navItem.id} className="flex flex-col gap-2">
                          <p className="px-3 py-2 text-sm font-medium text-muted-foreground">
                            {navItem.nav.label}
                          </p>
                          <div className="flex flex-col gap-1 pl-3">
                            {navItem.nav.items?.map((dropdownItem, index) => (
                              <NavigationBlockUI
                                key={index}
                                dropdownItem={dropdownItem}
                                inSheet
                              />
                            ))}
                          </div>
                        </div>
                      )
                    }

                    return (
                      <NavigationBlockUI key={navItem.id} {...navItem} inSheet />
                    )
                  })}
                </div>

                {/* Mobile CTA */}
                {navBarData?.cta && navBarData.cta.length > 0 && (
                  <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                    {navBarData.cta.map((ctaItem) => (
                      <NavigationBlockUI key={ctaItem.id} {...ctaItem} inSheet />
                    ))}
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}