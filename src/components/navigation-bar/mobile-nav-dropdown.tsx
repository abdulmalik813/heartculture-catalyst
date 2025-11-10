'use client'

import { useState } from 'react'
import { NavigationBar, Media, Style } from '@/payload-types'
import { NavigationBlockUI } from '@/blocks/navigation'
import { MediaBlockUI } from '@/blocks/media'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Menu, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { joinStyles } from '@/lib/make-styles'
import Link from 'next/link'
import { GlobalData } from '@/types/global-data'

type MobileNavDropdownProps = {
  navigation?: NavigationBar['navigation']
  cta?: NavigationBar['cta']
  appTitle?: string
  lightLogo?: Media
  darkLogo?: Media
  logoStyles?: (number | Style)[] | null | undefined
  useTitleWithLogo?: boolean | null
  globalData: GlobalData
}

export function MobileNavDropdown({
  navigation,
  cta,
  appTitle,
  lightLogo,
  darkLogo,
  logoStyles,
  useTitleWithLogo,
  globalData,
}: MobileNavDropdownProps) {
  const [open, setOpen] = useState(false)
  const [expandedDropdowns, setExpandedDropdowns] = useState<Set<string>>(new Set())

  const toggleDropdown = (id: string) => {
    setExpandedDropdowns((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const closeSheet = () => {
    setOpen(false)
    setExpandedDropdowns(new Set())
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="lg:hidden ml-auto">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 flex flex-col">
        <SheetHeader className="border-b px-6 py-4 text-left">
          <Link href="/" onClick={closeSheet} className="flex items-center gap-2">
            {lightLogo && (
              <MediaBlockUI
                media={lightLogo}
                className={joinStyles('dark:hidden', logoStyles)}
                globalData={globalData}
              />
            )}
            {darkLogo && (
              <MediaBlockUI
                media={darkLogo}
                className={joinStyles('hidden dark:block', logoStyles)}
                globalData={globalData}
              />
            )}
            <SheetTitle>
              {useTitleWithLogo && appTitle && (
                <span className="text-lg font-semibold tracking-tight">{appTitle}</span>
              )}
            </SheetTitle>
          </Link>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <nav className="flex flex-col p-6 space-y-6">
            {navigation && navigation.length > 0 && (
              <div className="space-y-1">
                {navigation.map((navItem, index) => {
                  const itemClassName = 'w-full text-left px-4 py-3 text-sm font-medium'

                  if (navItem.nav?.appearance === 'dropdown') {
                    const isExpanded = expandedDropdowns.has(navItem.id || `${index}`)
                    return (
                      <div key={navItem.id} className="space-y-1">
                        <button
                          onClick={() => toggleDropdown(navItem.id || `${index}`)}
                          className={`${itemClassName} flex items-center justify-between`}
                        >
                          <span>{navItem.nav.label}</span>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="ml-2 pl-2 border-l-2 border-border">
                                {navItem.nav.items?.map((dropdownItem, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={closeSheet}
                                    className={itemClassName}
                                  >
                                    <NavigationBlockUI
                                      dropdownItem={dropdownItem}
                                      globalData={globalData}
                                    />
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  }

                  return (
                    <motion.div
                      key={navItem.id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={closeSheet}
                    >
                      <NavigationBlockUI
                        {...navItem}
                        className={joinStyles(itemClassName, 'text-left')}
                        globalData={globalData}
                      />
                    </motion.div>
                  )
                })}
              </div>
            )}
            <hr />
            {cta && cta.length > 0 && (
              <div className="space-y-1">
                {cta.map((navItem, index) => {
                  const itemClassName = 'w-full text-left px-4 py-3 text-sm font-medium'

                  if (navItem.nav?.appearance === 'dropdown') {
                    const isExpanded = expandedDropdowns.has(navItem.id || `${index}`)
                    return (
                      <div key={navItem.id} className="space-y-1">
                        <button
                          onClick={() => toggleDropdown(navItem.id || `${index}`)}
                          className={`${itemClassName} flex items-center justify-between`}
                        >
                          <span>{navItem.nav.label}</span>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="ml-2 pl-2 border-l-2 border-border">
                                {navItem.nav.items?.map((dropdownItem, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={closeSheet}
                                    className={itemClassName}
                                  >
                                    <NavigationBlockUI
                                      dropdownItem={dropdownItem}
                                      globalData={globalData}
                                    />
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  }

                  return (
                    <motion.div
                      key={navItem.id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={closeSheet}
                      className={itemClassName}
                    >
                      <NavigationBlockUI
                        {...navItem}
                        className={itemClassName}
                        globalData={globalData}
                      />
                    </motion.div>
                  )
                })}
              </div>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
