import React from 'react'
import { MarkerDragEvent } from 'react-map-gl/dist/esm/types'
import { Marker as _Marker, Popup } from 'react-map-gl/maplibre'
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
  label?: string
  coordinates: [number, number]
  color: string
  onDragEnd?: (event: MarkerDragEvent<any>) => void
  popupContent?: React.ReactNode
}

export function Marker({ label, coordinates, color, onDragEnd, popupContent }: MarkerProps) {
  const [showPopup, setShowPopup] = React.useState(false)
  return (
    <>
      <StyledMarker
        longitude={coordinates[0]}
        latitude={coordinates[1]}
        anchor='bottom'
        {...(onDragEnd ? { draggable: true, onDragEnd } : {})}
        {...(popupContent
          ? {
              onClick: (e) => {
                e.originalEvent.stopPropagation()
                setShowPopup(true)
              },
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
        <span className='fr-icon-map-pin-2-fill' aria-hidden='true' style={{ color }} />
      </StyledMarker>
      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          closeButton={true}
          offset={25}
          longitude={coordinates[0]}
          latitude={coordinates[1]}
          anchor='bottom'
        >
          {popupContent}
        </Popup>
      )}
    </>
  )
}
