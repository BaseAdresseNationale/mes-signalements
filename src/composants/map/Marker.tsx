import React from 'react'
import { MarkerDragEvent } from 'react-map-gl/dist/esm/types'
import { Marker as _Marker } from 'react-map-gl/maplibre'
import styled from 'styled-components'

const StyledMarker = styled(_Marker)`
  .map-pin-label {
    font-size: 12px;
    font-weight: bold;
    position: absolute;
    top: -20px;
    white-space: nowrap;
    transform: translateX(calc(-50% + 10px));
  }
`

interface MarkerProps {
  label: string
  coordinates: [number, number]
  color: string
  onDragEnd?: (event: MarkerDragEvent<any>) => void
}

export function Marker({ label, coordinates, color, onDragEnd }: MarkerProps) {
  return (
    <StyledMarker
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      anchor='bottom'
      {...(onDragEnd ? { draggable: true, onDragEnd } : {})}
    >
      <label className='map-pin-label' style={{ color }}>
        {label}
      </label>
      <span className='fr-icon-map-pin-2-fill' aria-hidden='true' style={{ color }} />
    </StyledMarker>
  )
}
