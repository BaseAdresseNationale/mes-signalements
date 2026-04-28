import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Layer, LayerProps, MapLayerMouseEvent, Popup, Source, useMap } from 'react-map-gl/maplibre'
import {
  alertPointsLayer,
  APISignalementTiles,
  signalementPointsLayer,
  getCommuneStatusLayer,
} from '../../config/map/layers'
import { Alert, CommuneSettingsDTO, SettingsService, Signalement } from '../../api/signalement'
import SignalementCard from '../signalement/SignalementCard'
import { getSignalementFromFeatureAPISignalement } from '../../utils/signalement.utils'
import { getAlertFromFeatureAPISignalement } from '../../utils/alert.utils'
import AlertCard from '../alert/AlertCard'
import { SignalementViewerContext } from '../../contexts/signalement-viewer.context'
import SourceContext from '../../contexts/source.context'

interface SignalementSearchMapProps {
  options: Partial<LayerProps>
}

enum FeatureType {
  SIGNALMENT = 'SIGNALMENT',
  ALERT = 'ALERT',
}

export function SignalementsSearchMap({ options }: Readonly<SignalementSearchMapProps>) {
  const map = useMap()
  const { setViewedSignalement } = useContext(SignalementViewerContext)
  const [communeSettings, setCommuneSettings] = useState<Record<string, CommuneSettingsDTO>>({})
  const [hoveredFeature, setHoveredFeature] = useState<{
    type: FeatureType
    data: Signalement | Alert
    point: any
  } | null>(null)
  const { source } = useContext(SourceContext)

  // Fetch commune settings on mount
  useEffect(() => {
    const fetchCommuneSettings = async () => {
      try {
        const settings = await SettingsService.getAllCommuneSettings()
        setCommuneSettings(settings)
      } catch (error) {
        console.error('Error fetching commune settings:', error)
      }
    }
    fetchCommuneSettings()
  }, [])

  const communeStatusLayer = useMemo(
    () =>
      getCommuneStatusLayer(
        source?.id || `${process.env.REACT_APP_API_SIGNALEMENT_SOURCE_ID}`,
      ) as Partial<LayerProps>,
    [source],
  )

  useEffect(() => {
    if (!map.current) {
      return
    }

    const handleMouseMove = (e: MapLayerMouseEvent) => {
      if (!map.current || !e.features) {
        return
      }

      if (e.features.length > 0) {
        const feature = e.features[0]
        if (feature.layer.id === signalementPointsLayer.id) {
          const signalement = getSignalementFromFeatureAPISignalement(feature)
          setHoveredFeature({
            type: FeatureType.SIGNALMENT,
            data: signalement,
            point: feature.geometry,
          })
        } else if (feature.layer.id === alertPointsLayer.id) {
          const alert = getAlertFromFeatureAPISignalement(feature)
          setHoveredFeature({
            type: FeatureType.ALERT,
            data: alert,
            point: feature.geometry,
          })
        }
      }
    }

    const handleMouseLeave = () => {
      setHoveredFeature(null)
    }

    const handleSelect = (e: MapLayerMouseEvent) => {
      if (!map.current || !e.features) {
        return
      }

      if (e.features.length > 0) {
        const feature = e.features[0]
        if (feature.layer.id === signalementPointsLayer.id) {
          setViewedSignalement(getSignalementFromFeatureAPISignalement(feature))
        }
      }
    }

    const applySettings = () => {
      if (!map.current?.isSourceLoaded('decoupage-administratif')) {
        return
      }

      for (const [codeCommune, status] of Object.entries(communeSettings)) {
        map.current.setFeatureState(
          { source: 'decoupage-administratif', sourceLayer: 'communes', id: codeCommune },
          {
            disabled: status.disabled,
            mode: status.mode || null,
            filteredSources: status.filteredSources?.join(',') || null,
          },
        )
      }
    }

    const onSourceData = (e: any) => {
      if (e.sourceId === 'decoupage-administratif' && e.isSourceLoaded) {
        applySettings()
      }
    }

    // Re-applique les feature-states quand le style change (ex: switch fond de carte),
    // car setStyle réinitialise toutes les feature-states.
    const onStyleData = () => {
      applySettings()
    }

    if (Object.keys(communeSettings).length > 0) {
      // On reste abonné à 'sourcedata' en permanence pour re-appliquer après chaque
      // rechargement de la source (notamment après un setStyle déclenché par StylesSwitch).
      map.current.on('sourcedata', onSourceData)
      map.current.on('styledata', onStyleData)
      if (map.current.isSourceLoaded('decoupage-administratif')) {
        applySettings()
      }
    }

    if (map.current) {
      map.current.on('click', signalementPointsLayer.id, handleSelect)
      map.current.on('mousemove', signalementPointsLayer.id, handleMouseMove)
      map.current.on('mouseleave', signalementPointsLayer.id, handleMouseLeave)

      map.current.on('mousemove', alertPointsLayer.id, handleMouseMove)
      map.current.on('mouseleave', alertPointsLayer.id, handleMouseLeave)
    }

    return () => {
      if (map?.current) {
        map.current.off('sourcedata', onSourceData)
        map.current.off('styledata', onStyleData)
        map.current.off('click', signalementPointsLayer.id, handleSelect)
        map.current.off('mousemove', signalementPointsLayer.id, handleMouseMove)
        map.current.off('mouseleave', signalementPointsLayer.id, handleMouseLeave)

        map.current.off('mousemove', alertPointsLayer.id, handleMouseMove)
        map.current.off('mouseleave', alertPointsLayer.id, handleMouseLeave)
      }
    }
  }, [map, communeSettings])

  return (
    <>
      {hoveredFeature && hoveredFeature.type === FeatureType.SIGNALMENT && (
        <Popup
          offset={-5}
          longitude={hoveredFeature.point.coordinates[0]}
          latitude={hoveredFeature.point.coordinates[1]}
          anchor='bottom'
          closeButton={false}
        >
          <SignalementCard signalement={hoveredFeature.data as Signalement} />
        </Popup>
      )}
      {hoveredFeature && hoveredFeature.type === FeatureType.ALERT && (
        <Popup
          offset={5}
          longitude={hoveredFeature.point.coordinates[0]}
          latitude={hoveredFeature.point.coordinates[1]}
          anchor='top'
          closeButton={false}
        >
          <AlertCard alert={hoveredFeature.data as Alert} />
        </Popup>
      )}
      <Source
        id='api-signalement'
        type='vector'
        tiles={APISignalementTiles}
        minzoom={10}
        maxzoom={14}
        promoteId='id'
      >
        <Layer key={signalementPointsLayer.id} {...(signalementPointsLayer as any)} {...options} />
        <Layer key={alertPointsLayer.id} {...(alertPointsLayer as any)} {...options} />
      </Source>
      <Source
        id='decoupage-administratif'
        type='vector'
        tiles={['https://openmaptiles.data.gouv.fr/data/decoupage-administratif/{z}/{x}/{y}.pbf']}
        maxzoom={12}
        promoteId='code'
      >
        <Layer key={communeStatusLayer.id} {...(communeStatusLayer as any)} {...options} />
      </Source>
    </>
  )
}
