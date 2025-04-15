import React from 'react'
import { ExistingNumero, Signalement } from '../../../../api/signalement'
import { getPositionTypeLabel } from '../../../../utils/signalement.utils'
import { StyledRecapSection } from '../../signalement.styles'

interface SignalementNumeroDeleteViewerProps {
  signalement: Signalement
}

export default function SignalementNumeroDeleteViewer({
  signalement,
}: Readonly<SignalementNumeroDeleteViewerProps>) {
  const { nomCommune } = signalement
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
            {existingNomComplement && (
              <>
                <br />
                {existingNomComplement}
              </>
            )}
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
