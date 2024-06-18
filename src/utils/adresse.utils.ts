import {
  BANPlateformeResultTypeEnum,
  IBANPlateformeLieuDit,
  IBANPlateformeNumero,
  IBANPlateformeResult,
  IBANPlateformeVoie,
} from '../api/ban-plateforme/types'

export function getAdresseLabel(address: IBANPlateformeResult) {
  switch (address.type) {
    case BANPlateformeResultTypeEnum.VOIE:
      return (address as IBANPlateformeVoie).nomVoie
    case BANPlateformeResultTypeEnum.LIEU_DIT:
      return (address as IBANPlateformeLieuDit).nomVoie
    case BANPlateformeResultTypeEnum.NUMERO:
      return `${(address as IBANPlateformeNumero).numero} ${
        (address as IBANPlateformeNumero).suffixe || ''
      } ${(address as IBANPlateformeNumero).voie.nomVoie}`
    default:
      throw new Error(
        `Impossible de créer un signalement pour le type : ${
          (address as IBANPlateformeResult).type
        }`,
      )
  }
}
