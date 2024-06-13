export const PARCELLES_MINZOOM = 14

export const cadastreLayers = [
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
