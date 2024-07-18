import React, { useEffect, useRef, useState } from 'react'
import { Layer, MapLayerMouseEvent, Source, useMap } from 'react-map-gl/maplibre'
import { getBanLayers } from '../../config/map/layers'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'

interface AdresseSearchMapProps {
  layers?: string[]
  filter?: any
}

export function AdresseSearchMap({ layers, filter }: AdresseSearchMapProps) {
  const map = useMap()
  const { navigate } = useNavigateWithPreservedSearchParams()
  const [banLayers] = useState(getBanLayers(layers, filter))
  const hoveredStateId = useRef<{ id: string; source: string; sourceLayer: string } | null>(null)

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

    const handleMouseMove = (e: MapLayerMouseEvent) => {
      if (!map.current || !e.features) {
        return
      }

      if (e.features.length > 0) {
        if (hoveredStateId.current) {
          map.current.setFeatureState(
            {
              ...hoveredStateId.current,
            },
            { hover: false },
          )
        }
        hoveredStateId.current = {
          id: e.features[0].id as string,
          source: e.features[0].source as string,
          sourceLayer: e.features[0].sourceLayer as string,
        }
        map.current.setFeatureState(
          {
            ...hoveredStateId.current,
          },
          { hover: true },
        )
      }
    }

    const handleMouseLeave = () => {
      if (hoveredStateId.current && map.current) {
        map.current.setFeatureState(
          {
            ...hoveredStateId.current,
          },
          { hover: false },
        )
        hoveredStateId.current = null
      }
    }

    banLayers.forEach((layer) => {
      if (map?.current) {
        map.current.on('click', layer.id, handleSelect)
        map.current.on('mousemove', layer.id, handleMouseMove)
        map.current.on('mouseleave', layer.id, handleMouseLeave)
      }
    })

    return () => {
      banLayers.forEach((layer) => {
        if (map?.current) {
          map.current.off('click', layer.id, handleSelect)
          map.current.off('mousemove', layer.id, handleMouseMove)
          map.current.off('mouseleave', layer.id, handleMouseLeave)
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
