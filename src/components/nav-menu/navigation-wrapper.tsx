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
  idleTimeout = 3000,
}: NavigationBarWrapperProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!hideWhenIdle) {
      setIsVisible(true)
      return
    }

    const handleActivity = () => {
      setIsVisible(true)
      if (idleTimer) clearTimeout(idleTimer)

      const timer = setTimeout(() => {
        setIsVisible(false)
      }, idleTimeout)

      setIdleTimer(timer)
    }

    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('touchstart', handleActivity)
    window.addEventListener('touchmove', handleActivity)
    window.addEventListener('click', handleActivity)

    const initialTimer = setTimeout(() => {
      setIsVisible(false)
    }, idleTimeout)
    setIdleTimer(initialTimer)

    return () => {
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('touchstart', handleActivity)
      window.removeEventListener('touchmove', handleActivity)
      window.removeEventListener('click', handleActivity)
      if (idleTimer) clearTimeout(idleTimer)
      if (initialTimer) clearTimeout(initialTimer)
    }
  }, [hideWhenIdle, idleTimeout, idleTimer])

  return (
    <div
      className={`transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {children}
    </div>
  )
}