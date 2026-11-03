import React, { useCallback, useContext, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PanoramaxViewer } from '../composants/panoramax/PanoramaxViewer'
import { PANORAMAX_VIEWER_URL } from '../config/map/panoramax'
import MapContext from '../contexts/map.context'
import PanoramaxContext from '../contexts/panoramax.context'
import { useMainElPortal } from '../hooks/useMainElPortal'

const RESTORE_DURATION_MS = 700

export function PanoramaxViewerPage() {
  const { pictureId } = useParams<{ pictureId: string }>()
  const navigate = useNavigate()
  const { mapRef } = useContext(MapContext)
  const { savedView, setSavedView } = useContext(PanoramaxContext)
  const { mainElPortal } = useMainElPortal()
  const historyLengthAtOpenRef = useRef(window.history.length)

  // Chaque navigation interne à l'iframe ajoute une entrée à l'historique de la fenêtre.
  useEffect(() => {
    historyLengthAtOpenRef.current = window.history.length
  }, [pictureId])

  const handleClose = useCallback(() => {
    const m = mapRef?.getMap()
    if (m && savedView) {
      m.easeTo({
        center: [savedView.center.lng, savedView.center.lat],
        zoom: savedView.zoom,
        pitch: savedView.pitch,
        bearing: savedView.bearing,
        duration: RESTORE_DURATION_MS,
        essential: true,
      })
    }
    setSavedView(null)
    const iframeEntries = Math.max(0, window.history.length - historyLengthAtOpenRef.current)
    navigate(-(iframeEntries + 1))
  }, [mapRef, savedView, setSavedView, navigate])

  // Safety: if the user lands on this page directly (no pictureId), go home.
  useEffect(() => {
    if (!pictureId) {
      navigate('/', { replace: true })
    }
  }, [pictureId, navigate])

  if (!pictureId) return null

  if (!process.env.REACT_APP_PANORAMAX_API) return null

  const src = `${PANORAMAX_VIEWER_URL}${encodeURIComponent(pictureId)}`

  return mainElPortal ? mainElPortal(<PanoramaxViewer src={src} onClose={handleClose} />) : null
}
