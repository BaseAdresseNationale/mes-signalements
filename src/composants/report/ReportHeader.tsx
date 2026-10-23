import React from 'react'
import styled from 'styled-components'
import Alert from '@codegouvfr/react-dsfr/Alert'
import Badge from '@codegouvfr/react-dsfr/Badge'
import { Alert as AlertModel, Signalement } from '../../api/signalement'
import { getDuration } from '../../utils/date.utils'

const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30

const STATUS_BADGES: Record<
  string,
  { label: string; severity: 'info' | 'success' | 'error' | 'warning' }
> = {
  PENDING: { label: 'En attente', severity: 'info' },
  PROCESSED: { label: 'Acceptée', severity: 'success' },
  IGNORED: { label: 'Refusée', severity: 'error' },
  EXPIRED: { label: 'Expirée', severity: 'warning' },
}

const StyledHeader = styled.header`
  margin-bottom: 1.5rem;

  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  h4 {
    margin-bottom: 0.5rem;
  }

  .meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--text-mention-grey);

    li {
      padding: 0;
      margin: 0;

      &::before {
        content: none;
      }
    }

    [class*='fr-icon-'] {
      margin-right: 0.5rem;
    }
  }

  .fr-alert {
    margin-top: 1rem;
  }
`

interface ReportHeaderProps {
  report: Signalement | AlertModel
  title: string
  typeLabel: string
  typeColor: string
  outcomeDetails?: React.ReactNode
  // Brouillon non envoyé : ni statut ni date de dépôt.
  preview?: boolean
}

export default function ReportHeader({
  report,
  title,
  typeLabel,
  typeColor,
  outcomeDetails,
  preview = false,
}: Readonly<ReportHeaderProps>) {
  const { status, createdAt, updatedAt, source, processedBy, rejectionReason } = report
  const statusBadge = STATUS_BADGES[status] ?? STATUS_BADGES.PENDING
  const isProcessed = status === Signalement.status.PROCESSED
  const isIgnored = status === Signalement.status.IGNORED

  return (
    <StyledHeader>
      <div className='badges'>
        <Badge small className={`fr-badge--${typeColor}`} noIcon>
          {typeLabel}
        </Badge>
        {!preview && (
          <Badge small severity={statusBadge.severity}>
            {statusBadge.label}
          </Badge>
        )}
      </div>
      <h4>{title}</h4>
      {!preview && (
        <ul className='meta fr-text--sm'>
          <li>
            <span className='fr-icon-map-pin-2-line fr-icon--sm' aria-hidden='true' />
            {report.nomCommune} ({report.codeCommune})
          </li>
          <li>
            <span className='fr-icon-calendar-event-line fr-icon--sm' aria-hidden='true' />
            {Date.now() - new Date(createdAt).getTime() > MONTH_IN_MS ? (
              <>
                Déposée le <b>{new Date(createdAt).toLocaleDateString()}</b>
              </>
            ) : (
              <>
                Déposée il y a <b>{getDuration(new Date(createdAt))}</b>
              </>
            )}
            {source && (
              <>
                {' '}
                via <b>{source.nom}</b>
              </>
            )}
          </li>
        </ul>
      )}

      {!preview && (isProcessed || isIgnored) && (
        <Alert
          small
          severity={isProcessed ? 'success' : 'error'}
          description={
            <>
              {isProcessed ? 'Acceptée' : 'Refusée'} le{' '}
              <b>{new Date(updatedAt).toLocaleDateString()}</b>
              {processedBy && (
                <>
                  {' '}
                  via <b>{processedBy.nom}</b>
                </>
              )}
              {isIgnored && rejectionReason && (
                <>
                  <br />
                  <b>Raison :</b> {rejectionReason}
                </>
              )}
              {outcomeDetails}
            </>
          }
        />
      )}
    </StyledHeader>
  )
}
