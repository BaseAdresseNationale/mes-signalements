import React, { useEffect } from 'react'
import { Signalement } from '../../api/signalement'
import { FeatureCollection, Geometry } from 'geojson'
import {
  GeoJSONSource,
  Layer,
  MapLayerMouseEvent,
  Popup,
  Source,
  useMap,
} from 'react-map-gl/maplibre'
import SignalementCard from '../signalement/SignalementCard'
import { clusterLayers, clusters, unclusteredPoint } from '../../config/map/layers'

interface SignalementBrowserMapProps {
  signalements: Signalement[]
  onSelectSignalement: (signalement: Signalement) => void
  hoveredSignalement?: Signalement
  setHoveredSignalement: (hoveredSignalement?: Signalement) => void
}

const safelyParseJSON = (jsonString: string | undefined): any => {
  try {
    return jsonString ? JSON.parse(jsonString) : null
  } catch (error) {
    console.error('Failed to parse JSON:', { error, jsonString })
    return null
  }
}

const getSignalementFromFeature = (feature: any): Signalement => {
  const signalement = {
    ...feature.properties,
    changesRequested: safelyParseJSON(feature.properties.changesRequested),
    existingLocation: safelyParseJSON(feature.properties.existingLocation),
    source: safelyParseJSON(feature.properties.source),
    processedBy: safelyParseJSON(feature.properties.processedBy),
    point: feature.geometry,
  }

  return signalement as Signalement
}

export default function SignalementBrowserMap({
  signalements,
  onSelectSignalement,
  hoveredSignalement,
  setHoveredSignalement,
}: SignalementBrowserMapProps) {
  const map = useMap()

  useEffect(() => {
    if (!map.current) {
      return
    }

    const handleMouseMove = (e: MapLayerMouseEvent) => {
      if (!map.current || !e.features) {
        return
      }

      if (e.features.length > 0) {
        setHoveredSignalement(getSignalementFromFeature(e.features[0]))
      }
    }

    const handleMouseLeave = () => {
      setHoveredSignalement(undefined)
    }

    const handleClickCluster = async (event: MapLayerMouseEvent) => {
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

    const handleClickSignalement = (event: MapLayerMouseEvent) => {
      if (!map.current) {
        return
      }

      const feature = event.features?.[0]
      if (!feature) {
        return
      }

      onSelectSignalement(getSignalementFromFeature(feature))
    }

    if (map?.current) {
      map.current.on('click', clusters.id, handleClickCluster)
      map.current.on('click', unclusteredPoint.id, handleClickSignalement)
      map.current.on('mousemove', unclusteredPoint.id, handleMouseMove)
      map.current.on('mouseleave', unclusteredPoint.id, handleMouseLeave)
    }

    return () => {
      if (map?.current) {
        map.current.off('click', clusters.id, handleClickCluster)
        map.current.off('click', unclusteredPoint.id, handleClickSignalement)
        map.current.off('mousemove', unclusteredPoint.id, handleMouseMove)
        map.current.off('mouseleave', unclusteredPoint.id, handleMouseLeave)
      }
    }
  }, [map])

  const signalementWithCoordinates = signalements.filter(({ point }) => {
    return Boolean(point)
  })

  const data: FeatureCollection = {
    type: 'FeatureCollection',
    features: signalementWithCoordinates.map(({ point, ...rest }) => ({
      type: 'Feature',
      geometry: point as Geometry,
      properties: { ...rest },
    })),
  }

  return (
    <>
      {hoveredSignalement && (
        <Popup
          offset={22}
          longitude={hoveredSignalement.point.coordinates[0]}
          latitude={hoveredSignalement.point.coordinates[1]}
          anchor='bottom'
          closeButton={false}
        >
          <SignalementCard signalement={hoveredSignalement} />
        </Popup>
      )}
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
    </>
  )
}
