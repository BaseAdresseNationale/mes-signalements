import { DEFAULT_COLOR_DARK, DEFAULT_COLOR_LIGHT } from './layers'

export const mapStyles = [
  {
    id: 'Bright',
    title: 'Plan',
    icon: 'maplibregl-ctrl-plan',
    uri: '/styles/osm-bright.json',
    layersColor: DEFAULT_COLOR_DARK,
  },
  {
    id: 'Ortho',
    title: 'Vue aérienne',
    icon: 'maplibregl-ctrl-satellite',
    uri: '/styles/ortho.json',
    layersColor: DEFAULT_COLOR_LIGHT,
  },
]
