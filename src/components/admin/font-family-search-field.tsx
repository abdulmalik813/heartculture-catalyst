// src/components/admin/font-family-search-field.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'

interface GoogleFont {
  id: string
  family: string
  subsets: string[]
  weights: number[]
  styles: string[]
  defSubset: string
  variable: boolean
  category: string
}

const styles = {
  container: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--theme-text)',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--theme-elevation-200)',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: 'var(--theme-elevation-0)',
    color: 'var(--theme-text)',
  },
  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '4px',
    maxHeight: '300px',
    overflowY: 'auto' as const,
    backgroundColor: 'var(--theme-elevation-0)',
    border: '1px solid var(--theme-elevation-200)',
    borderRadius: '4px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  dropdownItem: {
    padding: '12px',
    cursor: 'pointer',
    borderBottom: '1px solid var(--theme-elevation-100)',
    transition: 'background-color 0.15s',
  },
  dropdownTitle: {
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '4px',
    color: 'var(--theme-text)',
  },
  dropdownMeta: {
    fontSize: '12px',
    color: 'var(--theme-elevation-600)',
  },
  configPanel: {
    padding: '16px',
    backgroundColor: 'var(--theme-elevation-50)',
    borderRadius: '6px',
    border: '1px solid var(--theme-elevation-200)',
    marginBottom: '16px',
  },
  fontTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
    color: 'var(--theme-text)',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  badgeDefault: {
    backgroundColor: 'var(--theme-elevation-200)',
    color: 'var(--theme-text)',
  },
  badgeSuccess: {
    backgroundColor: 'var(--theme-elevation-400)',
    color: 'var(--theme-bg)',
  },
  section: {
    marginBottom: '16px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  button: {
    padding: '8px 16px',
    border: '1px solid var(--theme-elevation-200)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.15s',
  },
  buttonDefault: {
    backgroundColor: 'var(--theme-elevation-0)',
    color: 'var(--theme-text)',
  },
  buttonActive: {
    backgroundColor: 'var(--theme-elevation-900)',
    color: 'var(--theme-bg)',
    border: '1px solid var(--theme-elevation-900)',
  },
  actionBar: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
    paddingTop: '12px',
    borderTop: '1px solid var(--theme-elevation-200)',
  },
  buttonSecondary: {
    padding: '8px 16px',
    backgroundColor: 'var(--theme-elevation-0)',
    color: 'var(--theme-text)',
    border: '1px solid var(--theme-elevation-200)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  buttonPrimary: {
    padding: '8px 16px',
    backgroundColor: 'var(--theme-elevation-900)',
    color: 'var(--theme-bg)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  buttonDisabled: {
    padding: '8px 16px',
    backgroundColor: 'var(--theme-elevation-200)',
    color: 'var(--theme-elevation-500)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
    fontSize: '13px',
    fontWeight: '500',
  },
  currentSelection: {
    padding: '12px',
    backgroundColor: 'var(--theme-elevation-100)',
    border: '1px solid var(--theme-elevation-300)',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentSelectionText: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--theme-text)',
  },
  clearButton: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    color: 'var(--theme-text)',
    border: '1px solid var(--theme-elevation-400)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
  },
  centerText: {
    padding: '20px',
    textAlign: 'center' as const,
    color: 'var(--theme-elevation-600)',
  },
}

export function FontFamilySearchField({ path }: { path: string }) {
  const familyPath = path
  const fontDataPath = familyPath.replace('.family', '.fontData')
  const { value: familyValue, setValue: setFamily } = useField<string>({ path: familyPath })
  const { setValue: setFontData } = useField<any>({ path: fontDataPath })

  const [searchTerm, setSearchTerm] = useState('')
  const [allFonts, setAllFonts] = useState<GoogleFont[]>([])
  const [filteredFonts, setFilteredFonts] = useState<GoogleFont[]>([])
  const [isLoadingFonts, setIsLoadingFonts] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedFont, setSelectedFont] = useState<GoogleFont | null>(null)
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedSubset, setSelectedSubset] = useState<string | null>(null)
  const [fontsCache, setFontsCache] = useState<{ fonts: GoogleFont[], timestamp: number } | null>(null)

  useEffect(() => {
    const loadFonts = async () => {
      try {
        setIsLoadingFonts(true)
        
        if (fontsCache && Date.now() - fontsCache.timestamp < 604800000) {
          setAllFonts(fontsCache.fonts)
          setIsLoadingFonts(false)
          return
        }

        const response = await fetch('https://api.fontsource.org/v1/fonts')
        if (!response.ok) throw new Error('Failed to fetch fonts')
        
        const fonts = await response.json()
        setAllFonts(fonts)
        setFontsCache({ fonts, timestamp: Date.now() })
        setIsLoadingFonts(false)
      } catch (error) {
        console.error('Error loading fonts:', error)
        setIsLoadingFonts(false)
      }
    }

    if (searchTerm && allFonts.length === 0) {
      loadFonts()
    }
  }, [searchTerm, allFonts.length, fontsCache])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredFonts([])
      setShowResults(false)
      return
    }

    const filtered = allFonts
      .filter((font) => font.family.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 50)
    
    setFilteredFonts(filtered)
    setShowResults(true)
  }, [searchTerm, allFonts])

  const handleFontSelect = (font: GoogleFont) => {
    setSelectedFont(font)
    setSearchTerm('')
    setShowResults(false)
    setSelectedWeight(font.variable ? 400 : (font.weights[0] || null))
    setSelectedStyle(font.styles[0] || null)
    setSelectedSubset(font.defSubset)
  }

  const handleSave = () => {
    if (!selectedFont || !selectedWeight || !selectedStyle || !selectedSubset) {
      alert('Please select weight, style, and subset')
      return
    }

    setFamily(selectedFont.family)
    setFontData({
      id: selectedFont.id,
      family: selectedFont.family,
      category: selectedFont.category,
      variable: selectedFont.variable,
      weight: selectedWeight,
      style: selectedStyle,
      subset: selectedSubset,
    })
    
    setSelectedFont(null)
    setSelectedWeight(null)
    setSelectedStyle(null)
    setSelectedSubset(null)
  }

  const handleClear = () => {
    setFamily('')
    setFontData(null)
    setSelectedFont(null)
    setSelectedWeight(null)
    setSelectedStyle(null)
    setSelectedSubset(null)
    setSearchTerm('')
  }

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <label style={styles.label}>Search Font Family</label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Type to search fonts (e.g., 'Roboto', 'Inter')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm && setShowResults(true)}
            style={styles.input}
          />
          
          {showResults && (
            <div style={styles.dropdown}>
              {isLoadingFonts ? (
                <div style={styles.centerText}>Loading fonts...</div>
              ) : filteredFonts.length > 0 ? (
                filteredFonts.map((font) => (
                  <div
                    key={font.id}
                    onClick={() => handleFontSelect(font)}
                    style={styles.dropdownItem}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-elevation-50)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={styles.dropdownTitle}>{font.family}</div>
                    <div style={styles.dropdownMeta}>
                      {font.category} • {font.variable ? 'Variable' : 'Static'} • {font.weights.length} weights
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.centerText}>No fonts found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedFont && (
        <div style={styles.configPanel}>
          <div style={styles.section}>
            <h3 style={styles.fontTitle}>{selectedFont.family}</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ ...styles.badge, ...styles.badgeDefault }}>
                {selectedFont.category}
              </span>
              <span style={{ ...styles.badge, ...(selectedFont.variable ? styles.badgeSuccess : styles.badgeDefault) }}>
                {selectedFont.variable ? 'Variable' : 'Static'}
              </span>
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>
              Weight {selectedFont.variable && '(Variable: 100-900)'}
            </label>
            {selectedFont.variable ? (
              <input
                type="number"
                min="100"
                max="900"
                step="1"
                value={selectedWeight || 400}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  if (val >= 100 && val <= 900) setSelectedWeight(val)
                }}
                style={styles.input}
                placeholder="Enter weight (100-900)"
              />
            ) : (
              <div style={styles.buttonGroup}>
                {selectedFont.weights.map((weight) => (
                  <button
                    key={weight}
                    type="button"
                    onClick={() => setSelectedWeight(weight)}
                    style={{
                      ...styles.button,
                      ...(selectedWeight === weight ? styles.buttonActive : styles.buttonDefault),
                    }}
                    onMouseEnter={(e) => {
                      if (selectedWeight !== weight) {
                        e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedWeight !== weight) {
                        e.currentTarget.style.backgroundColor = 'var(--theme-elevation-0)'
                      }
                    }}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Style</label>
            <div style={styles.buttonGroup}>
              {selectedFont.styles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  style={{
                    ...styles.button,
                    ...(selectedStyle === style ? styles.buttonActive : styles.buttonDefault),
                    textTransform: 'capitalize',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedStyle !== style) {
                      e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedStyle !== style) {
                      e.currentTarget.style.backgroundColor = 'var(--theme-elevation-0)'
                    }
                  }}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Character Subset</label>
            <div style={styles.buttonGroup}>
              {selectedFont.subsets.map((subset) => (
                <button
                  key={subset}
                  type="button"
                  onClick={() => setSelectedSubset(subset)}
                  style={{
                    ...styles.button,
                    ...(selectedSubset === subset ? styles.buttonActive : styles.buttonDefault),
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSubset !== subset) {
                      e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSubset !== subset) {
                      e.currentTarget.style.backgroundColor = 'var(--theme-elevation-0)'
                    }
                  }}
                >
                  {subset}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.actionBar}>
            <button type="button" onClick={() => setSelectedFont(null)} style={styles.buttonSecondary}>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!selectedWeight || !selectedStyle || !selectedSubset}
              style={(!selectedWeight || !selectedStyle || !selectedSubset) ? styles.buttonDisabled : styles.buttonPrimary}
            >
              Save Font
            </button>
          </div>
        </div>
      )}

      {familyValue && !selectedFont && (
        <div style={styles.currentSelection}>
          <div style={styles.currentSelectionText}>Current Font: {familyValue}</div>
          <button type="button" onClick={handleClear} style={styles.clearButton}>
            Clear
          </button>
        </div>
      )}
    </div>
  )
}