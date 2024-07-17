import { MaplibreStyleDefinition } from '../../types/maplibre.types'
import { DEFAULT_COLOR_DARK, DEFAULT_COLOR_LIGHT } from './layers'

export const mapStyles: MaplibreStyleDefinition[] = [
  {
    id: 'Bright',
    title: 'Plan',
    uri: '/styles/osm-bright.json',
    layersColor: DEFAULT_COLOR_DARK,
    previewImage: '/images/preview-plan.jpg',
  },
  {
    id: 'Ortho',
    title: 'Satellite',
    uri: '/styles/ortho.json',
    layersColor: DEFAULT_COLOR_LIGHT,
    previewImage: '/images/preview-satellite.jpg',
  },
]
