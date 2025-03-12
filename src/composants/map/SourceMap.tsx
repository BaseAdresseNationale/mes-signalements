import React from 'react'
import { Signalement } from '../../api/signalement'
import { FeatureCollection } from 'geojson'
import { getSignalementColorHex, getSignalementCoodinates } from '../../utils/signalement.utils'
import { ClusterMap } from './ClusterMap'
import { ClusteredMarker } from './ClusteredMarker'
import SignalementCard from '../signalement/SignalementCard'

interface SourceMapProps {
  signalements: Signalement[]
  onSelectSignalement: (signalement: Signalement) => void
  hoveredSignalement?: Signalement
}

export default function SourceMap({
  signalements,
  onSelectSignalement,
  hoveredSignalement,
}: SourceMapProps) {
  const signalementWithCoordinates = signalements.filter((signalement) => {
    const coords = getSignalementCoodinates(signalement)
    return coords?.every((coord) => coord !== null)
  })

  const clustersData: FeatureCollection = {
    type: 'FeatureCollection',
    features: signalementWithCoordinates.map((signalement) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: getSignalementCoodinates(signalement) as [number, number],
      },
      properties: { id: signalement.id },
    })),
  }

  return (
    <>
      <ClusterMap data={clustersData} />
      {signalementWithCoordinates.map((signalement: Signalement) => {
        return (
          <ClusteredMarker
            key={signalement.id}
            id={signalement.id}
            color={getSignalementColorHex(signalement.type)}
            coordinates={getSignalementCoodinates(signalement) as [number, number]}
            popupContent={<SignalementCard signalement={signalement} />}
            showPopup={hoveredSignalement?.id === signalement.id}
            onClick={() => onSelectSignalement(signalement)}
          />
        )
      })}
    </>
  )
}
