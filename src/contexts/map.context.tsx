import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { MapRef } from 'react-map-gl/maplibre'
import { mapStyles } from '../config/map/styles'
import { DEFAULT_COLOR_DARK } from '../config/map/layers'

interface MapContextValue {
  mapRef: MapRef | null
  mapRefCb: (instance: MapRef | null) => void
  mapChildren: React.ReactNode | null
  setMapChildren: (children: React.ReactNode) => void
  markerColor: string
}

export const MapContext = createContext<MapContextValue>({
  mapRef: null,
  mapRefCb: () => {},
  mapChildren: null,
  setMapChildren: () => {},
  markerColor: DEFAULT_COLOR_DARK,
})

export function MapContextProvider(props: { children: React.ReactNode }) {
  const [mapRef, setMapRef] = useState<MapRef | null>(null)
  const mapRefCb = useCallback((node: MapRef | null) => {
    if (node !== null) {
      setMapRef(node)
    }
  }, [])
  const [markerColor, setMarkerColor] = useState(DEFAULT_COLOR_DARK)
  const [mapChildren, setMapChildren] = useState<React.ReactNode>(null)

  useEffect(() => {
    if (!mapRef) return

    const markerColorListener = () => {
      const curStyle = mapRef.getStyle()
      const layerColor =
        mapStyles.find(({ id }) => id === curStyle?.name)?.layersColor || DEFAULT_COLOR_DARK
      setMarkerColor(layerColor)
    }

    mapRef.on('styledata', markerColorListener)

    return () => {
      mapRef.off('styledata', markerColorListener)
    }
  }, [mapRef])

  const value = useMemo(
    () => ({ mapRef, mapRefCb, mapChildren, setMapChildren, markerColor }),
    [mapRef, mapRefCb, mapChildren, setMapChildren, markerColor],
  )

  return <MapContext.Provider value={value} {...props} />
}

export default MapContext
