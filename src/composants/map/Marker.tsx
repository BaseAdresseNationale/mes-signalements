import React, { useState } from 'react'
import { MarkerDragEvent, MarkerEvent } from 'react-map-gl/dist/esm/types'
import { Marker as _Marker, Popup } from 'react-map-gl/maplibre'
import styled from 'styled-components'
import { DEFAULT_COLOR_DARK } from '../../config/map/layers'

const StyledMarker = styled(_Marker)`
  .map-pin-label {
    font-size: 14px;
    font-weight: bold;
    position: absolute;
    top: -20px;
    white-space: nowrap;
    transform: translateX(calc(-50% + 10px));
    text-shadow:
      rgb(255, 255, 255) 2px 0px 0px,
      rgb(255, 255, 255) 1.75517px 0.958851px 0px,
      rgb(255, 255, 255) 1.0806px 1.68294px 0px,
      rgb(255, 255, 255) 0.141474px 1.99499px 0px,
      rgb(255, 255, 255) -0.832294px 1.81859px 0px,
      rgb(255, 255, 255) -1.60229px 1.19694px 0px,
      rgb(255, 255, 255) -1.97998px 0.28224px 0px,
      rgb(255, 255, 255) -1.87291px -0.701566px 0px,
      rgb(255, 255, 255) -1.30729px -1.5136px 0px,
      rgb(255, 255, 255) -0.421592px -1.95506px 0px,
      rgb(255, 255, 255) 0.567324px -1.91785px 0px,
      rgb(255, 255, 255) 1.41734px -1.41108px 0px,
      rgb(255, 255, 255) 1.92034px -0.558831px 0px;
  }
`

export interface MarkerProps {
  label?: string
  coordinates: [number, number]
  color?: string
  onDragEnd?: (event: MarkerDragEvent<any>) => void
  popupContent?: React.ReactNode
  showPopup?: boolean
  onClick?: (event: MarkerEvent<any, any>) => void
}

export function Marker({
  label,
  coordinates,
  color = DEFAULT_COLOR_DARK,
  onDragEnd,
  popupContent,
  onClick,
  showPopup = false,
}: MarkerProps) {
  const [isHovered, setIsHovered] = useState(false)

  const _showPopup = popupContent && (showPopup || isHovered)
  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <StyledMarker
        longitude={coordinates[0]}
        latitude={coordinates[1]}
        anchor='bottom'
        {...(onDragEnd ? { draggable: true, onDragEnd } : {})}
        {...(onClick
          ? {
              onClick,
              style: {
                cursor: 'pointer',
              },
            }
          : {})}
      >
        {label && (
          <label className='map-pin-label' style={{ color }}>
            {label}
          </label>
        )}

        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'>
          <path
            fill={color}
            stroke='white'
            strokeWidth={2}
            d='M18.364 3.636a9 9 0 0 1 0 12.728L12 22.728l-6.364-6.364A9 9 0 0 1 18.364 3.636ZM12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z'
          />
        </svg>
      </StyledMarker>
      {_showPopup && (
        <Popup
          offset={25}
          longitude={coordinates[0]}
          latitude={coordinates[1]}
          anchor='bottom'
          closeButton={false}
        >
          {popupContent}
        </Popup>
      )}
    </div>
  )
}
