import React, { useCallback, useContext, useEffect, useRef } from 'react'
import { Layer, LayerProps, MapLayerMouseEvent, Source, useMap } from 'react-map-gl/maplibre'
import {
  PANORAMAX_LAYERS_SOURCE,
  PANORAMAX_SEQUENCE_LAYER_ID,
  PANORAMAX_SOURCE_ID,
  PANORAMAX_TILE_URL,
  findNearestPictureForSequence,
  panoramaxPictureLayer,
  panoramaxSequenceLayer,
} from '../../config/map/panoramax'
import PanoramaxContext from '../../contexts/panoramax.context'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'
import styled from 'styled-components'

const DIVE_TARGET_ZOOM = 20
const DIVE_DURATION_MS = 900

const StyledPanoramaxOverlay = styled.div`
  @keyframes panoramax-dive-flash {
    0% {
      opacity: 0;
    }
    60% {
      opacity: 0.35;
    }
    100% {
      opacity: 0.85;
    }
  }
  position: absolute;
  inset: 0;
  z-index: 4;
  background: radial-gradient(
    circle at center,
    rgba(72, 69, 244, 0) 0%,
    rgba(72, 69, 244, 0.25) 55%,
    rgba(0, 0, 0, 0.85) 100%
  );
  pointer-events: none;
  animation: panoramax-dive-flash 900ms ease-in forwards;
`

export function PanoramaxMap() {
  const map = useMap()
  const { navigate } = useNavigateWithPreservedSearchParams()
  const { showPanoramax, isDiving, setIsDiving, setSavedView } = useContext(PanoramaxContext)
  const hoveredSequenceIdRef = useRef<string | null>(null)

  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0]
      if (!feature || feature.sourceLayer !== PANORAMAX_LAYERS_SOURCE.SEQUENCES) {
        return
      }
      const sequenceId =
        (feature.properties?.id as string | undefined) ??
        (feature.id != null ? String(feature.id) : undefined)
      if (!sequenceId) return

      const m = map.current?.getMap()
      if (!m) return

      const nearest = findNearestPictureForSequence(m, e.point.x, e.point.y, sequenceId)
      if (!nearest) return

      // Save current view to restore later (from the viewer page)
      const center = m.getCenter()
      setSavedView({
        center: { lng: center.lng, lat: center.lat },
        zoom: m.getZoom(),
        pitch: m.getPitch(),
        bearing: m.getBearing(),
      })

      setIsDiving(true)

      const onMoveEnd = () => {
        m.off('moveend', onMoveEnd)
        setIsDiving(false)
        navigate(`/panoramax/${encodeURIComponent(nearest.id)}`)
      }
      m.on('moveend', onMoveEnd)

      // "Plunge" effect: rapid zoom-in to the picture location
      m.easeTo({
        center: nearest.coords,
        zoom: DIVE_TARGET_ZOOM,
        duration: DIVE_DURATION_MS,
        essential: true,
      })
    },
    [map, navigate, setIsDiving, setSavedView],
  )

  useEffect(() => {
    const m = map.current?.getMap()
    if (!m || !showPanoramax) {
      return
    }

    const setHover = (id: string | null) => {
      const prev = hoveredSequenceIdRef.current
      if (prev === id) return
      if (prev) {
        m.setFeatureState(
          { source: PANORAMAX_SOURCE_ID, sourceLayer: PANORAMAX_LAYERS_SOURCE.SEQUENCES, id: prev },
          { hover: false },
        )
      }
      if (id) {
        m.setFeatureState(
          { source: PANORAMAX_SOURCE_ID, sourceLayer: PANORAMAX_LAYERS_SOURCE.SEQUENCES, id },
          { hover: true },
        )
      }
      hoveredSequenceIdRef.current = id
    }

    const onMove = (e: MapLayerMouseEvent) => {
      const f = e.features?.[0]
      const id =
        (f?.properties?.id as string | undefined) ?? (f?.id != null ? String(f.id) : undefined)
      if (!id) return
      setHover(id)
      m.getCanvas().style.cursor = 'pointer'
    }
    const onLeave = () => {
      setHover(null)
      m.getCanvas().style.cursor = ''
    }

    m.on('click', PANORAMAX_SEQUENCE_LAYER_ID, handleClick)
    m.on('mousemove', PANORAMAX_SEQUENCE_LAYER_ID, onMove)
    m.on('mouseleave', PANORAMAX_SEQUENCE_LAYER_ID, onLeave)

    return () => {
      m.off('click', PANORAMAX_SEQUENCE_LAYER_ID, handleClick)
      m.off('mousemove', PANORAMAX_SEQUENCE_LAYER_ID, onMove)
      m.off('mouseleave', PANORAMAX_SEQUENCE_LAYER_ID, onLeave)
      m.getCanvas().style.cursor = ''
      setHover(null)
    }
  }, [map, showPanoramax, handleClick])

  // Force a re-render when toggled on, so tiles refresh
  useEffect(() => {
    const m = map.current
    if (m && showPanoramax) {
      m.zoomTo(m.getZoom(), { duration: 0 })
    }
  }, [map, showPanoramax])

  if (!process.env.REACT_APP_PANORAMAX_API) {
    return null
  }

  return (
    <>
      <Source
        id={PANORAMAX_SOURCE_ID}
        type='vector'
        tiles={[PANORAMAX_TILE_URL]}
        promoteId={{
          [PANORAMAX_LAYERS_SOURCE.SEQUENCES]: 'id',
          [PANORAMAX_LAYERS_SOURCE.PICTURES]: 'id',
        }}
      >
        {/* Soft blue halo rendered underneath the base line, only on hover. */}
        <Layer
          {...({
            id: 'panoramax-sequences-halo',
            'source-layer': PANORAMAX_LAYERS_SOURCE.SEQUENCES,
            type: 'line',
            minzoom: panoramaxSequenceLayer.minzoom,
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': '#4845f4',
              'line-blur': 6,
              'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 18, 0],
              'line-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                showPanoramax ? 0.4 : 0,
                0,
              ],
            },
          } as LayerProps)}
        />
        <Layer
          {...({
            ...panoramaxSequenceLayer,
            paint: {
              ...panoramaxSequenceLayer.paint,
              'line-color': '#4845f4',
              'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 7, 4],
              'line-opacity': showPanoramax ? 1 : 0,
            },
          } as LayerProps)}
        />
        <Layer
          {...({
            ...panoramaxPictureLayer,
            layout: { visibility: showPanoramax ? 'visible' : 'none' },
          } as LayerProps)}
        />
      </Source>
      {isDiving && <StyledPanoramaxOverlay aria-hidden='true' />}
    </>
  )
}
