import React from 'react'
import {
  BANPlateformeResultTypeEnum,
  IBANPlateformeLieuDit,
  IBANPlateformeNumero,
  IBANPlateformeResult,
  IBANPlateformeVoie,
} from '../api/ban-plateforme/types'

export function getAdresseLabel(
  address: IBANPlateformeResult,
  opts?: { withVoieLink: boolean; navigateFn: (path: string) => void },
) {
  const withVoieLink = opts?.withVoieLink || false
  const navigate = opts?.navigateFn

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
          {`${(address as IBANPlateformeNumero).numero} ${(address as IBANPlateformeNumero).suffixe || ''}`}{' '}
          {navigate && withVoieLink ? (
            <button
              className='fr-link'
              style={{
                color: 'inherit',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                textDecoration: 'underline',
              }}
              onClick={() => navigate(`/${(address as IBANPlateformeNumero).voie.id}`)}
            >
              {(address as IBANPlateformeNumero).voie.nomVoie}
            </button>
          ) : (
            (address as IBANPlateformeNumero).voie.nomVoie
          )}
          {(address as IBANPlateformeNumero).lieuDitComplementNom && <br />}
          {(address as IBANPlateformeNumero).lieuDitComplementNom}
          <br />
          {(address as IBANPlateformeNumero).codePostal}{' '}
          {(address as IBANPlateformeNumero).commune.nom}
        </>
      )
    default:
      throw new Error(`Impossible de créer un signalement pour le type : ${address.type}`)
  }
}

export function getAdresseString(address: IBANPlateformeResult) {
  switch (address.type) {
    case BANPlateformeResultTypeEnum.NUMERO:
      return `${(address as IBANPlateformeNumero).numero}${(address as IBANPlateformeNumero).suffixe ? ` ${(address as IBANPlateformeNumero).suffixe}` : ''} ${(address as IBANPlateformeNumero).voie.nomVoie} ${address.commune.code}`
    default:
      return `${(address as IBANPlateformeLieuDit).nomVoie} ${address.commune.code}`
  }
}
