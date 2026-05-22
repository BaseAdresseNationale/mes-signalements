export const PANORAMAX_SOURCE_ID = 'panoramax'

export const PANORAMAX_TILE_URL = `${process.env.REACT_APP_PANORAMAX_API}/api/map/{z}/{x}/{y}.mvt`

export const PANORAMAX_LAYERS_SOURCE = {
  SEQUENCES: 'sequences',
  PICTURES: 'pictures',
}

export const PANORAMAX_SEQUENCE_LAYER_ID = 'panoramax-sequences'
export const PANORAMAX_SEQUENCE_HIGHLIGHT_LAYER_ID = 'panoramax-sequences-highlight'
export const PANORAMAX_PICTURE_LAYER_ID = 'panoramax-pictures'

export const PANORAMAX_SEQUENCE_MIN_ZOOM = 12
export const PANORAMAX_PICTURE_SEARCH_RADIUS_PX = 200

export const panoramaxSequenceLayer = {
  id: PANORAMAX_SEQUENCE_LAYER_ID,
  'source-layer': PANORAMAX_LAYERS_SOURCE.SEQUENCES,
  type: 'line',
  minzoom: PANORAMAX_SEQUENCE_MIN_ZOOM,
  paint: {
    'line-color': '#4845f4',
    'line-width': 4,
  },
  layout: {
    'line-join': 'round',
  },
}

export const panoramaxPictureLayer = {
  id: PANORAMAX_PICTURE_LAYER_ID,
  'source-layer': PANORAMAX_LAYERS_SOURCE.PICTURES,
  type: 'circle',
  minzoom: PANORAMAX_SEQUENCE_MIN_ZOOM,
  paint: {
    'circle-color': '#4845f4',
    'circle-opacity': 0,
    'circle-stroke-color': '#f8f4f0',
    'circle-stroke-opacity': 0,
    'circle-radius': {
      stops: [
        [12, 4],
        [17, 8],
      ],
    },
    'circle-stroke-width': {
      stops: [
        [12, 0.3],
        [17, 0.8],
      ],
    },
  },
}

/**
 * Find the picture feature from a given sequence whose projected point is
 * closest to (px, py) — container-relative pixels. Returns null if none in
 * the search radius. Used to resolve a sequence click/hover to a concrete
 * picture for the dive.
 */
export const findNearestPictureForSequence = (
  m: any,
  px: number,
  py: number,
  sequenceId: string,
): { id: string; coords: [number, number] } | null => {
  const r = PANORAMAX_PICTURE_SEARCH_RADIUS_PX
  const features = m.queryRenderedFeatures(
    [
      [px - r, py - r],
      [px + r, py + r],
    ],
    { layers: [PANORAMAX_PICTURE_LAYER_ID] },
  )
  let best: { id: string; coords: [number, number] } | null = null
  let bestDist = Infinity
  for (const f of features) {
    if (f.properties?.first_sequence !== sequenceId) continue
    const coords = (f.geometry as any)?.coordinates as [number, number] | undefined
    const id = f.properties?.id as string | undefined
    if (!coords || !id) continue
    const p = m.project(coords)
    const d = Math.hypot(p.x - px, p.y - py)
    if (d < bestDist) {
      bestDist = d
      best = { id, coords }
    }
  }

  return best
}

/**
 * Project the given click point onto the polyline geometry of a sequence
 * feature and return the closest on-line position as [lng, lat]. Works in
 * pixel space to honor the current map projection. Returns the original
 * click point if the geometry can't be read.
 *
 * Used to snap a sequence click/drop to a location guaranteed to sit on the
 * sequence — so that after the dive, picture features from that sequence
 * are queryable around the viewport center.
 */
export const snapPointToSequenceGeometry = (
  m: any,
  feature: any,
  clickLngLat: [number, number],
): [number, number] => {
  const geom = feature?.geometry
  if (!geom) return clickLngLat
  const lines: [number, number][][] =
    geom.type === 'MultiLineString'
      ? (geom.coordinates as [number, number][][])
      : geom.type === 'LineString'
        ? [geom.coordinates as [number, number][]]
        : []
  if (lines.length === 0) return clickLngLat

  const clickPx = m.project(clickLngLat)
  let bestDist = Infinity
  let bestPx: { x: number; y: number } | null = null
  for (const line of lines) {
    for (let i = 0; i < line.length - 1; i++) {
      const a = m.project(line[i])
      const b = m.project(line[i + 1])
      const dx = b.x - a.x
      const dy = b.y - a.y
      const len2 = dx * dx + dy * dy
      let t = len2 === 0 ? 0 : ((clickPx.x - a.x) * dx + (clickPx.y - a.y) * dy) / len2
      if (t < 0) t = 0
      else if (t > 1) t = 1
      const px = a.x + t * dx
      const py = a.y + t * dy
      const d = Math.hypot(px - clickPx.x, py - clickPx.y)
      if (d < bestDist) {
        bestDist = d
        bestPx = { x: px, y: py }
      }
    }
  }
  if (!bestPx) return clickLngLat
  const ll = m.unproject([bestPx.x, bestPx.y])
  return [ll.lng, ll.lat]
}

export const PANORAMAX_VIEWER_URL = `${process.env.REACT_APP_PANORAMAX_API}/?focus=pic&pic=`

export const getPanoramaxThumbUrl = (pictureId: string) =>
  `${process.env.REACT_APP_PANORAMAX_API}/api/pictures/${pictureId}/thumb.jpg`

export const getPanoramaxSequenceThumbUrl = (sequenceId: string) =>
  `${process.env.REACT_APP_PANORAMAX_API}/api/collections/${sequenceId}/thumb.jpg`

/**
 * Wait until the picture features for the given sequence are loaded near
 * the target location (typically the post-dive viewport center) and return
 * the nearest one. Resolves to null if nothing shows up within the timeout.
 */
export const resolveNearestPictureAfterDive = (
  m: any,
  targetLngLat: [number, number],
  sequenceId: string,
  timeoutMs = 4000,
): Promise<{ id: string; coords: [number, number] } | null> => {
  return new Promise((resolve) => {
    let done = false
    const tryNow = () => {
      if (done) return
      const p = m.project(targetLngLat)
      const nearest = findNearestPictureForSequence(m, p.x, p.y, sequenceId)
      if (nearest) {
        done = true
        cleanup()
        resolve(nearest)
      }
    }
    const onSrc = (e: any) => {
      if (e.sourceId === PANORAMAX_SOURCE_ID) tryNow()
    }
    const onIdle = () => tryNow()
    const cleanup = () => {
      m.off('sourcedata', onSrc)
      m.off('idle', onIdle)
      clearTimeout(timeoutId)
    }
    const timeoutId = setTimeout(() => {
      if (done) return
      done = true
      cleanup()
      resolve(null)
    }, timeoutMs)
    m.on('sourcedata', onSrc)
    m.on('idle', onIdle)
    tryNow()
  })
}
