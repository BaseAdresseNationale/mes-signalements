import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Layer, LayerProps, MapLayerMouseEvent, Popup, Source, useMap } from 'react-map-gl/maplibre'
import { useLocation } from 'react-router-dom'
import {
  PANORAMAX_LAYERS_SOURCE,
  PANORAMAX_PICTURE_LAYER_ID,
  PANORAMAX_SOURCE_ID,
  PANORAMAX_TILE_URL,
  PANORAMAX_VIEWER_URL,
  getPanoramaxThumbUrl,
  panoramaxPictureLayer,
  panoramaxSequenceLayer,
} from '../../config/map/panoramax'
import PanoramaxContext from '../../contexts/panoramax.context'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'
import styled from 'styled-components'

interface HoveredPicture {
  id: string
  longitude: number
  latitude: number
}

const DIVE_TARGET_ZOOM = 20
const DIVE_DURATION_MS = 900

const StyledPanoramaxPopup = styled(Popup)`
  pointer-events: none;

  .maplibregl-popup-content {
    padding: 4px;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

    a {
      background-image: none;

      &::after {
        display: none;
      }
    }
  }
  .maplibregl-popup-content img {
    display: block;
  }
`

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
  const location = useLocation()
  const { navigate } = useNavigateWithPreservedSearchParams()
  const { showPanoramax, isDiving, setIsDiving, setSavedView } = useContext(PanoramaxContext)
  const [hoveredPicture, setHoveredPicture] = useState<HoveredPicture | null>(null)

  const isViewerRoute = location.pathname.startsWith('/panoramax/')

  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0]
      if (!feature || feature.sourceLayer !== PANORAMAX_LAYERS_SOURCE.PICTURES) {
        setHoveredPicture(null)
        return
      }
      const pictureId = feature.properties?.id
      if (!pictureId) return

      const m = map.current
      if (!m) return

      const coords = (feature.geometry as any)?.coordinates as [number, number] | undefined
      if (!coords) return

      // Save current view to restore later (from the viewer page)
      const center = m.getCenter()
      setSavedView({
        center: { lng: center.lng, lat: center.lat },
        zoom: m.getZoom(),
        pitch: m.getPitch(),
        bearing: m.getBearing(),
      })

      setHoveredPicture(null)
      setIsDiving(true)

      const onMoveEnd = () => {
        m.off('moveend', onMoveEnd)
        setIsDiving(false)
        navigate(`/panoramax/${encodeURIComponent(pictureId)}`)
      }
      m.on('moveend', onMoveEnd)

      // "Plunge" effect: rapid zoom-in to the picture location
      m.easeTo({
        center: coords,
        zoom: DIVE_TARGET_ZOOM,
        duration: DIVE_DURATION_MS,
        essential: true,
      })
    },
    [map, navigate, setIsDiving, setSavedView],
  )

  const handleMouseMove = useCallback((e: MapLayerMouseEvent) => {
    const feature = e.features?.[0]
    if (!feature || feature.sourceLayer !== PANORAMAX_LAYERS_SOURCE.PICTURES) {
      return
    }
    const coords = (feature.geometry as any)?.coordinates
    if (!coords) return
    setHoveredPicture({
      id: feature.properties?.id,
      longitude: coords[0],
      latitude: coords[1],
    })
  }, [])

  useEffect(() => {
    const m = map.current
    if (!m || !showPanoramax) {
      setHoveredPicture(null)
      return
    }

    m.on('click', PANORAMAX_PICTURE_LAYER_ID, handleClick)
    m.on('mousemove', PANORAMAX_PICTURE_LAYER_ID, handleMouseMove)

    return () => {
      m.off('click', PANORAMAX_PICTURE_LAYER_ID, handleClick)
      m.off('mousemove', PANORAMAX_PICTURE_LAYER_ID, handleMouseMove)
    }
  }, [map, showPanoramax, handleClick, handleMouseMove])

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
      <Source id={PANORAMAX_SOURCE_ID} type='vector' tiles={[PANORAMAX_TILE_URL]}>
        <Layer
          {...({
            ...panoramaxSequenceLayer,
            paint: {
              ...panoramaxSequenceLayer.paint,
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
      {showPanoramax && hoveredPicture && !isDiving && !isViewerRoute && (
        <StyledPanoramaxPopup
          longitude={hoveredPicture.longitude}
          latitude={hoveredPicture.latitude}
          anchor='bottom'
          closeButton={false}
          closeOnClick={false}
          offset={12}
        >
          <a
            href={`${PANORAMAX_VIEWER_URL}${hoveredPicture.id}`}
            target='_blank'
            rel='noopener noreferrer'
            style={{ display: 'block' }}
            onClick={(e) => e.preventDefault()}
          >
            <img
              src={getPanoramaxThumbUrl(hoveredPicture.id)}
              alt='Aperçu Panoramax'
              style={{
                display: 'block',
                width: 200,
                height: 'auto',
                borderRadius: 4,
              }}
            />
          </a>
        </StyledPanoramaxPopup>
      )}
      {isDiving && <StyledPanoramaxOverlay aria-hidden='true' />}
    </>
  )
}
