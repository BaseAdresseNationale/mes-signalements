import React from 'react'
import { ExistingVoie, Signalement, VoieChangesRequestedDTO } from '../../../../api/signalement'
import { StyledRecapSection } from '../../signalement.styles'

interface SignalementVoieUpdateViewerProps {
  signalement: Signalement
  commune: string
}

export default function SignalementVoieUpdateViewer({
  signalement,
  commune,
}: Readonly<SignalementVoieUpdateViewerProps>) {
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
            {commune}
          </p>
        </div>
        <div>
          <h5>Modifications demandées</h5>
          <p>
            {nom}
            <br />
            {commune}
          </p>
        </div>
      </div>
    </StyledRecapSection>
  )
}
