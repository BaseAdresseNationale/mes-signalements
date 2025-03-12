import React, { useEffect } from 'react'

import { GeoJSONSource, Layer, MapLayerMouseEvent, Source, useMap } from 'react-map-gl/maplibre'
import type { FeatureCollection } from 'geojson'
import { clusterLayers } from '../../config/map/layers'

interface ClusterMapProps {
  data: FeatureCollection
}

export function ClusterMap({ data }: Readonly<ClusterMapProps>) {
  const map = useMap()

  useEffect(() => {
    if (!map.current) {
      return
    }

    const onClick = async (event: MapLayerMouseEvent) => {
      if (!map.current) {
        return
      }
      const feature = event.features?.[0]
      if (!feature) {
        return
      }
      const clusterId = feature.properties.cluster_id

      const geojsonSource: GeoJSONSource = map.current.getSource('clusters') as GeoJSONSource

      const zoom = await geojsonSource.getClusterExpansionZoom(clusterId)

      map.current.easeTo({
        center: (feature.geometry as any).coordinates,
        zoom,
        duration: 500,
      })
    }

    clusterLayers.forEach((layer) => {
      if (map?.current) {
        map.current.on('click', layer.id, onClick)
      }
    })

    return () => {
      clusterLayers.forEach((layer) => {
        if (map?.current) {
          map.current.off('click', layer.id, onClick)
        }
      })
    }
  }, [map])

  return (
    <Source
      id='clusters'
      type='geojson'
      data={data}
      cluster={true}
      clusterMaxZoom={14}
      clusterRadius={50}
    >
      {clusterLayers.map((layer) => (
        <Layer key={layer.id} {...(layer as any)} />
      ))}
    </Source>
  )
}
