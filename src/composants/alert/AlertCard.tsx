import React from 'react'
import styled from 'styled-components'
import { Alert } from '../../api/signalement'
import Badge from '@codegouvfr/react-dsfr/Badge'
import { getAlertColor, getAlertTypeLabel } from '../../utils/alert.utils'

const StyledAlertCard = styled.div`
  p {
    margin: 2px 0;
  }
`

interface AlertCardProps {
  alert: Alert
}

export default function AlertCard({ alert }: AlertCardProps) {
  return (
    <StyledAlertCard>
      <Badge
        severity={
          alert.status === Alert.status.PROCESSED
            ? 'success'
            : alert.status === Alert.status.IGNORED
              ? 'error'
              : undefined
        }
        className={`fr-badge--${getAlertColor(alert.type)}`}
      >
        {getAlertTypeLabel(alert.type)}
      </Badge>
      <p>Créé le {new Date(alert.createdAt).toLocaleDateString()}</p>
      {alert.processedBy && (
        <p>
          {alert.status === Alert.status.PROCESSED ? 'Accepté' : 'Refusé'} le{' '}
          {new Date(alert.updatedAt).toLocaleDateString()} via {alert.processedBy.nom}
        </p>
      )}
    </StyledAlertCard>
  )
}
