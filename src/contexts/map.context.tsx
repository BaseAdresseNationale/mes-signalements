import React, { createContext, useRef, useState } from 'react'
import { MapRef } from 'react-map-gl/maplibre'

interface MapContextValue {
  mapRef: React.RefObject<MapRef> | null
  mapChildren: React.ReactNode | null
  setMapChildren: (children: React.ReactNode) => void
}

export const MapContext = createContext<MapContextValue>({
  mapRef: null,
  mapChildren: null,
  setMapChildren: () => {},
})

export function MapContextProvider(props: { children: React.ReactNode }) {
  const mapRef = useRef<MapRef>(null)
  const [mapChildren, setMapChildren] = useState<React.ReactNode>(null)

  const value = {
    mapRef,
    mapChildren,
    setMapChildren,
  }

  return <MapContext.Provider value={value} {...props} />
}

export default MapContext
