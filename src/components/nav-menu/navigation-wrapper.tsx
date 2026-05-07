'use client'

import { useEffect, useState } from 'react'

interface NavigationBarWrapperProps {
  children: React.ReactNode
  hideWhenIdle: boolean | null | undefined
  idleTimeout?: number
}

export function NavigationBarWrapper({
  children,
  hideWhenIdle,
  idleTimeout = 1000,
}: NavigationBarWrapperProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!hideWhenIdle) {
      setIsVisible(true)
      return
    }

    let idleTimer: NodeJS.Timeout | null = null

    const resetTimer = () => {
      if (idleTimer) clearTimeout(idleTimer)
      setIsVisible(true)

      idleTimer = setTimeout(() => {
        setIsVisible(false)
      }, idleTimeout)
    }

    resetTimer()

    const events = ['mousemove', 'keydown', 'touchstart', 'touchmove', 'click', 'scroll', 'wheel']

    events.forEach((event) => {
      window.addEventListener(event, resetTimer)
    })

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer)
      })
      if (idleTimer) clearTimeout(idleTimer)
    }
  }, [hideWhenIdle, idleTimeout])

  return (
    <div
      className={`transition-all duration-300 ${
        isVisible ? 'visible' : 'invisible h-0'
      }`}
    >
      {children}
    </div>
  )
}