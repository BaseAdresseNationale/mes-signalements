import React, { useContext } from 'react'
import Tag from '@codegouvfr/react-dsfr/Tag'
import { Position } from '../../api/signalement'
import MapContext from '../../contexts/map.context'
import { getPositionTypeLabel } from '../../utils/signalement.utils'
import { ReportLocation, ReportPositionChange, ReportRole } from '../../utils/report.utils'
import { StyledCard } from './ReportCard.styles'

const CHANGE_META: Record<ReportPositionChange, { icon?: string; label: string }> = {
  unchanged: { label: 'Position inchangée' },
  added: { icon: 'fr-icon-add-line', label: 'Position ajoutée' },
  removed: { icon: 'fr-icon-subtract-line', label: 'Position supprimée' },
  retyped: { icon: 'fr-icon-edit-line', label: 'Type de position modifié' },
}

interface ReportLocationCardProps {
  heading: string
  role: ReportRole
  // Couleur du type de signalement (même code que les badges et les cônes de la carte).
  color: string
  location: ReportLocation
  commune?: string
  selected?: boolean
  onSelect?: () => void
  // Champs texte modifiés par rapport à l'existant : ils sont mis en gras.
  changedFields?: { title: boolean; complement: boolean }
}

export default function ReportLocationCard({
  heading,
  role,
  color,
  location,
  commune,
  selected = false,
  onSelect,
  changedFields,
}: Readonly<ReportLocationCardProps>) {
  const { mapRef } = useContext(MapContext)
  const { title, complement, positions, parcelles } = location

  return (
    <StyledCard
      $color={color}
      $selectable={!!onSelect}
      $selected={!!onSelect && selected}
      $compare={!!changedFields}
      onClick={onSelect}
    >
      {onSelect ? (
        <button type='button' className='heading fr-text--xs' aria-pressed={selected}>
          {heading}
        </button>
      ) : (
        <p className='heading fr-text--xs'>{heading}</p>
      )}
      <p className={`title${changedFields?.title ? ' is-changed' : ''}`}>{title}</p>
      {complement && (
        <p className={`subtitle fr-text--sm${changedFields?.complement ? ' is-changed' : ''}`}>
          {complement}
        </p>
      )}
      {commune && <p className='commune fr-text--sm'>{commune}</p>}

      {positions.length > 0 && (
        <ul className='positions'>
          {positions.map(({ type, coordinates, change }) => (
            <li key={`${type}-${coordinates.join(',')}`}>
              <button
                type='button'
                title='Centrer la carte sur cette position'
                onClick={() => mapRef?.flyTo({ center: coordinates, zoom: 20, maxDuration: 1500 })}
              >
                <span
                  className='indicator'
                  data-change={change}
                  data-role={role}
                  title={CHANGE_META[change].label}
                >
                  {CHANGE_META[change].icon ? (
                    <span
                      className={`${CHANGE_META[change].icon} fr-icon--sm`}
                      aria-hidden='true'
                    />
                  ) : (
                    <span className='dot' aria-hidden='true' />
                  )}
                </span>
                <span className='position-label fr-text--sm' style={{ margin: 0 }}>
                  <span className='fr-sr-only'>{CHANGE_META[change].label} : </span>
                  Position : {getPositionTypeLabel(type as Position.type)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {parcelles.length > 0 && (
        <>
          <p className='section-label fr-text--xs'>Parcelles</p>
          <ul className='fr-tags-group'>
            {parcelles.map((parcelle) => (
              <li key={parcelle}>
                <Tag small>{parcelle}</Tag>
              </li>
            ))}
          </ul>
        </>
      )}
    </StyledCard>
  )
}
