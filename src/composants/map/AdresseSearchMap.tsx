import React, { useContext, useEffect, useState } from 'react'
import { Layer, MapLayerMouseEvent, Source, useMap } from 'react-map-gl/maplibre'
import { DEFAULT_COLOR_DARK, getBanLayers } from '../../config/map/layers'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'
import MapContext from '../../contexts/map.context'

export function AdresseSearchMap() {
  const map = useMap()
  const { markerColor } = useContext(MapContext)
  const { navigate } = useNavigateWithPreservedSearchParams()
  const [banLayers, setBanLayers] = useState(getBanLayers(DEFAULT_COLOR_DARK))

  // Add select handlers to BAN layers
  useEffect(() => {
    if (!map.current) {
      return
    }

    const handleSelect = (e: MapLayerMouseEvent) => {
      if (e?.features?.length && e.features[0]?.id) {
        navigate(`/${e.features[0].id}`)
      }
    }

    banLayers.forEach((layer) => {
      if (map?.current) {
        map.current.on('click', layer.id, handleSelect)
      }
    })

    return () => {
      banLayers.forEach((layer) => {
        if (map?.current) {
          map.current.off('click', layer.id, handleSelect)
        }
      })
    }
  }, [map, navigate])

  // Update BAN layers on markerColor change
  useEffect(() => {
    setBanLayers(getBanLayers(markerColor))
  }, [markerColor])

  return (
    <Source
      id='base-adresse-nationale'
      type='vector'
      tiles={[`${process.env.REACT_APP_BAN_PLATEFORME_URL}/tiles/ban/{z}/{x}/{y}.pbf`]}
      minzoom={10}
      maxzoom={14}
      promoteId='id'
    >
      {banLayers.map((layer) => (
        <Layer key={layer.id} {...(layer as any)} />
      ))}
    </Source>
  )
}
