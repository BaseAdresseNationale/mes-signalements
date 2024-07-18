import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { MapRef } from 'react-map-gl/maplibre'

interface MapContextValue {
  mapRef: MapRef | null
  mapRefCb: (instance: MapRef | null) => void
  mapChildren: React.ReactNode | null
  setMapChildren: (children: React.ReactNode) => void
  showCadastre: boolean
  setShowCadastre: React.Dispatch<React.SetStateAction<boolean>>
  editParcelles: boolean
  setEditParcelles: React.Dispatch<React.SetStateAction<boolean>>
}

export const MapContext = createContext<MapContextValue>({
  mapRef: null,
  mapRefCb: () => {},
  mapChildren: null,
  setMapChildren: () => {},
  showCadastre: false,
  setShowCadastre: () => {},
  editParcelles: false,
  setEditParcelles: () => {},
})

export function MapContextProvider(props: { children: React.ReactNode }) {
  const [mapRef, setMapRef] = useState<MapRef | null>(null)
  const mapRefCb = useCallback((node: MapRef | null) => {
    if (node !== null) {
      setMapRef(node)
    }
  }, [])
  const [mapChildren, setMapChildren] = useState<React.ReactNode>(null)
  const [showCadastre, setShowCadastre] = useState(false)
  const [editParcelles, setEditParcelles] = useState(false)

  // Update cadastre toggle button
  useEffect(() => {
    const cadastreToggleBtn = document.getElementById('cadastre-toggle')
    if (cadastreToggleBtn) {
      cadastreToggleBtn.title = showCadastre ? 'Masquer le cadastre' : 'Afficher le cadastre'
      showCadastre
        ? cadastreToggleBtn.classList.add('active')
        : cadastreToggleBtn.classList.remove('active')
    }
  }, [showCadastre])

  useEffect(() => {
    if (!showCadastre && editParcelles) {
      setEditParcelles(false)
    }
  }, [showCadastre, editParcelles])

  const value = useMemo(
    () => ({
      mapRef,
      mapRefCb,
      mapChildren,
      setMapChildren,
      showCadastre,
      setShowCadastre,
      editParcelles,
      setEditParcelles,
    }),
    [
      mapRef,
      mapRefCb,
      mapChildren,
      setMapChildren,
      showCadastre,
      setShowCadastre,
      editParcelles,
      setEditParcelles,
    ],
  )

  return <MapContext.Provider value={value} {...props} />
}

export default MapContext
