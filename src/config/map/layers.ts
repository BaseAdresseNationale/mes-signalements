import { Signalement } from '../../api/signalement'

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

export const adresseCircleLayer = {
  id: 'adresse',
  source: 'base-adresse-nationale',
  'source-layer': 'adresses',
  type: 'circle',
  minzoom: NUMEROS_POINT_MIN,
  paint: {
    'circle-color': DEFAULT_COLOR_DARK,
    'circle-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.6],
    'circle-radius': {
      stops: [
        [12, 0.8],
        [17, 6],
      ],
    },
    'circle-stroke-width': 2,
    'circle-stroke-color': DEFAULT_COLOR_LIGHT,
  },
}

export const adresseLabelLayer = {
  id: 'adresse-label',
  source: 'base-adresse-nationale',
  'source-layer': 'adresses',
  type: 'symbol',
  minzoom: NUMEROS_MIN,
  paint: {
    'text-color': DEFAULT_COLOR_DARK,
    'text-halo-color': DEFAULT_COLOR_LIGHT,
    'text-halo-width': 2,
    'text-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.6],
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
}

export const voieLayer = {
  id: 'voie',
  source: 'base-adresse-nationale',
  'source-layer': 'toponymes',
  type: 'symbol',
  minzoom: VOIE_MIN,
  maxzoom: VOIE_MAX,
  paint: {
    'text-color': DEFAULT_COLOR_DARK,
    'text-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.8],
    'text-halo-color': DEFAULT_COLOR_LIGHT,
    'text-halo-width': 2,
    'text-translate-anchor': 'map',
  },
  layout: {
    'text-font': ['Noto Sans Bold'],
    'text-size': ['step', ['get', 'nbNumeros'], 8, 20, 10, 50, 14, 100, 16],
    'text-field': ['get', 'nomVoie'],
  },
}

export const toponymeLayer = {
  id: 'toponyme',
  source: 'base-adresse-nationale',
  'source-layer': 'toponymes',
  type: 'symbol',
  minzoom: TOPONYME_MIN,
  maxzoom: TOPONYME_MAX,
  paint: {
    'text-color': DEFAULT_COLOR_DARK,
    'text-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.8],
    'text-halo-color': DEFAULT_COLOR_LIGHT,
    'text-halo-width': 2,
    'text-translate-anchor': 'map',
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
    'text-allow-overlap': false,
  },
}

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

export const allBANLayers = [adresseCircleLayer, adresseLabelLayer, voieLayer, toponymeLayer]

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

export const signalementPointsLayer = {
  id: 'signalement-points',
  source: 'api-signalement',
  'source-layer': 'signalements',
  type: 'symbol',
  minzoom: 12,
  layout: {
    'icon-image': [
      'case',
      ['==', ['get', 'type'], Signalement.type.LOCATION_TO_CREATE],
      'cone-green',
      ['==', ['get', 'type'], Signalement.type.LOCATION_TO_UPDATE],
      'cone-purple',
      ['==', ['get', 'type'], Signalement.type.LOCATION_TO_DELETE],
      'cone-orange',
      'cone-purple',
    ],
    'icon-size': 0.05,
    'icon-offset': [0, 150],
    'icon-anchor': 'top',
  },
}

export const clusters = {
  id: 'clusters',
  type: 'circle',
  source: 'clusters',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': DEFAULT_COLOR_DARK,
    'circle-radius': ['step', ['get', 'point_count'], 15, 10, 20, 15, 25],
    'circle-stroke-width': 2,
    'circle-stroke-color': DEFAULT_COLOR_LIGHT,
  },
}

const clusterCount = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'clusters',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-size': 12,
    'text-font': ['Noto Sans Bold'],
  },
  paint: {
    'text-color': '#ffffff',
  },
}

export const unclusteredPoint = {
  id: 'unclustered-point',
  type: 'symbol',
  source: 'clusters',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': [
      'case',
      ['==', ['get', 'type'], Signalement.type.LOCATION_TO_CREATE],
      'marker-green',
      ['==', ['get', 'type'], Signalement.type.LOCATION_TO_UPDATE],
      'marker-purple',
      ['==', ['get', 'type'], Signalement.type.LOCATION_TO_DELETE],
      'marker-orange',
      'marker-purple',
    ],
    'icon-size': 0.35,
    'icon-anchor': 'bottom',
  },
}

export const clusterLayers = [clusters, clusterCount, unclusteredPoint]

export const interactiveLayers = [
  adresseCircleLayer,
  adresseLabelLayer,
  voieLayer,
  toponymeLayer,
  parcelleHoveredLayer,
  clusters,
  unclusteredPoint,
  signalementPointsLayer,
]
