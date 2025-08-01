import React from 'react'
import { ExistingToponyme, Signalement } from '../../../../api/signalement'
import { getPositionTypeLabel } from '../../../../utils/signalement.utils'
import { StyledRecapSection } from '../../signalement.styles'

interface SignalementToponymeDeleteViewerProps {
  signalement: Signalement
}

export default function SignalementToponymeDeleteViewer({
  signalement,
}: Readonly<SignalementToponymeDeleteViewerProps>) {
  const { nomCommune } = signalement
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
      </div>
    </StyledRecapSection>
  )
}
