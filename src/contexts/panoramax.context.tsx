import React, { createContext, useMemo, useState } from 'react'

export interface PanoramaxSavedView {
  center: { lng: number; lat: number }
  zoom: number
  pitch: number
  bearing: number
}

interface PanoramaxContextValue {
  showPanoramax: boolean
  setShowPanoramax: (show: boolean) => void
  isDiving: boolean
  setIsDiving: (diving: boolean) => void
  savedView: PanoramaxSavedView | null
  setSavedView: (view: PanoramaxSavedView | null) => void
}

export const PanoramaxContext = createContext<PanoramaxContextValue>({
  showPanoramax: false,
  setShowPanoramax: () => {},
  isDiving: false,
  setIsDiving: () => {},
  savedView: null,
  setSavedView: () => {},
})

export function PanoramaxContextProvider({ children }: { children: React.ReactNode }) {
  const [showPanoramax, setShowPanoramax] = useState(false)
  const [isDiving, setIsDiving] = useState(false)
  const [savedView, setSavedView] = useState<PanoramaxSavedView | null>(null)

  const value = useMemo(
    () => ({
      showPanoramax,
      setShowPanoramax,
      isDiving,
      setIsDiving,
      savedView,
      setSavedView,
    }),
    [showPanoramax, isDiving, savedView],
  )

  return <PanoramaxContext.Provider value={value}>{children}</PanoramaxContext.Provider>
}

export default PanoramaxContext
