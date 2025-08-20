import {
  BANPlateformeResultTypeEnum,
  IBANPlateformeCommune,
  IBANPlateformeLieuDit,
  IBANPlateformeNumero,
  IBANPlateformeResult,
  IBANPlateformeVoie,
} from './types'

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

export const castBANPlateformeResult = (
  address: IBANPlateformeResult,
): IBANPlateformeNumero | IBANPlateformeVoie | IBANPlateformeLieuDit | IBANPlateformeCommune => {
  switch (address.type) {
    case BANPlateformeResultTypeEnum.NUMERO:
      return address as IBANPlateformeNumero
    case BANPlateformeResultTypeEnum.VOIE:
      return address as IBANPlateformeVoie
    case BANPlateformeResultTypeEnum.LIEU_DIT:
      return address as IBANPlateformeLieuDit
    case BANPlateformeResultTypeEnum.COMMUNE:
      return address as IBANPlateformeCommune
    default:
      throw new Error(`Type de résultat BAN inconnu : ${address.type}`)
  }
}
