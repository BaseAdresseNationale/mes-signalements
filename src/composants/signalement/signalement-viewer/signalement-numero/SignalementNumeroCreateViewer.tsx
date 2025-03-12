import React from 'react'
import { NumeroChangesRequestedDTO, Signalement } from '../../../../api/signalement'
import { getPositionTypeLabel } from '../../../../utils/signalement.utils'
import { StyledRecapSection } from '../../signalement.styles'

interface SignalementNumeroCreateViewerProps {
  signalement: Signalement
  commune: string
}

export default function SignalementNumeroCreateViewer({
  signalement,
  commune,
}: Readonly<SignalementNumeroCreateViewerProps>) {
  const { numero, suffixe, nomVoie, nomComplement, positions, parcelles } =
    signalement.changesRequested as NumeroChangesRequestedDTO

  return (
    <StyledRecapSection>
      <div className='signalement-recap'>
        <div>
          <h5>Ajout souhaité</h5>
          <p>
            {numero} {suffixe} {nomVoie}{' '}
            {nomComplement && (
              <>
                <br />
                {nomComplement}
              </>
            )}
            <br />
            {commune}
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
