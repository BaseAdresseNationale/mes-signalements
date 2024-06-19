import { useContext, useEffect } from 'react'
import MapContext from '../contexts/map.context'

export function useMapContent(mapContent: React.ReactNode) {
  const { setMapChildren } = useContext(MapContext)
  useEffect(() => {
    setMapChildren(mapContent)
    return () => {
      setMapChildren(null)
    }
  }, [setMapChildren, mapContent])
}
