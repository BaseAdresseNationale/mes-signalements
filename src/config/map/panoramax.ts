export const PANORAMAX_SOURCE_ID = 'panoramax'

export const PANORAMAX_TILE_URL = `${process.env.REACT_APP_PANORAMAX_API}/api/map/{z}/{x}/{y}.mvt`

export const PANORAMAX_LAYERS_SOURCE = {
  SEQUENCES: 'sequences',
  PICTURES: 'pictures',
}

export const PANORAMAX_SEQUENCE_LAYER_ID = 'panoramax-sequences'
export const PANORAMAX_PICTURE_LAYER_ID = 'panoramax-pictures'

export const panoramaxSequenceLayer = {
  id: PANORAMAX_SEQUENCE_LAYER_ID,
  'source-layer': PANORAMAX_LAYERS_SOURCE.SEQUENCES,
  type: 'line',
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
  paint: {
    'circle-color': '#4845f4',
    'circle-radius': {
      stops: [
        [12, 0.8],
        [17, 6],
      ],
    },
    'circle-stroke-color': '#f8f4f0',
    'circle-stroke-width': {
      stops: [
        [12, 0.3],
        [17, 0.8],
      ],
    },
  },
}

export const PANORAMAX_VIEWER_URL = `${process.env.REACT_APP_PANORAMAX_API}/?focus=pic&pic=`

export const getPanoramaxThumbUrl = (pictureId: string) =>
  `${process.env.REACT_APP_PANORAMAX_API}/api/pictures/${pictureId}/thumb.jpg`
