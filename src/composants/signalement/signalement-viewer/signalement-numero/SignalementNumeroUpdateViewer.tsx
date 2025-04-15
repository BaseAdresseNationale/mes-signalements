import React from 'react'
import { ExistingNumero, NumeroChangesRequestedDTO, Signalement } from '../../../../api/signalement'
import { getPositionTypeLabel } from '../../../../utils/signalement.utils'
import { StyledRecapSection } from '../../signalement.styles'

interface SignalementNumeroUpdateViewerProps {
  signalement: Signalement
}

export default function SignalementNumeroUpdateViewer({
  signalement,
}: Readonly<SignalementNumeroUpdateViewerProps>) {
  const { nomCommune } = signalement
  const { numero, suffixe, nomVoie, nomComplement, positions, parcelles } =
    signalement.changesRequested as NumeroChangesRequestedDTO

  const {
    numero: existingNumero,
    suffixe: existingSuffixe,
    nomComplement: existingNomComplement,
    position: existingPosition,
    parcelles: existingParcelles,
    toponyme: { nom: existingNomVoie },
  } = signalement.existingLocation as ExistingNumero

  return (
    <StyledRecapSection>
      <div className='signalement-recap'>
        <div>
          <h5>Lieu concerné</h5>
          <p>
            {`${existingNumero} ${existingSuffixe || ''}`} {existingNomVoie}{' '}
            {existingNomComplement && <br />}
            <br />
            {nomCommune}
          </p>
          <h6>Position : </h6>
          <b>{getPositionTypeLabel(existingPosition.type)}</b> :{' '}
          {existingPosition.point.coordinates[0]}, {existingPosition.point.coordinates[1]}
          <br />
          {existingParcelles && existingParcelles.length > 0 && (
            <>
              <h6>Parcelles : </h6>
              {existingParcelles.map((parcelle, index) => (
                <div key={index}>{parcelle}</div>
              ))}
            </>
          )}
        </div>
        <div>
          <h5>Modifications demandées</h5>
          <p>
            {numero} {suffixe} {nomVoie}{' '}
            {nomComplement && (
              <>
                <br />
                {nomComplement}
              </>
            )}
            <br />
            {nomCommune}
          </p>
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
        </div>
      </div>
    </StyledRecapSection>
  )
}
