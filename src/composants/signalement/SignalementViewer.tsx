import React from 'react'
import ReportCommentCard from '../report/ReportCommentCard'
import { ExistingLocation, Signalement } from '../../api/signalement'
import ReportHeader from '../report/ReportHeader'
import ReportLocationCard from '../report/ReportLocationCard'
import {
  getExistingReportLocation,
  getRequestedReportLocation,
  ReportRole,
} from '../../utils/report.utils'
import { getSignalementColor, getSignalementTypeLabel } from '../../utils/signalement.utils'

interface SignalementViewerProps {
  signalement: Signalement
  activeRole: ReportRole
  onActiveRoleChange: (role: ReportRole) => void
}

export default function SignalementViewer({
  signalement,
  activeRole,
  onActiveRoleChange,
}: Readonly<SignalementViewerProps>) {
  const { type, changesRequested } = signalement
  const existing = getExistingReportLocation(signalement)
  const requested = getRequestedReportLocation(signalement)
  const isUpdate = type === Signalement.type.LOCATION_TO_UPDATE
  // Une voie n'a ni position ni parcelle : seule la modification demandée est affichée.
  const isVoieUpdate = isUpdate && signalement.existingLocation?.type === ExistingLocation.type.VOIE
  const shownExisting = isVoieUpdate ? null : existing
  const hasPositions = !!shownExisting?.positions.length || !!requested?.positions.length
  const hasParcelles = !!shownExisting?.parcelles.length || !!requested?.parcelles.length
  const isComparison = !!shownExisting && !!requested

  return (
    <>
      <ReportHeader
        report={signalement}
        title={(existing ?? requested)?.title ?? 'Demande de signalement'}
        typeLabel={getSignalementTypeLabel(type)}
        typeColor={getSignalementColor(type)}
      />

      {shownExisting && (
        <ReportLocationCard
          role='existing'
          heading={isUpdate ? 'Situation actuelle' : 'Lieu à supprimer'}
          location={shownExisting}
          selected={activeRole === 'existing'}
          onSelect={isComparison ? () => onActiveRoleChange('existing') : undefined}
        />
      )}
      {requested && (
        <ReportLocationCard
          role='requested'
          heading={isUpdate ? 'Modification demandée' : 'Ajout demandé'}
          location={requested}
          selected={activeRole === 'requested'}
          onSelect={isComparison ? () => onActiveRoleChange('requested') : undefined}
        />
      )}

      {(hasPositions || hasParcelles) && (
        <p className='fr-hint-text fr-mb-2w'>
          {hasPositions &&
            (isComparison
              ? 'Positions : bleu = inchangée, vert = ajoutée ou nouvel emplacement, rouge = supprimée ou ancien emplacement. '
              : 'Les positions sont affichées sur la carte. ')}
          {hasParcelles &&
            (isComparison
              ? 'Parcelles : bleu = inchangée, vert = ajoutée, rouge = supprimée. '
              : 'Les parcelles sont surlignées sur la carte. ')}
        </p>
      )}

      {changesRequested?.comment && <ReportCommentCard comment={changesRequested.comment} />}
    </>
  )
}
