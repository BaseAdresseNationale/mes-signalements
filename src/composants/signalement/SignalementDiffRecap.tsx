import React from 'react'

import { Signalement } from '../../api/signalement'
import { getPositionTypeLabel } from '../../utils/signalement.utils'
import { getAdresseLabel } from '../../utils/adresse.utils'
import { ChangesRequested } from '../../types/signalement.types'
import {
  IBANPlateformeLieuDit,
  IBANPlateformeNumero,
  IBANPlateformeVoie,
} from '../../api/ban-plateforme/types'
import { StyledRecapSection } from './signalement.styles'

interface SignalementDiffRecapProps {
  signalement: Signalement
  address: IBANPlateformeNumero | IBANPlateformeVoie | IBANPlateformeLieuDit
}

export default function SignalementDiffRecap({
  signalement,
  address,
}: Readonly<SignalementDiffRecapProps>) {
  const { numero, suffixe, nomVoie, nomComplement, positions, parcelles, nom } =
    signalement.changesRequested as ChangesRequested

  const getChangesRequestedLabel = () => {
    return numero ? (
      <>
        {numero} {suffixe} {nomVoie}{' '}
        {nomComplement && (
          <>
            <br />
            {nomComplement}
          </>
        )}
        <br />
        {address.codePostal} {address.commune.nom}
      </>
    ) : (
      <>
        {nom}
        <br />
        {address.codePostal} {address.commune.nom}
      </>
    )
  }

  return (
    <>
      {signalement.type === Signalement.type.LOCATION_TO_UPDATE && (
        <StyledRecapSection>
          <div className='signalement-recap'>
            <div>
              <h5>Lieu concerné</h5>
              <p>{getAdresseLabel(address)}</p>
              {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).positions && (
                <>
                  <h6>Positions : </h6>
                  {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).positions.map(
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
              )}
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
              {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).positions && (
                <>
                  <h6>Positions : </h6>
                  {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).positions.map(
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
              )}
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
