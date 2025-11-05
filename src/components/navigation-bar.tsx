import { getCachedGlobal } from '@/lib/get-globals'
import { NavigationBar, Setting } from '@/payload-types'
import { draftMode } from 'next/headers'
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
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export async function NavigationBarUI() {
  const { isEnabled } = await draftMode()
  const navBarData = (await getCachedGlobal('navigationBar', 1, isEnabled)) as NavigationBar
  const settings = (await getCachedGlobal('settings', 1, isEnabled)) as Setting

  const lightLogo = settings.logo
  const darkLogo = settings?.logoDark ?? settings.logo

  if (typeof lightLogo !== 'object' || typeof darkLogo !== 'object') return null

  // Combine navigation and CTA items
  const allNavItems = [
    ...(navBarData.navigation || []),
    ...(navBarData?.cta || [])
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <MediaBlockUI
              media={lightLogo}
              className={joinStyles('dark:hidden', navBarData.logoStyles)}
            />
            <MediaBlockUI
              media={darkLogo}
              className={joinStyles('hidden dark:block', navBarData.logoStyles)}
            />
            {navBarData.useTitleWithLogo && settings.appTitle && (
              <span className="text-lg font-semibold tracking-tight hidden sm:inline-block">
                {settings.appTitle}
              </span>
            )}
          </Link>

          {/* Desktop Navigation - Center */}
          <NavigationMenu viewport={false} className="hidden lg:flex z-50">
            <NavigationMenuList className="flex-wrap gap-1">
              {navBarData.navigation?.map((navItem) => {
                if (navItem.nav?.appearance === 'dropdown') {
                  return (
                    <NavigationMenuItem key={navItem.id}>
                      <NavigationMenuTrigger className="h-9">
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

          {/* Desktop CTA - Right */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {navBarData?.cta?.map((ctaItem) => (
              <NavigationBlockUI key={ctaItem.id} {...ctaItem} />
            ))}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <SheetHeader className="text-left">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-2 mt-8 px-4">
                <Accordion type="multiple" className="w-full">
                  {allNavItems.map((navItem, idx) => {
                    if (navItem.nav?.appearance === 'dropdown') {
                      return (
                        <AccordionItem key={navItem.id} value={`item-${idx}`} className="border-none">
                          <AccordionTrigger className="px-3 py-3 hover:bg-accent rounded-md hover:no-underline">
                            <span className="font-medium">{navItem.nav.label}</span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-2 pt-1">
                            <div className="flex flex-col gap-1">
                              {navItem.nav.items?.map((dropdownItem, index) => (
                                <div
                                  key={index}
                                  className="ml-4 px-3 py-2.5 rounded-md hover:bg-accent transition-colors"
                                >
                                  <NavigationBlockUI dropdownItem={dropdownItem} />
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    }

                    return (
                      <div 
                        key={navItem.id}
                        className="px-3 py-3 rounded-md hover:bg-accent transition-colors"
                      >
                        <NavigationBlockUI {...navItem} />
                      </div>
                    )
                  })}
                </Accordion>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}