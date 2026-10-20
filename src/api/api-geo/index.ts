import { APIGeoCommune, APIGeoDepartement } from './types'

const API_GEO_URL = 'https://geo.api.gouv.fr'

async function fetchJSON<T>(url: URL): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Une erreur est survenue')
  }

  return response.json()
}

export function getCommune(code: string): Promise<APIGeoCommune> {
  return fetchJSON<APIGeoCommune>(new URL(`${API_GEO_URL}/communes/${encodeURIComponent(code)}`))
}

export function getCommuneByPosition(lng: number, lat: number): Promise<APIGeoCommune[]> {
  const url = new URL(`${API_GEO_URL}/communes`)
  url.searchParams.append('lat', lat.toString())
  url.searchParams.append('lon', lng.toString())
  url.searchParams.append('fields', 'nom,code,centre')
  url.searchParams.append('format', 'json')
  url.searchParams.append('geometry', 'centre')

  return fetchJSON<APIGeoCommune[]>(url)
}

export function getDepartement(code: string): Promise<APIGeoDepartement> {
  return fetchJSON<APIGeoDepartement>(
    new URL(`${API_GEO_URL}/departements/${encodeURIComponent(code)}`),
  )
}

export function searchDepartements(query?: string): Promise<APIGeoDepartement[]> {
  const url = new URL(`${API_GEO_URL}/departements`)
  if (query) {
    url.searchParams.append('nom', query)
  }
  url.searchParams.append('fields', 'nom,code,codeRegion')

  return fetchJSON<APIGeoDepartement[]>(url)
}
