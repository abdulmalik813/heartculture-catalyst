import { getCachedGlobal } from '@/lib/get-globals'
import { Footer as FooterType, Setting } from '@/payload-types'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { MediaBlockUI } from '@/blocks/media'
import { NavigationBlockUI } from '@/blocks/navigation'
import { LexicalRenderer } from '@/components/lexical-renderer'
import { joinStyles } from '@/lib/make-styles'
import { ThemeToggle } from './theme/theme-toggle'

export async function Footer() {
  const { isEnabled } = await draftMode()
  const footerData = (await getCachedGlobal('footer', 1, isEnabled)) as FooterType
  const setting = (await getCachedGlobal('settings', 1, isEnabled)) as Setting

  const lightLogo = settings.logo
  const darkLogo = settings?.logoDark ?? settings.logo

  if (typeof lightLogo !== 'object' || typeof darkLogo !== 'object') return null

  return (
    <footer className="mt-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="border-t" />

      <div className="container mx-auto">
        <div className="py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link href="/" className="flex items-center gap-3 shrink-0 group">
                <MediaBlockUI
                  media={lightLogo}
                  className={joinStyles(
                    'dark:hidden transition-transform group-hover:scale-105',
                    footerData.logoStyles,
                  )}
                />
                <MediaBlockUI
                  media={darkLogo}
                  className={joinStyles(
                    'hidden dark:block transition-transform group-hover:scale-105',
                    footerData.logoStyles,
                  )}
                />
                {footerData.useLabelWithLogo && settings.appTitle && (
                  <span
                    className={joinStyles(
                      'text-xl font-bold tracking-tight',
                      footerData.labelStyles,
                    )}
                  >
                    {settings.appTitle}
                  </span>
                )}
              </Link>
              {footerData.tagLine && (
                <div
                  className={joinStyles('text-muted-foreground max-w-sm', footerData.tagLineStyles)}
                >
                  <LexicalRenderer content={footerData.tagLine} />
                </div>
              )}
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {footerData.columns?.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-4">
                  {column.groups?.map((group, groupIndex) => (
                    <div key={groupIndex} className="flex flex-col gap-2">
                      {group.groupLabel && (
                        <h3
                          className={joinStyles(
                            'font-semibold text-sm uppercase tracking-wider text-foreground',
                            footerData.groupLabelStyles,
                          )}
                        >
                          {group.groupLabel}
                        </h3>
                      )}
                      <nav className="flex flex-col gap-1.5">
                        {group.items?.map((item, itemIndex) => (
                          <NavigationBlockUI
                            key={itemIndex}
                            {...item}
                            className={joinStyles(
                              'text-muted-foreground hover:text-foreground transition-colors text-sm',
                              footerData.linkStyles,
                            )}
                          />
                        ))}
                      </nav>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t" />

      <div className="container mx-auto">
        <div className="py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} {settings.appTitle}. All rights reserved.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}
