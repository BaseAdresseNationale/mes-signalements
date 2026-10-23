import React from 'react'
import ReportCommentCard from '../report/ReportCommentCard'
import Tag from '@codegouvfr/react-dsfr/Tag'
import { Alert } from '../../api/signalement'
import ReportHeader from '../report/ReportHeader'
import { getAlertColor, getAlertTypeLabel } from '../../utils/alert.utils'

interface AlertViewerProps {
  alert: Alert
}

export default function AlertViewer({ alert }: Readonly<AlertViewerProps>) {
  const { comment, context, type } = alert

  return (
    <>
      <ReportHeader
        report={alert}
        typeLabel={getAlertTypeLabel(type)}
        typeColor={getAlertColor(type)}
        showCommune
        outcomeDetails={
          context?.createdAddress?.label && (
            <>
              <br />
              <b>Adresse créée :</b> {context.createdAddress.label}
            </>
          )
        }
      />

      {comment && <ReportCommentCard comment={comment} />}

      {context?.idRNB && (
        <p className='fr-text--sm'>
          Bâtiment RNB : <Tag small>{context.idRNB}</Tag>
        </p>
      )}
    </>
  )
}
