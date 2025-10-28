'use client'

import React from 'react'
import { useTheme } from '@payloadcms/ui'
import { Button } from '@payloadcms/ui'

export const ThemePicker: React.FC = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button
      buttonStyle="pill"
      onClick={toggleTheme}
    >
      {theme === 'light' ? 'Light' : 'Dark'}
    </Button>
  )
}