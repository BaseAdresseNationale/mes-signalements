import React, { useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { FeatureCollection, LineString } from 'geojson'
import { Marker } from './Marker'
import { ReportMapPosition } from '../../utils/report.utils'

// Rouge/vert du DSFR (background-flat-error / background-flat-success)
export const REPORT_POSITION_COLORS: Record<ReportMapPosition['role'], string> = {
  existing: '#ce0500',
  requested: '#18753c',
}

interface ReportMapProps {
  positions: ReportMapPosition[]
}

export default function ReportMap({ positions }: Readonly<ReportMapProps>) {
  const links = useMemo<FeatureCollection<LineString>>(() => {
    const existing = positions.filter(({ role }) => role === 'existing')
    const requested = positions.filter(({ role }) => role === 'requested')

    return {
      type: 'FeatureCollection',
      features: existing.flatMap((from) =>
        requested
          .filter((to) => requested.length === 1 || to.type === from.type)
          .map((to) => ({
            type: 'Feature' as const,
            properties: {},
            geometry: {
              type: 'LineString' as const,
              coordinates: [from.coordinates, to.coordinates],
            },
          })),
      ),
    }
  }, [positions])

  return (
    <>
      {links.features.length > 0 && (
        <Source id='report-links' type='geojson' data={links}>
          <Layer
            id='report-links'
            type='line'
            paint={{ 'line-color': '#161616', 'line-width': 2, 'line-dasharray': [2, 2] }}
          />
        </Source>
      )}
      {positions.map(({ coordinates, label, role }) => (
        <Marker
          key={`${role}-${label}-${coordinates.join(',')}`}
          label={label}
          coordinates={coordinates}
          color={REPORT_POSITION_COLORS[role]}
        />
      ))}
    </>
  )
}
