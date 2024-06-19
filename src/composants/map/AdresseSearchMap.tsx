import React, { useEffect } from 'react'
import { Layer, MapLayerMouseEvent, Source, useMap } from 'react-map-gl/maplibre'
import {
  adresseCircleLayer,
  adresseLabelLayer,
  toponymeLayer,
  voieLayer,
} from '../../composants/map/layers'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'

const banLayers = [adresseCircleLayer, adresseLabelLayer, voieLayer, toponymeLayer]

export function AdresseSearchMap() {
  const map = useMap()
  const { navigate } = useNavigateWithPreservedSearchParams()

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
