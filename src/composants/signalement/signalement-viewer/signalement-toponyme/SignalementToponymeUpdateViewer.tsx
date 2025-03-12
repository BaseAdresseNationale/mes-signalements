import React from 'react'
import {
  ExistingToponyme,
  Signalement,
  ToponymeChangesRequestedDTO,
} from '../../../../api/signalement'
import { getPositionTypeLabel } from '../../../../utils/signalement.utils'
import { StyledRecapSection } from '../../signalement.styles'

interface SignalementToponymeUpdateViewerProps {
  signalement: Signalement
  commune: string
}

export default function SignalementToponymeUpdateViewer({
  signalement,
  commune,
}: Readonly<SignalementToponymeUpdateViewerProps>) {
  const { nom, parcelles, positions } = signalement.changesRequested as ToponymeChangesRequestedDTO

  const {
    nom: existingNom,
    position: existingPosition,
    parcelles: existingParcelles,
  } = signalement.existingLocation as ExistingToponyme

  return (
    <StyledRecapSection>
      <div className='signalement-recap'>
        <div>
          <h5>Lieu concerné</h5>
          <p>
            {existingNom}
            <br />
            {commune}
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
            {nom}
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
