import React, { useContext, useEffect, useState } from 'react'
import { Layer, MapLayerMouseEvent, Popup, Source, useMap } from 'react-map-gl/maplibre'
import { signalementPointsLayer } from '../../config/map/layers'
import { Signalement } from '../../api/signalement'
import SignalementCard from '../signalement/SignalementCard'
import { SignalementViewerContext } from '../../contexts/signalement-viewer.context'

const getSignalementFromFeature = (feature: any): Signalement => {
  return {
    ...feature.properties,
    createdAt: JSON.parse(feature.properties.createdAt),
    updatedAt: JSON.parse(feature.properties.updatedAt),
    changesRequested: JSON.parse(feature.properties.changesRequested),
    existingLocation: JSON.parse(feature.properties.existingLocation),
    source: JSON.parse(feature.properties.source),
  }
}

export function SignalementsSearchMap() {
  const map = useMap()
  const { setViewedSignalement } = useContext(SignalementViewerContext)
  const [hoveredSignalement, setHoveredSignalement] = useState<{
    point: number[]
    signalement: Signalement
  } | null>(null)

  useEffect(() => {
    if (!map.current) {
      return
    }

    const handleMouseMove = (e: MapLayerMouseEvent) => {
      if (!map.current || !e.features) {
        return
      }

      if (e.features.length > 0) {
        setHoveredSignalement({
          point: e.lngLat.toArray(),
          signalement: getSignalementFromFeature(e.features[0]),
        })
      }
    }

    const handleMouseLeave = () => {
      setHoveredSignalement(null)
    }

    const handleSelect = (e: MapLayerMouseEvent) => {
      if (!map.current || !e.features) {
        return
      }

      if (e.features.length > 0) {
        setViewedSignalement(getSignalementFromFeature(e.features[0]))
      }
    }

    if (map?.current) {
      map.current.on('click', signalementPointsLayer.id, handleSelect)
      map.current.on('mousemove', signalementPointsLayer.id, handleMouseMove)
      map.current.on('mouseleave', signalementPointsLayer.id, handleMouseLeave)
    }

    return () => {
      if (map?.current) {
        map.current.off('click', signalementPointsLayer.id, handleSelect)
        map.current.off('mousemove', signalementPointsLayer.id, handleMouseMove)
        map.current.off('mouseleave', signalementPointsLayer.id, handleMouseLeave)
      }
    }
  }, [map])

  return (
    <>
      {hoveredSignalement && (
        <Popup
          offset={15}
          longitude={hoveredSignalement.point[0]}
          latitude={hoveredSignalement.point[1]}
          anchor='bottom'
        >
          <SignalementCard signalement={hoveredSignalement.signalement} />
        </Popup>
      )}
      <Source
        id='api-signalement'
        type='vector'
        tiles={[
          `${process.env.REACT_APP_API_SIGNALEMENT_URL}/signalements/tiles/{z}/{x}/{y}.pbf?status=${Signalement.status.PENDING}`,
        ]}
        minzoom={10}
        maxzoom={14}
        promoteId='id'
      >
        <Layer key={signalementPointsLayer.id} {...(signalementPointsLayer as any)} />
      </Source>
    </>
  )
}
