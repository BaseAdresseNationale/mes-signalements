import React, { useEffect, useState } from 'react'
import { Marker, MarkerProps } from './Marker'
import { useMap } from 'react-map-gl/maplibre'

interface ClusteredMarkerProps extends MarkerProps {
  id: string
}

export function ClusteredMarker({ id, ...props }: ClusteredMarkerProps) {
  const [show, setShow] = useState(false)
  const map = useMap()

  useEffect(() => {
    if (!map.current) {
      return
    }

    const isInsideCluster = () => {
      const features =
        map.current && map.current.queryRenderedFeatures({ layers: ['unclustered-point'] })
      const featureIds = features?.map((feature) => feature.properties.id) || []

      setShow(featureIds.includes(id))
    }

    map.current.on('idle', isInsideCluster)

    return () => {
      if (map.current) {
        map.current.off('idle', isInsideCluster)
      }
    }
  }, [id, map])

  return show ? <Marker {...props} /> : null
}
