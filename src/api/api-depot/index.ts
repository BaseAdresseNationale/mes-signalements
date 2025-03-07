import { APIDepotRevision } from './types'

const API_DEPOT_URL = process.env.REACT_APP_API_DEPOT_URL

if (!API_DEPOT_URL) {
  throw new Error('REACT_APP_API_DEPOT_URL is not defined')
}

export async function getCurrentRevision(codeCommune: string): Promise<APIDepotRevision | null> {
  const url = `${API_DEPOT_URL}/communes/${codeCommune}/current-revision`

  const response = await fetch(url)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Une erreur est survenue')
  }

  return response.json()
}
