import { APIAdresseResult } from './types'

type SearchOptions = {
  q: string
  limit?: number
  lng?: number
  lat?: number
}

const API_ADRESSE_URL = process.env.REACT_APP_API_ADRESSE_URL

if (!API_ADRESSE_URL) {
  throw new Error('REACT_APP_API_ADRESSE_URL is not defined')
}

export async function search(options: SearchOptions): Promise<APIAdresseResult> {
  const { q, limit, lng, lat } = options
  let url = `${API_ADRESSE_URL}/search/?q=${encodeURIComponent(q)}`

  if (lng && lat) {
    url += `&lng=${lng}&lat=${lat}`
  }

  if (limit) {
    url += `&limit=${limit}`
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Une erreur est survenue')
  }

  return response.json()
}
