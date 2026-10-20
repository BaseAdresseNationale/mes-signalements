export type APIGeoCommune = {
  nom: string
  code: string
  codeDepartement?: string
  centre?: {
    type: 'Point'
    coordinates: [number, number]
  }
}

export type APIGeoDepartement = {
  nom: string
  code: string
  codeRegion?: string
}
