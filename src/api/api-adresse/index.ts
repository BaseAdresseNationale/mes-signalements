import { APIAdressePropertyType, APIAdresseResult } from './types'

type SearchOptions = {
  q: string
  type?: APIAdressePropertyType
  citycode?: string
  limit?: number
  lng?: number
  lat?: number
}

const API_ADRESSE_URL = process.env.REACT_APP_API_ADRESSE_URL

if (!API_ADRESSE_URL) {
  throw new Error('REACT_APP_API_ADRESSE_URL is not defined')
}

export async function search(options: SearchOptions): Promise<APIAdresseResult> {
  const url = new URL(`${API_ADRESSE_URL}/search`)

  Object.entries(options).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value.toString())
    }
  })

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Une erreur est survenue')
  }

  return response.json()
}
