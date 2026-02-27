import React from 'react'
import { MarkerDragEvent } from 'react-map-gl/dist/esm/types'
import { Marker as _Marker } from 'react-map-gl/maplibre'
import styled from 'styled-components'

export interface MarkerProps {
  coordinates: [number, number]
  onDragEnd: (event: MarkerDragEvent<any>) => void
}

const StyledMarker = styled(_Marker)`
  svg {
    position: absolute;
    bottom: 0;
    left: -5px;
  }
`

export function AlertMarker({ coordinates, onDragEnd }: MarkerProps) {
  return (
    <StyledMarker
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      anchor='bottom-left'
      draggable={true}
      onDragEnd={onDragEnd}
    >
      <svg width='40' height='48' viewBox='0 0 40 48' xmlns='http://www.w3.org/2000/svg'>
        <line x1='6' y1='2' x2='6' y2='46' stroke='white' strokeWidth='5' strokeLinecap='round' />
        <line x1='6' y1='2' x2='6' y2='46' stroke='#333' strokeWidth='2.5' strokeLinecap='round' />
        <path
          d='M6 4 L36 10 L6 22 Z'
          fill='none'
          stroke='white'
          strokeWidth='3'
          strokeLinejoin='round'
        />
        <path d='M6 4 L36 10 L6 22 Z' fill='#E1000F' stroke='#b0000c' strokeWidth='0.5' />
        <circle cx='6' cy='46' r='4' fill='white' />
        <circle cx='6' cy='46' r='2.5' fill='#333' />
      </svg>
    </StyledMarker>
  )
}
