import React from 'react'
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
      return (
        <>
          {(address as IBANPlateformeVoie).nomVoie}
          <br />
          {(address as IBANPlateformeVoie).codePostal} {(address as IBANPlateformeVoie).commune.nom}
        </>
      )
    case BANPlateformeResultTypeEnum.LIEU_DIT:
      return (
        <>
          {(address as IBANPlateformeLieuDit).nomVoie}
          <br />
          {(address as IBANPlateformeLieuDit).codePostal}{' '}
          {(address as IBANPlateformeLieuDit).commune.nom}
        </>
      )
    case BANPlateformeResultTypeEnum.NUMERO:
      return (
        <>
          {`${(address as IBANPlateformeNumero).numero} ${(address as IBANPlateformeNumero).suffixe || ''} ${(address as IBANPlateformeNumero).voie.nomVoie}`}
          {(address as IBANPlateformeNumero).lieuDitComplementNom && <br />}
          {(address as IBANPlateformeNumero).lieuDitComplementNom}
          <br />
          {(address as IBANPlateformeNumero).codePostal}{' '}
          {(address as IBANPlateformeNumero).commune.nom}
        </>
      )
    default:
      throw new Error(
        `Impossible de créer un signalement pour le type : ${
          (address as IBANPlateformeResult).type
        }`,
      )
  }
}
