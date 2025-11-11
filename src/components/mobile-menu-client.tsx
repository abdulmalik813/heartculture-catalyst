'use client'

import { useState } from 'react'
import { NavigationBar, Style } from '@/payload-types'
import { MediaBlockUI } from '@/blocks/media'
import { joinStyles } from '@/lib/make-styles'
import { PageContext } from '@/types/page-context'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { NavigationBlockUI } from '@/blocks/navigation'

export function MobileMenuClient({
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
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden h-9 w-9 rounded-lg hover:bg-accent transition-colors duration-200"
        aria-label="Open menu"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-5 h-5" />
        <span className="sr-only">Menu</span>
      </Button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-500 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Panel */}
      <div
        className={`fixed inset-0 z-50 bg-background lg:hidden transition-all duration-500 ease-out ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2">
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
              {useTitleWithLogo && appTitle && (
                <span className="text-lg font-semibold">{appTitle}</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Content */}
          <nav className="flex-1 overflow-y-auto px-6 py-8">
            <ul className="space-y-2">
              {navigation?.map((navItem, index) => {
                const delay = `${index * 50}ms`
                
                if (navItem.nav?.appearance === 'dropdown') {
                  const isExpanded = expandedItems.has(index)
                  
                  return (
                    <li
                      key={index}
                      className="transition-all duration-500"
                      style={{
                        opacity: isOpen ? 1 : 0,
                        transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
                        transitionDelay: delay,
                      }}
                    >
                      <button
                        onClick={() => toggleItem(index)}
                        className="w-full text-left px-4 py-3 text-lg font-medium rounded-xl hover:bg-accent transition-all duration-200 flex items-center justify-between group"
                      >
                        <span>{navItem.nav.label}</span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <ul className="space-y-1 pl-4">
                          {navItem.nav.items?.map((dropdownItem, i) => (
                            <li key={i}>
                              <div onClick={() => setIsOpen(false)}>
                                <NavigationBlockUI
                                  dropdownItem={dropdownItem}
                                  pageContext={pageContext}
                                  className="block px-4 py-2.5 rounded-lg hover:bg-accent/50 transition-all duration-200"
                                />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  )
                }

                return (
                  <li
                    key={index}
                    className="transition-all duration-500"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
                      transitionDelay: delay,
                    }}
                  >
                    <div onClick={() => setIsOpen(false)}>
                      <NavigationBlockUI
                        {...navItem}
                        pageContext={pageContext}
                        className="block px-4 py-3 text-lg font-medium rounded-xl hover:bg-accent transition-all duration-200"
                      />
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* CTA Buttons */}
            {cta && cta.length > 0 && (
              <div className="mt-8 pt-8 border-t space-y-3">
                {cta.map((ctaItem, index) => (
                  <div
                    key={index}
                    className="transition-all duration-500"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
                      transitionDelay: `${(navigation?.length || 0) * 50 + index * 50}ms`,
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    <NavigationBlockUI
                      {...ctaItem}
                      pageContext={pageContext}
                      className="w-full justify-center text-base font-semibold h-12 rounded-xl shadow-sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}