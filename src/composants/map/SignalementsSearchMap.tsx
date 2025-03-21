import React, { useContext, useEffect, useState } from 'react'
import { Layer, LayerProps, MapLayerMouseEvent, Popup, Source, useMap } from 'react-map-gl/maplibre'
import { signalementPointsLayer } from '../../config/map/layers'
import { Signalement } from '../../api/signalement'
import SignalementCard from '../signalement/SignalementCard'
import { SignalementViewerContext } from '../../contexts/signalement-viewer.context'
import { getSignalementFromFeatureAPISignalement } from '../../utils/signalement.utils'

interface SignalementSearchMapProps {
  options: Partial<LayerProps>
}

export function SignalementsSearchMap({ options }: Readonly<SignalementSearchMapProps>) {
  const map = useMap()
  const { setViewedSignalement } = useContext(SignalementViewerContext)
  const [hoveredSignalement, setHoveredSignalement] = useState<Signalement | null>(null)

  useEffect(() => {
    if (!map.current) {
      return
    }

    const handleMouseMove = (e: MapLayerMouseEvent) => {
      if (!map.current || !e.features) {
        return
      }

      if (e.features.length > 0) {
        const feature = e.features[0]
        setHoveredSignalement({
          ...getSignalementFromFeatureAPISignalement(feature),
          point: feature.geometry,
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
        setViewedSignalement(getSignalementFromFeatureAPISignalement(e.features[0]))
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
          offset={-5}
          longitude={hoveredSignalement.point.coordinates[0]}
          latitude={hoveredSignalement.point.coordinates[1]}
          anchor='bottom'
          closeButton={false}
        >
          <SignalementCard signalement={hoveredSignalement} />
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
        <Layer key={signalementPointsLayer.id} {...(signalementPointsLayer as any)} {...options} />
      </Source>
    </>
  )
}
