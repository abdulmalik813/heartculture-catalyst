'use client'

import React from 'react'
import { useEffect, useState } from 'react'

interface NavigationBarWrapperProps {
  children: React.ReactNode
  hideWhenIdle: boolean | null | undefined
  idleTimeout?: number
}

export function NavigationBarWrapper({
  children,
  hideWhenIdle,
  idleTimeout = 3000,
}: NavigationBarWrapperProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isAtTop, setIsAtTop] = useState(true)
  const idleTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!hideWhenIdle) {
      setIsVisible(true)
      return
    }

    // Set transition once on mount
    const header = document.querySelector('header[role="navigation"]') as HTMLElement
    if (header) {
      header.style.transition = 'opacity 0.3s ease'
    }

    const handleActivity = () => {
      setIsVisible(true)
      const header = document.querySelector('header[role="navigation"]') as HTMLElement
      if (header) {
        header.style.opacity = '1'
        header.style.pointerEvents = 'auto'
      }

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)

      // Only hide if not at top
      if (!isAtTop) {
        idleTimerRef.current = setTimeout(() => {
          setIsVisible(false)
          const header = document.querySelector('header[role="navigation"]') as HTMLElement
          if (header) {
            header.style.opacity = '0'
            header.style.pointerEvents = 'none'
          }
        }, idleTimeout)
      }
    }

    const handleScroll = () => {
      const atTop = window.scrollY < 50
      setIsAtTop(atTop)
      
      if (atTop) {
        setIsVisible(true)
        const header = document.querySelector('header[role="navigation"]') as HTMLElement
        if (header) {
          header.style.opacity = '1'
          header.style.pointerEvents = 'auto'
        }
      }
    }

    handleActivity()

    const events = ['mousemove', 'keydown', 'touchstart', 'touchmove', 'click', 'wheel']

    events.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    window.addEventListener('scroll', handleScroll)

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
      window.removeEventListener('scroll', handleScroll)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [hideWhenIdle, idleTimeout, isAtTop])

  return <>{children}</>
}