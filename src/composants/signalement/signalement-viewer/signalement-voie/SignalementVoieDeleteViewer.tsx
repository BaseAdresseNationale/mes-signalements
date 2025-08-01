import React from 'react'
import { ExistingVoie, Signalement } from '../../../../api/signalement'
import { StyledRecapSection } from '../../signalement.styles'

interface SignalementVoieDeleteViewerProps {
  signalement: Signalement
}

export default function SignalementVoieDeleteViewer({
  signalement,
}: Readonly<SignalementVoieDeleteViewerProps>) {
  const { nomCommune } = signalement
  const { nom: existingNom } = signalement.existingLocation as ExistingVoie

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
        </div>
      </div>
    </StyledRecapSection>
  )
}
