import React from 'react'
import CallOut from '@codegouvfr/react-dsfr/CallOut'
import { Signalement } from '../../api/signalement'
import ReportHeader from '../report/ReportHeader'
import ReportLocationCard from '../report/ReportLocationCard'
import { getExistingReportLocation, getRequestedReportLocation } from '../../utils/report.utils'
import { getSignalementColor, getSignalementTypeLabel } from '../../utils/signalement.utils'

interface SignalementViewerProps {
  signalement: Signalement
}

export default function SignalementViewer({ signalement }: Readonly<SignalementViewerProps>) {
  const { type, changesRequested } = signalement
  const existing = getExistingReportLocation(signalement)
  const requested = getRequestedReportLocation(signalement)
  const isUpdate = type === Signalement.type.LOCATION_TO_UPDATE
  const hasPositions = !!existing?.positions.length || !!requested?.positions.length

  return (
    <>
      <ReportHeader
        report={signalement}
        title={(existing ?? requested)?.title ?? 'Demande de signalement'}
        typeLabel={getSignalementTypeLabel(type)}
        typeColor={getSignalementColor(type)}
      />

      {existing && (
        <ReportLocationCard
          role='existing'
          heading={isUpdate ? 'Situation actuelle' : 'Lieu à supprimer'}
          location={existing}
        />
      )}
      {requested && (
        <ReportLocationCard
          role='requested'
          heading={isUpdate ? 'Modification demandée' : 'Ajout demandé'}
          location={requested}
        />
      )}

      {hasPositions && (
        <p className='fr-hint-text fr-mb-2w'>
          {existing && requested
            ? 'Sur la carte : en rouge la situation actuelle, en vert la modification demandée.'
            : 'Les positions sont affichées sur la carte.'}
        </p>
      )}

      {changesRequested?.comment && (
        <CallOut title='Commentaire'>{changesRequested.comment}</CallOut>
      )}
    </>
  )
}
