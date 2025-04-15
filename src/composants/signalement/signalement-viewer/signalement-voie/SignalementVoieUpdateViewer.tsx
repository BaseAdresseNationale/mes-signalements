import React from 'react'
import { ExistingVoie, Signalement, VoieChangesRequestedDTO } from '../../../../api/signalement'
import { StyledRecapSection } from '../../signalement.styles'

interface SignalementVoieUpdateViewerProps {
  signalement: Signalement
}

export default function SignalementVoieUpdateViewer({
  signalement,
}: Readonly<SignalementVoieUpdateViewerProps>) {
  const { nomCommune } = signalement
  const { nom } = signalement.changesRequested as VoieChangesRequestedDTO
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
        <div>
          <h5>Modifications demandées</h5>
          <p>
            {nom}
            <br />
            {nomCommune}
          </p>
        </div>
      </div>
    </StyledRecapSection>
  )
}
