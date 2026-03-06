import React from 'react'
import { AlertMarker } from './AlertMarker'
import { CreateAlertDTO } from '../../../api/signalement'

interface AlertMapProps {
  alert: Pick<CreateAlertDTO, 'point'> | null
  onEditAlert: (property: keyof CreateAlertDTO, value: any) => void
}

function AlertMap({ alert, onEditAlert }: AlertMapProps) {
  const onMarkerDragEnd = (event: any) => {
    onEditAlert('point', {
      type: 'Point',
      coordinates: [event.lngLat.lng, event.lngLat.lat],
    })
  }

  if (!alert) {
    return null
  }

  return (
    <AlertMarker
      coordinates={alert.point.coordinates as [number, number]}
      onDragEnd={onMarkerDragEnd}
    />
  )
}

export default AlertMap
