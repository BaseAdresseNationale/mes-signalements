import React from 'react'
import {
  BANPlateformeResultTypeEnum,
  IBANPlateformeCommune,
  IBANPlateformeLieuDit,
  IBANPlateformeNumero,
  IBANPlateformeResult,
  IBANPlateformeVoie,
} from '../api/ban-plateforme/types'

export function getAdresseLabel(
  address: IBANPlateformeResult,
  opts?: { navigateFn: (path: string) => void },
) {
  const navigate = opts?.navigateFn

  switch (address.type) {
    case BANPlateformeResultTypeEnum.VOIE:
      return (
        <>
          {(address as IBANPlateformeVoie).nomVoie}
          <br />
          {(address as IBANPlateformeVoie).codePostal}{' '}
          {navigate ? (
            <button
              className='fr-link'
              style={{
                color: 'inherit',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                textDecoration: 'underline',
              }}
              onClick={() => navigate(`/${(address as IBANPlateformeVoie).commune.id}`)}
            >
              {(address as IBANPlateformeVoie).commune.nom}
            </button>
          ) : (
            (address as IBANPlateformeVoie).commune.nom
          )}
        </>
      )
    case BANPlateformeResultTypeEnum.LIEU_DIT:
      return (
        <>
          {(address as IBANPlateformeLieuDit).nomVoie}
          <br />
          {(address as IBANPlateformeLieuDit).codePostal}{' '}
          {navigate ? (
            <button
              className='fr-link'
              style={{
                color: 'inherit',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                textDecoration: 'underline',
              }}
              onClick={() => navigate(`/${(address as IBANPlateformeLieuDit).commune.id}`)}
            >
              {(address as IBANPlateformeLieuDit).commune.nom}
            </button>
          ) : (
            (address as IBANPlateformeLieuDit).commune.nom
          )}
        </>
      )
    case BANPlateformeResultTypeEnum.NUMERO:
      return (
        <>
          {`${(address as IBANPlateformeNumero).numero} ${(address as IBANPlateformeNumero).suffixe || ''}`}{' '}
          {navigate ? (
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
          {navigate ? (
            <button
              className='fr-link'
              style={{
                color: 'inherit',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                textDecoration: 'underline',
              }}
              onClick={() => navigate(`/${(address as IBANPlateformeNumero).commune.id}`)}
            >
              {(address as IBANPlateformeNumero).commune.nom}
            </button>
          ) : (
            (address as IBANPlateformeNumero).commune.nom
          )}
        </>
      )
    default:
      throw new Error(`Impossible de créer un signalement pour le type : ${address.type}`)
  }
}

export function getAdresseString(address: IBANPlateformeResult) {
  switch (address.type) {
    case BANPlateformeResultTypeEnum.NUMERO:
      return `${(address as IBANPlateformeNumero).numero}${(address as IBANPlateformeNumero).suffixe ? ` ${(address as IBANPlateformeNumero).suffixe}` : ''} ${(address as IBANPlateformeNumero).voie.nomVoie} ${(address as IBANPlateformeNumero).commune.code}`
    case BANPlateformeResultTypeEnum.VOIE:
    case BANPlateformeResultTypeEnum.LIEU_DIT:
      return `${(address as IBANPlateformeLieuDit).nomVoie} ${(address as IBANPlateformeLieuDit).commune.code}`
    default:
      return `${(address as IBANPlateformeCommune).nomCommune} (${(address as IBANPlateformeCommune).codeCommune})`
  }
}
