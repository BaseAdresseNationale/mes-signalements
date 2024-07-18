import { MaplibreStyleDefinition } from '../../types/maplibre.types'

export const mapStyles: MaplibreStyleDefinition[] = [
  {
    id: 'Bright',
    title: 'Plan',
    uri: '/styles/osm-bright.json',
    previewImage: '/images/preview-plan.jpg',
  },
  {
    id: 'Ortho',
    title: 'Satellite',
    uri: '/styles/ortho.json',
    previewImage: '/images/preview-satellite.jpg',
  },
]
