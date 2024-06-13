import { IBANPlateformeResult } from './types'

const BAN_PLATEFORME_URL = process.env.REACT_APP_BAN_PLATEFORME_URL

if (!BAN_PLATEFORME_URL) {
  throw new Error('REACT_APP_BAN_PLATEFORME_URL is not defined')
}

export async function lookup(banId: string): Promise<IBANPlateformeResult> {
  const url = `${BAN_PLATEFORME_URL}/lookup/${banId}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Une erreur est survenue')
  }

  return response.json()
}
