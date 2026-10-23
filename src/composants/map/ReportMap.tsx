import React, { useMemo } from 'react'
import { Layer } from 'react-map-gl/maplibre'
import { ExpressionSpecification } from '@maplibre/maplibre-gl-style-spec'
import { Marker } from './Marker'
import { ReportMapPosition, ReportParcelle, ReportRole } from '../../utils/report.utils'
import { PARCELLES_MINZOOM } from '../../config/map/layers'

// Rouge/vert du DSFR (background-flat-error/-success) et bleu du cadastre
const RED = '#ce0500'
const GREEN = '#18753c'
const BLUE = '#0053b3'

const INACTIVE_OPACITY = 0.45
const PARCELLE_ACTIVE_OPACITY = 0.5
const PARCELLE_INACTIVE_OPACITY = 0.15

function getMarkerColor({ change, role }: ReportMapPosition) {
  switch (change) {
    case 'unchanged':
      return BLUE
    case 'added':
      return GREEN
    case 'removed':
      return RED
    default:
      return role === 'existing' ? RED : GREEN
  }
}

const hasId = (ids: string[]): ExpressionSpecification | false =>
  ids.length > 0 ? ['in', ['get', 'id'], ['literal', ids]] : false

interface ReportMapProps {
  positions: ReportMapPosition[]
  parcelles: ReportParcelle[]
  activeRole: ReportRole
}

export default function ReportMap({ positions, parcelles, activeRole }: Readonly<ReportMapProps>) {
  const parcellePaint = useMemo(() => {
    const idsOf = (predicate: (parcelle: ReportParcelle) => boolean) =>
      parcelles.filter(predicate).map(({ id }) => id)

    // Une parcelle ajoutée appartient à la demande, une parcelle supprimée à l'existant.
    const activeIds = idsOf(
      ({ change }) =>
        change === 'unchanged' ||
        (change === 'added' ? activeRole === 'requested' : activeRole === 'existing'),
    )

    return {
      'fill-color': [
        'case',
        hasId(idsOf(({ change }) => change === 'removed')),
        RED,
        hasId(idsOf(({ change }) => change === 'added')),
        GREEN,
        BLUE,
      ] as ExpressionSpecification,
      'fill-opacity': [
        'case',
        hasId(activeIds),
        PARCELLE_ACTIVE_OPACITY,
        PARCELLE_INACTIVE_OPACITY,
      ] as ExpressionSpecification,
    }
  }, [parcelles, activeRole])

  return (
    <>
      {parcelles.length > 0 && (
        <Layer
          id='report-parcelles'
          type='fill'
          source='cadastre'
          source-layer='parcelles'
          minzoom={PARCELLES_MINZOOM}
          filter={hasId(parcelles.map(({ id }) => id)) as ExpressionSpecification}
          paint={parcellePaint}
          beforeId='parcelles'
        />
      )}
      {positions.map((position) => (
        <Marker
          key={`${position.role}-${position.label}-${position.coordinates.join(',')}`}
          label={position.label}
          coordinates={position.coordinates}
          color={getMarkerColor(position)}
          opacity={
            position.change === 'unchanged' || position.role === activeRole ? 1 : INACTIVE_OPACITY
          }
        />
      ))}
    </>
  )
}
