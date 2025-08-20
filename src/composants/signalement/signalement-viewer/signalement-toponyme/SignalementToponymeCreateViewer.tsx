import React from 'react'
import { Signalement, ToponymeChangesRequestedDTO } from '../../../../api/signalement'
import { getPositionTypeLabel } from '../../../../utils/signalement.utils'
import { StyledRecapSection } from '../../signalement.styles'

interface SignalementToponymeCreateViewerProps {
  signalement: Signalement
}

export default function SignalementToponymeCreateViewer({
  signalement,
}: Readonly<SignalementToponymeCreateViewerProps>) {
  const { nomCommune } = signalement
  const { nom, positions, parcelles } = signalement.changesRequested as ToponymeChangesRequestedDTO

  return (
    <StyledRecapSection>
      <div className='signalement-recap'>
        <div>
          <h5>Ajout souhaité</h5>
          <p>
            {nom}
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
