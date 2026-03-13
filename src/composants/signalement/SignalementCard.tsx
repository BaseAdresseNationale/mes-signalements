import React from 'react'
import styled from 'styled-components'
import { Signalement } from '../../api/signalement'
import {
  getSignalementColor,
  getSignalementLabel,
  getSignalementTypeLabel,
} from '../../utils/signalement.utils'
import Badge from '@codegouvfr/react-dsfr/Badge'

const StyledSignalementCard = styled.div`
  p {
    margin: 2px 0;
  }
`

interface SignalementCardProps {
  signalement: Signalement
}

export default function SignalementCard({ signalement }: SignalementCardProps) {
  return (
    <StyledSignalementCard>
      <Badge
        severity={
          signalement.status === Signalement.status.PROCESSED
            ? 'success'
            : signalement.status === Signalement.status.IGNORED
              ? 'error'
              : undefined
        }
        className={`fr-badge--${getSignalementColor(signalement.type)}`}
      >
        {getSignalementTypeLabel(signalement.type)}
      </Badge>
      <p>{getSignalementLabel(signalement)}</p>
      <p>
        <b>Créé le</b> {new Date(signalement.createdAt).toLocaleDateString()} via{' '}
        {signalement.source.nom}
      </p>
      {signalement.processedBy && (
        <p>
          <b>{signalement.status === Signalement.status.PROCESSED ? 'Accepté' : 'Refusé'} le</b>{' '}
          {new Date(signalement.updatedAt).toLocaleDateString()} via {signalement.processedBy.nom}
        </p>
      )}
    </StyledSignalementCard>
  )
}
