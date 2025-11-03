'use client'

import { NavigationBar, Media } from "@/payload-types"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Menu } from "lucide-react"
import { Logo } from "./logo"
import { useState } from "react"
import { MobileNavItem } from "./mobile-nav-item"

interface MobileNavProps {
  navigation?: NavigationBar['navigation']
  cta?: NavigationBar['cta']
  lightLogo: Media
  darkLogo: Media
  style: NavigationBar['style']
}

export function MobileNav({ navigation, cta, lightLogo, darkLogo, style }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  // Sidebar style doesn't need mobile menu
  if (style === 'sidebar') return null

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-left">
              <Logo lightLogo={lightLogo} darkLogo={darkLogo} style={style} />
            </SheetTitle>
          </SheetHeader>
          
          <nav className="flex flex-col gap-4">
            {navigation?.map((item) => {
              // Dropdown items use accordion
              if (item.nav?.appearance === 'dropdown' && item.nav.dropdownItems) {
                return (
                  <Accordion key={item.id} type="single" collapsible>
                    <AccordionItem value={item.id || 'item'} className="border-none">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        {item.nav.label}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-2 pl-4">
                          {item.nav.dropdownItems.map((dropItem, idx) => (
                            <MobileNavItem 
                              key={idx} 
                              item={dropItem} 
                              onNavigate={() => setOpen(false)}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )
              }

              // Regular link/button items
              return (
                <MobileNavItem 
                  key={item.id} 
                  item={item} 
                  onNavigate={() => setOpen(false)}
                />
              )
            })}

            {/* CTA Links */}
            {cta?.ctaLinks && cta.ctaLinks.length > 0 && (
              <>
                <div className="my-4 border-t" />
                <div className="flex flex-col gap-3">
                  {cta.ctaLinks.map((item) => (
                    <MobileNavItem 
                      key={item.id} 
                      item={item} 
                      isCTA 
                      onNavigate={() => setOpen(false)}
                    />
                  ))}
                </div>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}