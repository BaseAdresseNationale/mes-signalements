import { useContext, useEffect, useRef } from 'react'
import MapContext from '../contexts/map.context'
import LayoutContext from '../contexts/layout.context'

export function AdresseSearchPage() {
  const { mapRef, setAdresseSearchMapLayersOptions, setSignalementSearchMapLayerOptions } =
    useContext(MapContext)
  const { setShowSearch } = useContext(LayoutContext)

  useEffect(() => {
    setAdresseSearchMapLayersOptions({
      adresse: {},
      'adresse-label': {},
      voie: {},
      toponyme: {},
    })
    setSignalementSearchMapLayerOptions({})
  }, [setAdresseSearchMapLayersOptions, setSignalementSearchMapLayerOptions])

  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const map = mapRef?.getMap()
    if (!map) return

    const clearIdleTimeout = () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current)
        idleTimeoutRef.current = null
      }
    }

    const handleInteractionStart = () => {
      clearIdleTimeout()
      setShowSearch(false)
    }

    const handleInteractionEnd = () => {
      clearIdleTimeout()
      idleTimeoutRef.current = setTimeout(() => {
        setShowSearch(true)
      }, 1000)
    }

    setShowSearch(true)
    map.on('movestart', handleInteractionStart)
    map.on('zoomstart', handleInteractionStart)
    map.on('rotatestart', handleInteractionStart)
    map.on('moveend', handleInteractionEnd)
    map.on('zoomend', handleInteractionEnd)
    map.on('rotateend', handleInteractionEnd)

    return () => {
      clearIdleTimeout()
      map.off('movestart', handleInteractionStart)
      map.off('zoomstart', handleInteractionStart)
      map.off('rotatestart', handleInteractionStart)
      map.off('moveend', handleInteractionEnd)
      map.off('zoomend', handleInteractionEnd)
      map.off('rotateend', handleInteractionEnd)
    }
  }, [mapRef, setShowSearch])

  return null
}
