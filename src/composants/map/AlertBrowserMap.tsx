import React, { useEffect, useMemo } from 'react'
import { Alert } from '../../api/signalement'
import { FeatureCollection, Geometry } from 'geojson'
import { Layer, LayerProps, MapLayerMouseEvent, Popup, Source, useMap } from 'react-map-gl/maplibre'
import AlertCard from '../alert/AlertCard'

interface AlertBrowserMapProps {
  alerts: Alert[]
  onSelectAlert: (alert: Alert) => void
  hoveredAlert?: Alert
  selectedAlert?: Alert
  setHoveredAlert: (hoveredAlert?: Alert) => void
}

const alertBrowserPointLayer: LayerProps = {
  id: 'alert-browser-point',
  source: 'alert-browser-points',
  type: 'symbol',
  layout: {
    'icon-image': 'alert-flag',
    'icon-anchor': 'bottom',
    'icon-size': 0.4,
  },
}

const safelyParseJSON = (value: unknown) => {
  if (typeof value !== 'string') {
    return value
  }

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

const getAlertFromFeature = (feature: any): Alert => {
  return {
    ...feature.properties,
    source: safelyParseJSON(feature.properties.source),
    processedBy: safelyParseJSON(feature.properties.processedBy),
    point: feature.geometry,
  } as Alert
}

export default function AlertBrowserMap({
  alerts,
  onSelectAlert,
  hoveredAlert,
  selectedAlert,
  setHoveredAlert,
}: AlertBrowserMapProps) {
  const map = useMap()

  useEffect(() => {
    if (!map.current) {
      return
    }

    const handleMouseMove = (e: MapLayerMouseEvent) => {
      if (!map.current || !e.features) {
        return
      }

      if (e.features.length > 0) {
        setHoveredAlert(getAlertFromFeature(e.features[0]))
      }
    }

    const handleMouseLeave = () => {
      setHoveredAlert(undefined)
    }

    const handleClickAlert = (event: MapLayerMouseEvent) => {
      if (!map.current) {
        return
      }

      const feature = event.features?.[0]
      if (!feature) {
        return
      }

      onSelectAlert(getAlertFromFeature(feature))
    }

    if (map?.current) {
      map.current.on('click', alertBrowserPointLayer.id as string, handleClickAlert)
      map.current.on('mousemove', alertBrowserPointLayer.id as string, handleMouseMove)
      map.current.on('mouseleave', alertBrowserPointLayer.id as string, handleMouseLeave)
    }

    return () => {
      if (map?.current) {
        map.current.off('click', alertBrowserPointLayer.id as string, handleClickAlert)
        map.current.off('mousemove', alertBrowserPointLayer.id as string, handleMouseMove)
        map.current.off('mouseleave', alertBrowserPointLayer.id as string, handleMouseLeave)
      }
    }
  }, [map, onSelectAlert, setHoveredAlert])

  const alertsWithCoordinates = alerts.filter(({ point }) => {
    return Boolean(point)
  })

  const data: FeatureCollection = {
    type: 'FeatureCollection',
    features: alertsWithCoordinates.map(({ point, ...rest }) => ({
      type: 'Feature',
      geometry: point as Geometry,
      properties: { ...rest },
    })),
  }

  const popupAlert = useMemo(() => {
    return selectedAlert ?? hoveredAlert
  }, [selectedAlert, hoveredAlert])

  return (
    <>
      {popupAlert && (
        <Popup
          offset={5}
          longitude={popupAlert.point.coordinates[0]}
          latitude={popupAlert.point.coordinates[1]}
          anchor='top'
          closeButton={false}
        >
          <AlertCard alert={popupAlert} />
        </Popup>
      )}
      <Source id='alert-browser-points' type='geojson' data={data}>
        <Layer {...(alertBrowserPointLayer as any)} />
      </Source>
    </>
  )
}
