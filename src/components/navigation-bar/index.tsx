import { getCachedGlobal } from "@/lib/get-globals"
import { NavigationBar, Setting } from "@/payload-types"
import { draftMode } from "next/headers"
import Link from "next/link"
import Image from "next/image"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { NavigationBlockUI } from "@/blocks/navigation"

export async function NavigationBarUI() {
  const { isEnabled } = await draftMode()
  const navBarData = (await getCachedGlobal("navigationBar", 1, isEnabled)) as NavigationBar
  const settings = (await getCachedGlobal("settings", 1, isEnabled)) as Setting
  
  const lightLogo = settings.logo
  const darkLogo = settings?.logoDark ?? settings.logo
  
  if (typeof lightLogo !== "object" || typeof darkLogo !== "object") return null

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={lightLogo.url || ""}
              alt={lightLogo.alt || "Logo"}
              width={40}
              height={40}
              className="dark:hidden"
            />
            <Image
              src={darkLogo.url || ""}
              alt={darkLogo.alt || "Logo"}
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
                      <NavigationMenuTrigger>
                        {navItem.nav.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-2 p-2">
                          {navItem.nav.dropdownItems?.map((dropdownItem, index) => {
                            const href =
                              dropdownItem.type === 'custom'
                                ? dropdownItem.url
                                : dropdownItem.reference?.relationTo === 'pages'
                                  ? typeof dropdownItem.reference.value === 'object'
                                    ? `/${dropdownItem.reference.value.slug}`
                                    : null
                                  : null

                            if (!href) return null

                            const isExternal = dropdownItem.type === 'custom'
                            const relProps = dropdownItem.newTab
                              ? { target: '_blank', rel: 'noopener noreferrer' }
                              : {}

                            return (
                              <li key={index}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={href}
                                    {...relProps}
                                    prefetch={!isExternal}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    {dropdownItem.label}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            )
                          })}
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

          {/* CTA Buttons */}
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