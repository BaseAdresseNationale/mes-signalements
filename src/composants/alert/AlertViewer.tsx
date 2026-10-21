import React from 'react'
import CallOut from '@codegouvfr/react-dsfr/CallOut'
import Tag from '@codegouvfr/react-dsfr/Tag'
import { Alert } from '../../api/signalement'
import ReportHeader from '../report/ReportHeader'
import { getAlertColor } from '../../utils/alert.utils'

interface AlertViewerProps {
  alert: Alert
}

export default function AlertViewer({ alert }: Readonly<AlertViewerProps>) {
  const { comment, context, type } = alert

  return (
    <>
      <ReportHeader
        report={alert}
        title='Adresse manquante'
        typeLabel='Alerte'
        typeColor={getAlertColor(type)}
        outcomeDetails={
          context?.createdAddress?.label && (
            <>
              <br />
              <b>Adresse créée :</b> {context.createdAddress.label}
            </>
          )
        }
      />

      {comment && <CallOut title='Commentaire'>{comment}</CallOut>}

      {context?.idRNB && (
        <p className='fr-text--sm'>
          Bâtiment RNB : <Tag small>{context.idRNB}</Tag>
        </p>
      )}
    </>
  )
}
