import React, { useEffect, useState } from 'react'
import { Layer, MapLayerMouseEvent, Popup, Source, useMap } from 'react-map-gl/maplibre'
import { signalementPointsLayer } from '../../config/map/layers'
import { Signalement } from '../../api/signalement'
import SignalementCard from '../signalement/SignalementCard'

export function SignalementsSearchMap() {
  const map = useMap()
  const [selectedSignalement, setSelectedSignalement] = useState<{
    point: number[]
    signalement: Signalement
  } | null>(null)

  useEffect(() => {
    if (!map.current) {
      return
    }

    const handleSelect = (e: MapLayerMouseEvent) => {
      if (!map.current || !e.features) {
        return
      }

      if (e.features.length > 0) {
        setSelectedSignalement({
          point: e.lngLat.toArray(),
          signalement: {
            ...e.features[0].properties,
            createdAt: JSON.parse(e.features[0].properties.createdAt),
            updatedAt: JSON.parse(e.features[0].properties.updatedAt),
            changesRequested: JSON.parse(e.features[0].properties.changesRequested),
            existingLocation: JSON.parse(e.features[0].properties.existingLocation),
          } as Signalement,
        })
      }
    }

    if (map?.current) {
      map.current.on('click', signalementPointsLayer.id, handleSelect)
    }

    return () => {
      if (map?.current) {
        map.current.off('click', signalementPointsLayer.id, handleSelect)
      }
    }
  }, [map])

  return (
    <>
      {selectedSignalement && (
        <Popup
          offset={25}
          longitude={selectedSignalement.point[0]}
          latitude={selectedSignalement.point[1]}
          anchor='bottom'
          closeButton={true}
          onClose={() => setSelectedSignalement(null)}
        >
          <SignalementCard signalement={selectedSignalement.signalement} />
        </Popup>
      )}
      <Source
        id='api-signalement'
        type='vector'
        tiles={[`${process.env.REACT_APP_API_SIGNALEMENT_URL}/signalements/tiles/{z}/{x}/{y}.pbf`]}
        minzoom={10}
        maxzoom={14}
        promoteId='id'
      >
        <Layer key={signalementPointsLayer.id} {...(signalementPointsLayer as any)} />
      </Source>
    </>
  )
}
