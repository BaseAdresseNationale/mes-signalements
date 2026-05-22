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
export const PANORAMAX_PICTURE_SEARCH_RADIUS_PX = 80

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

export const PANORAMAX_VIEWER_URL = `${process.env.REACT_APP_PANORAMAX_API}/?focus=pic&pic=`

export const getPanoramaxThumbUrl = (pictureId: string) =>
  `${process.env.REACT_APP_PANORAMAX_API}/api/pictures/${pictureId}/thumb.jpg`
