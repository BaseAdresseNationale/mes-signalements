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
      <p>
        {alert.nomCommune} ({alert.codeCommune})
      </p>
      <p>
        <b>Déposée le</b> {new Date(alert.createdAt).toLocaleDateString()} via {alert.source.nom}
      </p>
      {alert.processedBy && (
        <>
          <p>
            <b>{alert.status === Alert.status.PROCESSED ? 'Acceptée' : 'Refusée'} le</b>{' '}
            {new Date(alert.updatedAt).toLocaleDateString()} via {alert.processedBy.nom}
          </p>
          {alert.status === Alert.status.PROCESSED && alert.context?.createdAddress?.label && (
            <p>
              <b>Adresse créée</b> : {alert.context.createdAddress.label}
            </p>
          )}
          {alert.status === Alert.status.IGNORED && alert.rejectionReason && (
            <p>
              <b>Raison du refus</b> : {alert.rejectionReason}
            </p>
          )}
        </>
      )}
    </StyledAlertCard>
  )
}
