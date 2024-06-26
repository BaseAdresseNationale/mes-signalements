import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Layer, MapLayerMouseEvent, Source, useMap } from 'react-map-gl/maplibre'
import { Position, Signalement } from '../../api/signalement'
import { cadastreLayers, parcelleHoveredLayer } from '../../config/map/layers'
import { positionTypeOptions } from '../../utils/signalement.utils'
import { Marker } from './Marker'

interface SignalementMapProps {
  signalement: Signalement
  onEditSignalement: (property: keyof Signalement, key: string) => (value: any) => void
  isEditParcellesMode: boolean
  markerColor: string
}

function SignalementMap({
  signalement,
  onEditSignalement,
  isEditParcellesMode,
  markerColor,
}: SignalementMapProps) {
  const map = useMap()
  const [hoveredParcelle, setHoveredParcelle] = useState<null | string>(null)
  const { positions, parcelles } = signalement.changesRequested

  const cadastreFiltre = useMemo(
    () =>
      parcelles
        ? ['any', ...parcelles.map((id) => ['==', ['get', 'id'], id])]
        : ['==', ['get', 'id'], ''],
    [parcelles],
  )

  const handleEditParcelle = useCallback(
    (newParcelles: string[]) => {
      onEditSignalement('changesRequested', 'parcelles')(newParcelles)
    },
    [onEditSignalement],
  )

  const handleMouseMove = useCallback(
    (e: MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0 && map.current) {
        if (hoveredParcelle) {
          map.current.setFeatureState(
            {
              source: 'cadastre',
              sourceLayer: 'parcelles',
              id: hoveredParcelle,
            },
            { hover: false },
          )
        }

        map.current.setFeatureState(
          {
            source: 'cadastre',
            sourceLayer: 'parcelles',
            id: e.features[0].id,
          },
          { hover: true },
        )
        setHoveredParcelle(e.features[0].id as string)
      }
    },
    [map, hoveredParcelle],
  )

  const handleMouseLeave = useCallback(() => {
    if (hoveredParcelle && map.current) {
      map.current.setFeatureState(
        { source: 'cadastre', sourceLayer: 'parcelles', id: hoveredParcelle },
        { hover: false },
      )
    }

    setHoveredParcelle(null)
  }, [map, hoveredParcelle])

  const handleSelectParcelle = useCallback(
    (e: MapLayerMouseEvent) => {
      if (map && parcelles && e.features && e.features.length > 0) {
        const selectedParcelle = e.features[0]?.properties?.id
        if (parcelles.includes(selectedParcelle)) {
          handleEditParcelle(parcelles.filter((id) => id !== selectedParcelle))
        } else if (selectedParcelle) {
          handleEditParcelle([...parcelles, selectedParcelle])
        }
      }
    },
    [map, parcelles, handleEditParcelle],
  )

  useEffect(() => {
    if (map.current) {
      map.current.on('mousemove', 'parcelle-hovered', handleMouseMove)
      map.current.on('mouseleave', 'parcelle-hovered', handleMouseLeave)
      map.current.on('click', 'parcelle-hovered', handleSelectParcelle)
    }
    return () => {
      if (map.current) {
        map.current.off('mousemove', 'parcelle-hovered', handleMouseMove)
        map.current.off('mouseleave', 'parcelle-hovered', handleMouseLeave)
        map.current.off('click', 'parcelle-hovered', handleSelectParcelle)
      }
    }
  }, [map, handleMouseMove, handleSelectParcelle, handleMouseLeave])

  const onMarkerDragEnd = useCallback(
    (index: number) => (event: any) => {
      const newPositions = [...(positions as Position[])]
      newPositions[index] = {
        ...newPositions[index],
        point: {
          type: 'Point',
          coordinates: [event.lngLat.lng, event.lngLat.lat],
        },
      }
      onEditSignalement('changesRequested', 'positions')(newPositions)
    },
    [positions, onEditSignalement],
  )

  const signalementLabel = useMemo(() => {
    const { numero, suffixe, nomVoie } = signalement.changesRequested

    return [numero, suffixe, nomVoie].reduce((acc, cur) => {
      return cur ? `${acc} ${cur}` : acc
    }, '')
  }, [signalement.changesRequested])

  const getSignalementPositionLabel = useCallback(
    (positionType: Position.type) => {
      const positionTypeLabel = positionTypeOptions.find(
        ({ value }) => value === positionType,
      )?.label
      return `${signalementLabel} - ${positionTypeLabel}`
    },
    [signalementLabel],
  )

  return (
    <>
      <Source
        id='cadastre'
        type='vector'
        url='https://openmaptiles.geo.data.gouv.fr/data/cadastre.json'
      >
        {[...cadastreLayers, parcelleHoveredLayer].map((cadastreLayer) => {
          if (cadastreLayer.id === 'parcelle-highlighted') {
            ;(cadastreLayer as any).filter = cadastreFiltre
          }

          return (
            <Layer
              key={cadastreLayer.id}
              {...(cadastreLayer as any)}
              layout={{
                ...cadastreLayer.layout,
                visibility: isEditParcellesMode ? 'visible' : 'none',
              }}
            />
          )
        })}
      </Source>
      {positions?.map(({ point, type }, index) => (
        <Marker
          key={index}
          label={getSignalementPositionLabel(type)}
          coordinates={point.coordinates as [number, number]}
          color={markerColor}
          onDragEnd={onMarkerDragEnd(index)}
        />
      ))}
    </>
  )
}

export default SignalementMap
