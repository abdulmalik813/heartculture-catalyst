'use client'

import { NavigationBar, Media } from "@/payload-types"
import { useEffect, useState } from "react"
import { DesktopNav } from "./desktop-nav"
import { getHeaderStyles } from "./header-styles"
import { Logo } from "./logo"
import { MobileNav } from "./mobile-nav"

interface HeaderClientProps {
  headerData: NavigationBar
  lightLogo: Media
  darkLogo: Media
}

export function HeaderClient({ headerData, lightLogo, darkLogo }: HeaderClientProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      setIsScrolled(currentScrollY > 10)

      if (headerData.behavior === 'hide') {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsHidden(true)
        } else {
          setIsHidden(false)
        }
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, headerData.behavior])

  const styles = getHeaderStyles(headerData, isScrolled, isHidden)

  return (
    <header className={styles.container}>
      <div className={styles.inner}>
        {/* Logo */}
        <Logo lightLogo={lightLogo} darkLogo={darkLogo} style={headerData.style} />

        {/* Desktop Navigation */}
        <DesktopNav 
          navigation={headerData.navigation}
          cta={headerData.cta}
          style={headerData.style}
        />

        {/* Mobile Navigation */}
        <MobileNav 
          navigation={headerData.navigation}
          cta={headerData.cta}
          lightLogo={lightLogo}
          darkLogo={darkLogo}
          style={headerData.style}
        />
      </div>
    </header>
  )
}