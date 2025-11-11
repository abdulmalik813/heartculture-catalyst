import { getCachedGlobal } from '@/lib/get-globals'
import { NavigationBar, Setting, Style } from '@/payload-types'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { MediaBlockUI } from '@/blocks/media'
import { joinStyles } from '@/lib/make-styles'
import { PageContext } from '@/types/page-context'
import { LexicalRenderer } from '@/components/lexical-renderer'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
  DrawerDescription,
} from '@/components/ui/drawer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { NavigationBlockUI } from '@/blocks/navigation'

// Banner Component
function Banner({
  pageContext,
  ...banner
}: Partial<NavigationBar['banner']> & { pageContext: PageContext }) {
  if (!banner.enableBanner) {
    return null
  }

  return (
    <div className={joinStyles(banner.bannerStyles)}>
      {banner.content && (
        <div className={joinStyles(banner.contentStyles)}>
          <LexicalRenderer content={banner.content} pageContext={pageContext} />
        </div>
      )}
    </div>
  )
}

// Logo Link Component
function LogoLink({
  lightLogo,
  darkLogo,
  logoStyles,
  useTitleWithLogo,
  appTitle,
  pageContext,
}: {
  lightLogo: any
  darkLogo: any
  logoStyles?: (number | Style)[] | null | undefined
  useTitleWithLogo?: boolean | null
  appTitle?: string | null
  pageContext: PageContext
}) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2 shrink-0"
      aria-label="Home"
    >
      <MediaBlockUI
        media={lightLogo}
        pageContext={pageContext}
        className={joinStyles('dark:hidden transition-transform duration-200 group-hover:scale-105', logoStyles)}
      />
      <MediaBlockUI
        media={darkLogo}
        pageContext={pageContext}
        className={joinStyles('hidden dark:block transition-transform duration-200 group-hover:scale-105', logoStyles)}
      />
      {useTitleWithLogo && appTitle && (
        <span className="text-lg font-semibold tracking-tight">{appTitle}</span>
      )}
    </Link>
  )
}

// Mobile Menu Component
function MobileMenu({
  navigation,
  cta,
  lightLogo,
  darkLogo,
  logoStyles,
  useTitleWithLogo,
  appTitle,
  pageContext,
}: {
  navigation?: NavigationBar['navigation']
  cta?: NavigationBar['cta']
  lightLogo: any
  darkLogo: any
  logoStyles?: (number | Style)[] | null | undefined
  useTitleWithLogo?: boolean | null
  appTitle?: string
  pageContext: PageContext
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 rounded-lg hover:bg-accent transition-colors duration-200"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-center pb-4">
            <DrawerTitle className="flex items-center justify-center gap-2 text-xl font-semibold">
              <MediaBlockUI
                media={lightLogo}
                pageContext={pageContext}
                className={joinStyles('dark:hidden', logoStyles)}
              />
              <MediaBlockUI
                media={darkLogo}
                pageContext={pageContext}
                className={joinStyles('hidden dark:block', logoStyles)}
              />
              {useTitleWithLogo && appTitle && <span>{appTitle}</span>}
            </DrawerTitle>
            <DrawerDescription className="sr-only">Navigation menu</DrawerDescription>
          </DrawerHeader>
          
          <nav className="px-4 pb-8 overflow-y-auto max-h-[calc(85vh-120px)]">
            <Accordion type="single" collapsible className="space-y-2">
              {navigation?.map((navItem, index) => {
                if (navItem.nav?.appearance === 'dropdown') {
                  return (
                    <AccordionItem key={index} value={`item-${index}`} className="border-none">
                      <AccordionTrigger className="w-full px-4 py-3 text-base font-medium hover:bg-accent rounded-xl hover:no-underline transition-all duration-200 [&[data-state=open]>svg]:rotate-180">
                        <span className="flex-1 text-center">{navItem.nav.label}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-2">
                        <ul className="space-y-1">
                          {navItem.nav.items?.map((dropdownItem, i) => (
                            <li key={i}>
                              <DrawerClose asChild>
                                <NavigationBlockUI
                                  dropdownItem={dropdownItem}
                                  pageContext={pageContext}
                                  className="flex flex-col items-center text-center w-full px-4 py-3 rounded-xl hover:bg-accent/50 transition-all duration-200 group"
                                />
                              </DrawerClose>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )
                }

                return (
                  <DrawerClose asChild key={index}>
                    <NavigationBlockUI
                      {...navItem}
                      pageContext={pageContext}
                      className="flex items-center justify-center w-full px-4 py-3 text-base font-medium rounded-xl hover:bg-accent transition-all duration-200"
                    />
                  </DrawerClose>
                )
              })}
            </Accordion>

            {cta && cta.length > 0 && (
              <div className="mt-6 pt-6 border-t space-y-2">
                {cta.map((ctaItem, index) => (
                  <DrawerClose asChild key={index}>
                    <NavigationBlockUI
                      {...ctaItem}
                      pageContext={pageContext}
                      className="w-full justify-center text-base font-semibold h-12 rounded-xl shadow-sm"
                    />
                  </DrawerClose>
                ))}
              </div>
            )}
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

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
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 mx-auto py-3 sm:py-4">
          <div className="flex items-center min-w-0 flex-shrink-0">
            <LogoLink
              lightLogo={lightLogo}
              darkLogo={darkLogo}
              logoStyles={navBarData.logoStyles}
              useTitleWithLogo={navBarData.useTitleWithLogo}
              appTitle={setting.appTitle}
              pageContext={pageContext}
            />
          </div>

          <nav className="hidden lg:flex flex-1 items-center justify-center max-w-3xl">
            <NavigationMenu viewport={false} suppressHydrationWarning>
              <NavigationMenuList className="gap-1">
                {navBarData.navigation?.map((navItem) => {
                  if (navItem.nav?.appearance === 'dropdown') {
                    return (
                      <NavigationMenuItem key={navItem.id}>
                        <NavigationMenuTrigger className="text-sm font-medium rounded-lg hover:bg-accent transition-colors duration-200 data-[state=open]:bg-accent">
                          {navItem.nav.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[240px] gap-1 p-2">
                            {navItem.nav.items?.map((dropdownItem) => (
                              <li key={dropdownItem.id}>
                                <NavigationMenuLink asChild>
                                  <NavigationBlockUI
                                    dropdownItem={dropdownItem}
                                    pageContext={pageContext}
                                    className="block rounded-lg p-2.5 hover:bg-accent transition-colors duration-200 group"
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
                      <NavigationBlockUI
                        {...navItem}
                        pageContext={pageContext}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors duration-200"
                      />
                    </NavigationMenuItem>
                  )
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            {navBarData?.cta?.map((ctaItem) => (
              <NavigationBlockUI
                key={ctaItem.id}
                {...ctaItem}
                pageContext={pageContext}
                className="hidden sm:inline-flex text-sm h-9 px-4 rounded-lg transition-colors duration-200"
              />
            ))}
            <MobileMenu
              navigation={navBarData.navigation}
              cta={navBarData.cta}
              lightLogo={lightLogo}
              darkLogo={darkLogo}
              logoStyles={navBarData.logoStyles}
              useTitleWithLogo={navBarData.useTitleWithLogo}
              appTitle={setting.appTitle ?? undefined}
              pageContext={pageContext}
            />
          </div>
        </div>
      </header>
    </>
  )
}