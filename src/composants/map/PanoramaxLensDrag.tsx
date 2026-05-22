import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMap } from 'react-map-gl/maplibre'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { PANORAMAX_PICTURE_LAYER_ID, getPanoramaxThumbUrl } from '../../config/map/panoramax'
import PanoramaxContext from '../../contexts/panoramax.context'
import MapContext from '../../contexts/map.context'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'

const DRAG_THRESHOLD_PX = 5
const DIVE_TARGET_ZOOM = 20
const DIVE_DURATION_MS = 900

const LENS_IDLE_SIZE = 56
const LENS_HOVER_SIZE = 140

const SCAN_MODE_MESSAGE = 'Scannez une trace Panoramax'
const DRAG_HOVER_MESSAGE = 'Relâcher la souris pour ouvrir Panoramax'
const SCAN_HOVER_MESSAGE = 'Cliquer pour ouvrir dans Panoramax'

// Inline close icon used to replace the camera-lens image while in scan mode.
const CLOSE_ICON_DATA_URL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 10.586l4.95-4.95 1.414 1.414L13.414 12l4.95 4.95-1.414 1.414L12 13.414l-4.95 4.95-1.414-1.414L10.586 12l-4.95-4.95L7.05 5.636z"/></svg>',
  )

interface DragState {
  pointerId: number
  startX: number
  startY: number
  initialShowPanoramax: boolean
  active: boolean
}

interface LensState {
  x: number
  y: number
  pictureId: string | null
}

const StyledLens = styled.div<{ $hovering: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${({ $hovering }) => ($hovering ? LENS_HOVER_SIZE : LENS_IDLE_SIZE)}px;
  height: ${({ $hovering }) => ($hovering ? LENS_HOVER_SIZE : LENS_IDLE_SIZE)}px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  background: #fff;
  border: 3px solid #4845f4;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  transition:
    width 150ms ease,
    height 150ms ease,
    border-color 150ms ease;
  transform: translate(-50%, -50%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .panoramax-lens-icon {
    width: 60%;
    height: 60%;
    opacity: ${({ $hovering }) => ($hovering ? 0 : 1)};
    transition: opacity 120ms ease;
  }

  .panoramax-lens-thumb {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: ${({ $hovering }) => ($hovering ? 1 : 0)};
    transition: opacity 120ms ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.6);
    pointer-events: none;
  }
`

export function PanoramaxLensDrag() {
  const map = useMap()
  const location = useLocation()
  const { navigate } = useNavigateWithPreservedSearchParams()
  const { showPanoramax, setShowPanoramax, isDiving, setIsDiving, setSavedView } =
    useContext(PanoramaxContext)
  const { setMapMessage } = useContext(MapContext)

  const dragRef = useRef<DragState | null>(null)
  const justDraggedRef = useRef(false)
  const [lens, setLens] = useState<LensState | null>(null)
  const [scanMode, setScanMode] = useState(false)

  const isViewerRoute = location.pathname.startsWith('/panoramax/')

  // Always-up-to-date refs so the long-lived window listeners see fresh values.
  const showPanoramaxRef = useRef(showPanoramax)
  useEffect(() => {
    showPanoramaxRef.current = showPanoramax
  }, [showPanoramax])
  const scanModeRef = useRef(scanMode)
  useEffect(() => {
    scanModeRef.current = scanMode
  }, [scanMode])
  // Remembers showPanoramax value at the moment we entered scan mode, so we
  // can restore it cleanly on exit.
  const initialShowPanoramaxRef = useRef<boolean | null>(null)

  // Query the picture feature under the given client coordinates, if any.
  const queryFeatureAt = useCallback(
    (clientX: number, clientY: number) => {
      const m = map.current?.getMap()
      if (!m) return null
      const container = m.getContainer()
      const rect = container.getBoundingClientRect()
      const px = clientX - rect.left
      const py = clientY - rect.top
      if (px < 0 || py < 0 || px > rect.width || py > rect.height) return null
      const features = m.queryRenderedFeatures([px, py], {
        layers: [PANORAMAX_PICTURE_LAYER_ID],
      })
      return features?.[0] ?? null
    },
    [map],
  )

  const endDrag = useCallback(() => {
    document.body.classList.remove('panoramax-dragging')
    dragRef.current = null
    // The lens follower stays visible while in scan mode; only hide it otherwise.
    if (!scanModeRef.current) {
      setLens(null)
      setMapMessage(null)
    } else {
      // Drag ended while in scan mode — reset to the default scan message.
      setMapMessage(SCAN_MODE_MESSAGE)
    }
  }, [setMapMessage])

  // Replaces the toggle’s lens icon with a close icon while in scan mode.
  const swapToggleIcon = useCallback((mode: 'close' | 'lens') => {
    const button = document.getElementById('panoramax-toggle')
    const img = button?.querySelector('img') as HTMLImageElement | null
    if (!button || !img) return
    if (mode === 'close') {
      if (!img.dataset.originalSrc) {
        img.dataset.originalSrc = img.src
      }
      img.src = CLOSE_ICON_DATA_URL
      img.alt = 'Quitter le mode scan Panoramax'
      button.classList.add('scan-mode')
    } else {
      if (img.dataset.originalSrc) {
        img.src = img.dataset.originalSrc
        delete img.dataset.originalSrc
      }
      img.alt = 'Panoramax'
      button.classList.remove('scan-mode')
    }
  }, [])

  const enterScanMode = useCallback(() => {
    if (scanModeRef.current) return
    initialShowPanoramaxRef.current = showPanoramaxRef.current
    setScanMode(true)
    if (!showPanoramaxRef.current) {
      setShowPanoramax(true)
    }
    document.body.classList.add('panoramax-dragging')
    setMapMessage(SCAN_MODE_MESSAGE)
    swapToggleIcon('close')
  }, [setMapMessage, setShowPanoramax, swapToggleIcon])

  const exitScanMode = useCallback(
    (restoreLayer = true) => {
      if (!scanModeRef.current) return
      setScanMode(false)
      document.body.classList.remove('panoramax-dragging')
      setMapMessage(null)
      swapToggleIcon('lens')
      setLens(null)
      if (
        restoreLayer &&
        initialShowPanoramaxRef.current !== null &&
        initialShowPanoramaxRef.current !== showPanoramaxRef.current
      ) {
        setShowPanoramax(initialShowPanoramaxRef.current)
      }
      initialShowPanoramaxRef.current = null
    },
    [setMapMessage, setShowPanoramax, swapToggleIcon],
  )

  // When a dive starts (whether triggered by a feature click in scan mode or by
  // dropping the lens on a feature), exit scan mode. We restore the layer to
  // its original visibility so the toggle returns to its previous state once
  // the viewer closes.
  useEffect(() => {
    if (isDiving && scanModeRef.current) {
      exitScanMode(true)
    }
  }, [isDiving, exitScanMode])

  // Always exit scan mode when navigating to the viewer route.
  useEffect(() => {
    if (isViewerRoute && scanModeRef.current) {
      exitScanMode(true)
    }
  }, [isViewerRoute, exitScanMode])

  // Long-lived window listeners — installed once. We read `dragRef.current`
  // imperatively, so handlers don't need to be re-bound on every render.
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const drag = dragRef.current
      // Track an in-progress drag from the toggle button.
      if (drag && e.pointerId === drag.pointerId) {
        if (!drag.active) {
          const dx = e.clientX - drag.startX
          const dy = e.clientY - drag.startY
          if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return
          drag.active = true
          // Drag overrides scan-mode toggle on this gesture.
          document.body.classList.add('panoramax-dragging')
          if (!showPanoramaxRef.current) {
            setShowPanoramax(true)
          }
          setMapMessage(SCAN_MODE_MESSAGE)
        }
        const feature = queryFeatureAt(e.clientX, e.clientY)
        const pictureId = (feature?.properties?.id as string | undefined) ?? null
        setLens({ x: e.clientX, y: e.clientY, pictureId })
        setMapMessage(pictureId ? DRAG_HOVER_MESSAGE : SCAN_MODE_MESSAGE)
        return
      }
      // Scan mode: lens follows the cursor without an active drag.
      if (scanModeRef.current) {
        const feature = queryFeatureAt(e.clientX, e.clientY)
        const pictureId = (feature?.properties?.id as string | undefined) ?? null
        setLens({ x: e.clientX, y: e.clientY, pictureId })
        setMapMessage(pictureId ? SCAN_HOVER_MESSAGE : SCAN_MODE_MESSAGE)
      }
    }

    const handlePointerUp = (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag || e.pointerId !== drag.pointerId) return

      if (!drag.active) {
        // No movement — it's a click on the toggle: toggle scan mode.
        justDraggedRef.current = false
        dragRef.current = null
        if (scanModeRef.current) {
          exitScanMode(true)
        } else {
          enterScanMode()
        }
        return
      }

      // A drag occurred — suppress the upcoming synthetic click on the toggle.
      justDraggedRef.current = true

      const feature = queryFeatureAt(e.clientX, e.clientY)
      const pictureId = feature?.properties?.id as string | undefined
      const coords = (feature?.geometry as any)?.coordinates as [number, number] | undefined
      const m = map.current?.getMap()

      if (m && feature && pictureId && coords) {
        // Trigger the dive + navigate flow.
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
          navigate(`/panoramax/${encodeURIComponent(pictureId)}`)
        }
        m.on('moveend', onMoveEnd)
        m.easeTo({
          center: coords,
          zoom: DIVE_TARGET_ZOOM,
          duration: DIVE_DURATION_MS,
          essential: true,
        })
        const initialShowPanoramax = drag.initialShowPanoramax
        endDrag()
        // Restore the user's previous layer preference — the toggle should
        // return to its prior visual state once the viewer closes.
        if (!scanModeRef.current && initialShowPanoramax !== showPanoramaxRef.current) {
          setShowPanoramax(initialShowPanoramax)
        }
        return
      }

      // Dropped outside any picture — cancel the drag and exit scan mode if any.
      const initialShowPanoramax = drag.initialShowPanoramax
      endDrag()
      if (scanModeRef.current) {
        exitScanMode(true)
      } else if (initialShowPanoramax !== showPanoramaxRef.current) {
        // Drag forced the layer on; restore the user's previous preference.
        setShowPanoramax(initialShowPanoramax)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (dragRef.current) {
        endDrag()
      }
      if (scanModeRef.current) {
        exitScanMode(true)
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    map,
    queryFeatureAt,
    setShowPanoramax,
    setSavedView,
    setIsDiving,
    setMapMessage,
    navigate,
    endDrag,
    enterScanMode,
    exitScanMode,
  ])

  // Delegate pointerdown on the (imperatively-created) #panoramax-toggle button.
  useEffect(() => {
    if (isViewerRoute) return
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      const target = e.target as HTMLElement | null
      const button = target?.closest?.('#panoramax-toggle') as HTMLButtonElement | null
      if (!button) return
      if (button.hasAttribute('data-unavailable')) return
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        initialShowPanoramax: showPanoramaxRef.current,
        active: false,
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [isViewerRoute])

  // Swallow the synthetic click that follows pointerup if a drag occurred,
  // so the toggle button doesn't switch state.
  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      if (!justDraggedRef.current) return
      const target = e.target as HTMLElement | null
      if (target?.closest?.('#panoramax-toggle')) {
        e.stopPropagation()
        e.preventDefault()
      }
      justDraggedRef.current = false
    }
    document.addEventListener('click', onClickCapture, true)
    return () => document.removeEventListener('click', onClickCapture, true)
  }, [])

  // In scan mode: a click anywhere that is NOT on a Panoramax feature (and not
  // on the toggle button itself, which has its own click semantics) exits scan
  // mode. Clicks on a feature are handled by PanoramaxMap.handleClick, which
  // triggers the dive and indirectly closes scan mode via the isDiving effect.
  useEffect(() => {
    if (!scanMode) return
    const onClick = (e: MouseEvent) => {
      if (justDraggedRef.current) return
      const target = e.target as HTMLElement | null
      if (target?.closest?.('#panoramax-toggle')) return
      const feature = queryFeatureAt(e.clientX, e.clientY)
      if (feature) return
      exitScanMode(true)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [scanMode, queryFeatureAt, exitScanMode])

  if (!lens) return null

  return createPortal(
    <StyledLens
      $hovering={!!lens.pictureId}
      style={{ transform: `translate(${lens.x}px, ${lens.y}px) translate(-50%, -50%)` }}
      aria-hidden='true'
    >
      <img src='/icons/panoramax.svg' alt='' className='panoramax-lens-icon' />
      {lens.pictureId && (
        <img src={getPanoramaxThumbUrl(lens.pictureId)} alt='' className='panoramax-lens-thumb' />
      )}
    </StyledLens>,
    document.body,
  )
}
