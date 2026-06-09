import React from 'react'
import { Alert } from '../../../api/signalement'
import AlertComponent from '@codegouvfr/react-dsfr/Alert'
import { getDuration } from '../../../utils/date.utils'

interface AlertInfosProps {
  alert: Alert
}

const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30

export default function AlertInfos({ alert }: Readonly<AlertInfosProps>) {
  const { createdAt, source, comment, status, updatedAt, processedBy, rejectionReason } = alert
  return (
    <AlertComponent
      severity={
        status === Alert.status.PROCESSED
          ? 'success'
          : status === Alert.status.IGNORED
            ? 'error'
            : 'info'
      }
      title={
        status === Alert.status.PROCESSED
          ? 'Acceptée'
          : status === Alert.status.IGNORED
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

          {comment && (
            <p>
              <b>Commentaire : </b>
              {comment}
            </p>
          )}

          {status === Alert.status.PROCESSED && (
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

          {status === Alert.status.IGNORED && (
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
