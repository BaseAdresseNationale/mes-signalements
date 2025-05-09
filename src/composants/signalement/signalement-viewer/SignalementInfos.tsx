import React from 'react'
import { Signalement } from '../../../api/signalement'
import Alert from '@codegouvfr/react-dsfr/Alert'
import { getDuration } from '../../../utils/date.utils'

interface SignalementInfosProps {
  signalement: Signalement
}

const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30

export default function SignalementInfos({ signalement }: Readonly<SignalementInfosProps>) {
  const { createdAt, source, changesRequested, status, updatedAt, processedBy, rejectionReason } =
    signalement
  return (
    <Alert
      severity={
        status === Signalement.status.PROCESSED
          ? 'success'
          : status === Signalement.status.IGNORED
            ? 'error'
            : 'info'
      }
      title={
        status === Signalement.status.PROCESSED
          ? 'Acceptée'
          : status === Signalement.status.IGNORED
            ? 'Refusée'
            : 'En attente de traitement'
      }
      description={
        <div>
          {Date.now() - new Date(createdAt).getTime() > MONTH_IN_MS ? (
            <p>
              Déposée le <b>{new Date(createdAt).toLocaleDateString()}</b>{' '}
            </p>
          ) : (
            <p>
              Déposée il y a <b>{getDuration(new Date(createdAt))}</b>{' '}
            </p>
          )}
          {source && (
            <p>
              via <b>{source.nom}</b>
            </p>
          )}

          {changesRequested.comment && (
            <p>
              <b>Commentaire : </b>
              {changesRequested.comment}
            </p>
          )}

          {status === Signalement.status.PROCESSED && (
            <>
              <p>
                Acceptée le <b>{new Date(updatedAt).toLocaleDateString()}</b>
              </p>
              {processedBy && (
                <p>
                  via <b>{processedBy.nom}</b>
                </p>
              )}
            </>
          )}

          {status === Signalement.status.IGNORED && (
            <>
              <p>
                Refusée le <b>{new Date(updatedAt).toLocaleDateString()}</b>
              </p>
              {processedBy && (
                <p>
                  via <b>{processedBy.nom}</b>
                </p>
              )}
              {rejectionReason && (
                <p>
                  <b>Raison : </b>
                  {rejectionReason}
                </p>
              )}
            </>
          )}
        </div>
      }
    />
  )
}
