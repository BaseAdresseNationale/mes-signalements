import React, { useContext, useEffect, useState } from 'react'
import { Layer, LayerProps, MapLayerMouseEvent, Popup, Source, useMap } from 'react-map-gl/maplibre'
import {
  alertPointsLayer,
  APISignalementTiles,
  signalementPointsLayer,
} from '../../config/map/layers'
import { Alert, Signalement } from '../../api/signalement'
import SignalementCard from '../signalement/SignalementCard'
import { getSignalementFromFeatureAPISignalement } from '../../utils/signalement.utils'
import { getAlertFromFeatureAPISignalement } from '../../utils/alert.utils'
import AlertCard from '../alert/AlertCard'
import { SignalementViewerContext } from '../../contexts/signalement-viewer.context'

interface SignalementSearchMapProps {
  options: Partial<LayerProps>
}

enum FeatureType {
  SIGNALMENT = 'SIGNALMENT',
  ALERT = 'ALERT',
}

export function SignalementsSearchMap({ options }: Readonly<SignalementSearchMapProps>) {
  const map = useMap()
  const { setViewedSignalement } = useContext(SignalementViewerContext)
  const [hoveredFeature, setHoveredFeature] = useState<{
    type: FeatureType
    data: Signalement | Alert
    point: any
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
        const feature = e.features[0]
        if (feature.layer.id === signalementPointsLayer.id) {
          const signalement = getSignalementFromFeatureAPISignalement(feature)
          setHoveredFeature({
            type: FeatureType.SIGNALMENT,
            data: signalement,
            point: feature.geometry,
          })
        } else if (feature.layer.id === alertPointsLayer.id) {
          const alert = getAlertFromFeatureAPISignalement(feature)
          setHoveredFeature({
            type: FeatureType.ALERT,
            data: alert,
            point: feature.geometry,
          })
        }
      }
    }

    const handleMouseLeave = () => {
      setHoveredFeature(null)
    }

    const handleSelect = (e: MapLayerMouseEvent) => {
      if (!map.current || !e.features) {
        return
      }

      if (e.features.length > 0) {
        const feature = e.features[0]
        if (feature.layer.id === signalementPointsLayer.id) {
          setViewedSignalement(getSignalementFromFeatureAPISignalement(feature))
        }
      }
    }

    if (map?.current) {
      map.current.on('click', signalementPointsLayer.id, handleSelect)
      map.current.on('mousemove', signalementPointsLayer.id, handleMouseMove)
      map.current.on('mouseleave', signalementPointsLayer.id, handleMouseLeave)

      map.current.on('mousemove', alertPointsLayer.id, handleMouseMove)
      map.current.on('mouseleave', alertPointsLayer.id, handleMouseLeave)
    }

    return () => {
      if (map?.current) {
        map.current.off('click', signalementPointsLayer.id, handleSelect)
        map.current.off('mousemove', signalementPointsLayer.id, handleMouseMove)
        map.current.off('mouseleave', signalementPointsLayer.id, handleMouseLeave)

        map.current.off('mousemove', alertPointsLayer.id, handleMouseMove)
        map.current.off('mouseleave', alertPointsLayer.id, handleMouseLeave)
      }
    }
  }, [map])

  return (
    <>
      {hoveredFeature && hoveredFeature.type === FeatureType.SIGNALMENT && (
        <Popup
          offset={-5}
          longitude={hoveredFeature.point.coordinates[0]}
          latitude={hoveredFeature.point.coordinates[1]}
          anchor='bottom'
          closeButton={false}
        >
          <SignalementCard signalement={hoveredFeature.data as Signalement} />
        </Popup>
      )}
      {hoveredFeature && hoveredFeature.type === FeatureType.ALERT && (
        <Popup
          offset={5}
          longitude={hoveredFeature.point.coordinates[0]}
          latitude={hoveredFeature.point.coordinates[1]}
          anchor='top'
          closeButton={false}
        >
          <AlertCard alert={hoveredFeature.data as Alert} />
        </Popup>
      )}
      <Source
        id='api-signalement'
        type='vector'
        tiles={APISignalementTiles}
        minzoom={10}
        maxzoom={14}
        promoteId='id'
      >
        <Layer key={signalementPointsLayer.id} {...(signalementPointsLayer as any)} {...options} />
        <Layer key={alertPointsLayer.id} {...(alertPointsLayer as any)} {...options} />
      </Source>
    </>
  )
}
