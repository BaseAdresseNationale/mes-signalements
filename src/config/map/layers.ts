// DSFR default blue color
export const DEFAULT_COLOR_DARK = '#000091'
export const DEFAULT_COLOR_LIGHT = '#f0f0f0'

const NUMEROS_POINT_MIN = 12
const NUMEROS_MIN = 17

const TOPONYME_MIN = 15
const TOPONYME_MAX = 24

const VOIE_MIN = 15
const VOIE_MAX = 24

export const PARCELLES_MINZOOM = 14

export const getAdresseCircleLayer = (color = DEFAULT_COLOR_DARK) => ({
  id: 'adresse',
  source: 'base-adresse-nationale',
  'source-layer': 'adresses',
  type: 'circle',
  minzoom: NUMEROS_POINT_MIN,
  paint: {
    'circle-color': color,
    'circle-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.5],
    'circle-radius': {
      stops: [
        [12, 0.8],
        [17, 6],
      ],
    },
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff',
  },
})

export const getAdresseLabelLayer = (color = DEFAULT_COLOR_DARK) => ({
  id: 'adresse-label',
  source: 'base-adresse-nationale',
  'source-layer': 'adresses',
  type: 'symbol',
  minzoom: NUMEROS_MIN,
  paint: {
    'text-color': color,
    'text-halo-color': '#fff',
    'text-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.5],
  },
  layout: {
    'text-font': ['Noto Sans Bold'],
    'text-size': {
      stops: [
        [NUMEROS_MIN, 13],
        [19, 16],
      ],
    },
    'text-field': [
      'case',
      ['has', 'suffixe'],
      ['format', ['get', 'numero'], {}, ' ', {}, ['get', 'suffixe'], {}],
      ['get', 'numero'],
    ],
    'text-ignore-placement': false,
    'text-variable-anchor': ['bottom'],
    'text-radial-offset': 1,
  },
})

export const getVoieLayer = (color = DEFAULT_COLOR_DARK) => ({
  id: 'voie',
  source: 'base-adresse-nationale',
  'source-layer': 'toponymes',
  type: 'symbol',
  minzoom: VOIE_MIN,
  maxzoom: VOIE_MAX,
  paint: {
    'text-color': color,
    'text-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.5],
  },
  layout: {
    'text-font': ['Noto Sans Bold'],
    'text-size': ['step', ['get', 'nbNumeros'], 8, 20, 10, 50, 14, 100, 16],
    'text-field': ['get', 'nomVoie'],
  },
})

export const getToponymeLayer = (color = DEFAULT_COLOR_DARK) => ({
  id: 'toponyme',
  source: 'base-adresse-nationale',
  'source-layer': 'toponymes',
  type: 'symbol',
  minzoom: TOPONYME_MIN,
  maxzoom: TOPONYME_MAX,
  paint: {
    'text-color': color,
    'text-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.5],
  },
  layout: {
    'text-font': ['Noto Sans Bold'],
    'text-size': {
      stops: [
        [0, 3],
        [10, 15],
      ],
    },
    'text-field': ['get', 'nomVoie'],
    'text-ignore-placement': false,
    'text-variable-anchor': ['bottom', 'top', 'right', 'left'],
    'text-radial-offset': 0.1,
  },
})

export const parcellesHighlightedLayer = {
  id: 'parcelle-highlighted',
  type: 'fill',
  source: 'cadastre',
  'source-layer': 'parcelles',
  filter: ['==', ['get', 'id'], ''],
  minzoom: PARCELLES_MINZOOM,
  layout: {
    visibility: 'none',
  },
  paint: {
    'fill-color': '#0053b3',
    'fill-opacity': 0.5,
  },
}

export const parcelleHoveredLayer = {
  id: 'parcelle-hovered',
  type: 'fill',
  source: 'cadastre',
  'source-layer': 'parcelles',
  minzoom: PARCELLES_MINZOOM,
  layout: {
    visibility: 'none',
  },
  paint: {
    'fill-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#0053b3',
      'transparent',
    ],
    'fill-opacity': 0.6,
  },
}

export const interactiveLayers = [
  getAdresseCircleLayer(),
  getAdresseLabelLayer(),
  getVoieLayer(),
  getToponymeLayer(),
  parcelleHoveredLayer,
]

export const getBanLayers = (color: string, layers: string[] = [], filter?: any) => {
  const allBANLayers = [
    getAdresseCircleLayer(color),
    getAdresseLabelLayer(color),
    getVoieLayer(color),
    getToponymeLayer(color),
  ]

  const selectedLayers = layers.length
    ? allBANLayers.filter(({ id }) => layers.includes(id))
    : allBANLayers

  return filter
    ? selectedLayers.map((layer) => ({
        ...layer,
        filter,
      }))
    : selectedLayers
}

export const staticCadastreLayers = [
  {
    id: 'batiments-fill',
    type: 'fill',
    source: 'cadastre',
    'source-layer': 'batiments',
    minzoom: PARCELLES_MINZOOM,
    paint: {
      'fill-opacity': 0.3,
    },
    layout: {
      visibility: 'none',
    },
  },
  {
    id: 'batiments-line',
    type: 'line',
    source: 'cadastre',
    'source-layer': 'batiments',
    minzoom: PARCELLES_MINZOOM,
    maxzoom: 22,
    layout: {
      visibility: 'none',
    },
    paint: {
      'line-opacity': 1,
      'line-color': 'rgba(0, 0, 0, 1)',
    },
  },
  {
    id: 'parcelles',
    type: 'line',
    source: 'cadastre',
    'source-layer': 'parcelles',
    minzoom: PARCELLES_MINZOOM,
    maxzoom: 24,
    layout: {
      visibility: 'none',
    },
    paint: {
      'line-color': '#0053b3',
      'line-opacity': 0.9,
      'line-width': {
        stops: [
          [16, 1],
          [17, 2],
        ],
      },
    },
  },
  {
    id: 'code-parcelles',
    type: 'symbol',
    source: 'cadastre',
    'source-layer': 'parcelles',
    minzoom: PARCELLES_MINZOOM,
    layout: {
      visibility: 'none',
      'text-field': '{numero}',
      'text-font': ['Noto Sans Bold'],
      'text-allow-overlap': false,
      'text-size': 16,
    },
    paint: {
      'text-halo-color': '#fff6f1',
      'text-halo-width': 1.5,
      'text-translate-anchor': 'map',
    },
  },
]
