import React from 'react'
import ReportCommentCard from '../report/ReportCommentCard'
import { Signalement } from '../../api/signalement'
import ReportHeader from '../report/ReportHeader'
import ReportLocationCard from '../report/ReportLocationCard'
import { BLUE } from '../report/ReportCard.styles'
import {
  getExistingReportLocation,
  getRequestedReportLocation,
  hasReportMapChanges,
  ReportRole,
} from '../../utils/report.utils'
import {
  getSignalementColor,
  getSignalementColorHex,
  getSignalementTypeLabel,
} from '../../utils/signalement.utils'

interface SignalementViewerProps {
  signalement: Signalement
  activeRole: ReportRole
  onActiveRoleChange: (role: ReportRole) => void
  preview?: boolean
}

export default function SignalementViewer({
  signalement,
  activeRole,
  onActiveRoleChange,
  preview = false,
}: Readonly<SignalementViewerProps>) {
  const { type, changesRequested } = signalement
  const existing = getExistingReportLocation(signalement)
  const requested = getRequestedReportLocation(signalement)
  const isUpdate = type === Signalement.type.LOCATION_TO_UPDATE
  const commune = signalement.nomCommune
    ? `${signalement.nomCommune} (${signalement.codeCommune})`
    : signalement.codeCommune
  const changedFields =
    isUpdate && existing && requested
      ? {
          title: existing.title !== requested.title,
          complement: (existing.complement ?? '') !== (requested.complement ?? ''),
        }
      : undefined
  const hasPositions = !!existing?.positions.length || !!requested?.positions.length
  const hasParcelles = !!existing?.parcelles.length || !!requested?.parcelles.length
  // Sans changement cartographique, la sélection d'un bloc n'a pas d'effet sur la carte.
  const isComparison = !!existing && !!requested && hasReportMapChanges(signalement)

  return (
    <>
      <ReportHeader
        report={signalement}
        typeLabel={getSignalementTypeLabel(type)}
        typeColor={getSignalementColor(type)}
        preview={preview}
      />

      {existing && (
        <ReportLocationCard
          role='existing'
          color={isUpdate ? BLUE : getSignalementColorHex(type)}
          heading={isUpdate ? 'Situation au dépôt' : 'Lieu à supprimer'}
          location={existing}
          commune={commune}
          selected={activeRole === 'existing'}
          onSelect={isComparison ? () => onActiveRoleChange('existing') : undefined}
        />
      )}
      {requested && (
        <ReportLocationCard
          role='requested'
          color={getSignalementColorHex(type)}
          heading={isUpdate ? 'Modification demandée' : 'Ajout demandé'}
          location={requested}
          commune={commune}
          changedFields={changedFields}
          selected={activeRole === 'requested'}
          onSelect={isComparison ? () => onActiveRoleChange('requested') : undefined}
        />
      )}

      {(hasPositions || hasParcelles) && (
        <p className='fr-hint-text fr-mb-2w'>
          {hasPositions &&
            (isComparison
              ? 'Positions : bleu = inchangée, turquoise = ajoutée, orange = supprimée, violet = type modifié. '
              : 'Les positions sont affichées sur la carte. ')}
          {hasParcelles &&
            (isComparison
              ? 'Parcelles : bleu = inchangée, turquoise = ajoutée, orange = supprimée. '
              : 'Les parcelles sont surlignées sur la carte. ')}
        </p>
      )}

      {changesRequested?.comment && <ReportCommentCard comment={changesRequested.comment} />}
    </>
  )
}
