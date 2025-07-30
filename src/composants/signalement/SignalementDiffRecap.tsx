import React from 'react'

import { Signalement } from '../../api/signalement'
import { getPositionTypeLabel } from '../../utils/signalement.utils'
import { getAdresseLabel } from '../../utils/adresse.utils'
import { ChangesRequested } from '../../types/signalement.types'
import {
  BANPlateformeResultTypeEnum,
  IBANPlateformeCommune,
  IBANPlateformeLieuDit,
  IBANPlateformeNumero,
  IBANPlateformeResult,
} from '../../api/ban-plateforme/types'
import { StyledRecapSection } from './signalement.styles'

interface SignalementDiffRecapProps {
  signalement: Signalement
  address: IBANPlateformeResult
}

export default function SignalementDiffRecap({
  signalement,
  address,
}: Readonly<SignalementDiffRecapProps>) {
  const { numero, suffixe, nomVoie, nomComplement, positions, parcelles, nom } =
    signalement.changesRequested as ChangesRequested

  const getChangesRequestedLabel = () => {
    switch (address.type) {
      case BANPlateformeResultTypeEnum.VOIE:
      case BANPlateformeResultTypeEnum.LIEU_DIT:
        return (
          <>
            {nom}
            <br />
            {(address as IBANPlateformeLieuDit).codePostal}{' '}
            {(address as IBANPlateformeLieuDit).commune.nom}
          </>
        )
      case BANPlateformeResultTypeEnum.NUMERO:
        return (
          <>
            {numero} {suffixe} {nomVoie}{' '}
            {nomComplement && (
              <>
                <br />
                {nomComplement}
              </>
            )}
            <br />
            {(address as IBANPlateformeNumero).codePostal}{' '}
            {(address as IBANPlateformeNumero).commune.nom}
          </>
        )
      case BANPlateformeResultTypeEnum.COMMUNE:
        return (
          <>
            {numero} {suffixe} {nomVoie}{' '}
            {nomComplement && (
              <>
                <br />
                {nomComplement}
              </>
            )}
            <br />
            {(address as IBANPlateformeCommune).codesPostaux.join(', ')}{' '}
            {(address as IBANPlateformeCommune).nomCommune}
          </>
        )
      default:
    }
  }

  return (
    <>
      {signalement.type === Signalement.type.LOCATION_TO_UPDATE && (
        <StyledRecapSection>
          <div className='signalement-recap'>
            <div>
              <h5>Lieu concerné</h5>
              <p>{getAdresseLabel(address)}</p>
              {(address as IBANPlateformeNumero).positions ? (
                <>
                  <h6>Positions : </h6>
                  {(address as IBANPlateformeNumero).positions.map(
                    ({ position, positionType }, index) => {
                      return (
                        <React.Fragment key={index}>
                          <b>{getPositionTypeLabel(positionType)}</b> : {position.coordinates[0]},{' '}
                          {position.coordinates[1]}
                          <br />
                        </React.Fragment>
                      ) // eslint-disable-line react/no-array-index-key
                    },
                  )}
                </>
              ) : (address as IBANPlateformeLieuDit).position ? (
                <>
                  <h6>Position : </h6>
                  <b>
                    {getPositionTypeLabel((address as IBANPlateformeLieuDit).position.type)}
                  </b> : {(address as IBANPlateformeLieuDit).position.coordinates[0]},{' '}
                  {(address as IBANPlateformeLieuDit).position.coordinates[1]}
                  <br />
                </>
              ) : null}
              {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).parcelles?.length > 0 && (
                <>
                  <h6>Parcelles : </h6>
                  {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).parcelles.map(
                    (parcelle, index) => (
                      <div key={index}>{parcelle}</div>
                    ),
                  )}
                </>
              )}
            </div>
            <div>
              <h5>Modifications demandées</h5>
              <p>{getChangesRequestedLabel()}</p>
              {positions && (
                <>
                  <h6>Positions : </h6>
                  {positions.map(({ point, type }, index) => {
                    return (
                      <React.Fragment key={index}>
                        <b>{getPositionTypeLabel(type)}</b> : {point.coordinates[0]},{' '}
                        {point.coordinates[1]}
                        <br />
                      </React.Fragment>
                    ) // eslint-disable-line react/no-array-index-key
                  })}
                </>
              )}
              {parcelles?.length > 0 && (
                <>
                  <h6>Parcelles : </h6>
                  {parcelles.map((parcelle, index) => (
                    <div key={index}>{parcelle}</div>
                  ))}
                </>
              )}
              {signalement.changesRequested.comment && (
                <div>
                  <h6>Autres informations</h6>
                  <p>{signalement.changesRequested.comment}</p>
                </div>
              )}
            </div>
          </div>
        </StyledRecapSection>
      )}
      {signalement.type === Signalement.type.LOCATION_TO_CREATE && (
        <StyledRecapSection>
          <div className='signalement-recap'>
            <div>
              <p>{getChangesRequestedLabel()}</p>
              {positions && (
                <>
                  <h6>Positions : </h6>
                  {positions.map(({ point, type }, index) => {
                    return (
                      <React.Fragment key={index}>
                        <b>{getPositionTypeLabel(type)}</b> : {point.coordinates[0]},{' '}
                        {point.coordinates[1]}
                        <br />
                      </React.Fragment>
                    ) // eslint-disable-line react/no-array-index-key
                  })}
                </>
              )}
              {parcelles?.length > 0 && (
                <>
                  <h6>Parcelles : </h6>
                  {parcelles.map((parcelle, index) => (
                    <div key={index}>{parcelle}</div>
                  ))}
                </>
              )}
              {signalement.changesRequested.comment && (
                <div>
                  <h6>Autres informations</h6>
                  <p>{signalement.changesRequested.comment}</p>
                </div>
              )}
            </div>
          </div>
        </StyledRecapSection>
      )}

      {signalement.type === Signalement.type.LOCATION_TO_DELETE && (
        <StyledRecapSection>
          <div className='signalement-recap'>
            <div>
              <h5>Lieu concerné</h5>
              <p>{getAdresseLabel(address)}</p>
              {(address as IBANPlateformeNumero).positions ? (
                <>
                  <h6>Positions : </h6>
                  {(address as IBANPlateformeNumero).positions.map(
                    ({ position, positionType }, index) => {
                      return (
                        <React.Fragment key={index}>
                          <b>{getPositionTypeLabel(positionType)}</b> : {position.coordinates[0]},{' '}
                          {position.coordinates[1]}
                          <br />
                        </React.Fragment>
                      ) // eslint-disable-line react/no-array-index-key
                    },
                  )}
                </>
              ) : (address as IBANPlateformeLieuDit).position ? (
                <>
                  <h6>Position : </h6>
                  <b>
                    {getPositionTypeLabel((address as IBANPlateformeLieuDit).position.type)}
                  </b> : {(address as IBANPlateformeLieuDit).position.coordinates[0]},{' '}
                  {(address as IBANPlateformeLieuDit).position.coordinates[1]}
                  <br />
                </>
              ) : null}
              {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).parcelles?.length > 0 && (
                <>
                  <h6>Parcelles : </h6>
                  {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).parcelles.map(
                    (parcelle, index) => (
                      <div key={index}>{parcelle}</div>
                    ),
                  )}
                </>
              )}
            </div>
            <div>
              <h5>Raison de la demande de suppression</h5>
              <p>{signalement.changesRequested.comment}</p>
            </div>
          </div>
        </StyledRecapSection>
      )}
    </>
  )
}
