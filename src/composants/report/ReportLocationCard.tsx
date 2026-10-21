import React, { useContext } from 'react'
import styled from 'styled-components'
import Tag from '@codegouvfr/react-dsfr/Tag'
import { Position } from '../../api/signalement'
import MapContext from '../../contexts/map.context'
import { getPositionTypeLabel } from '../../utils/signalement.utils'
import { ReportLocation, ReportMapPosition } from '../../utils/report.utils'

const ROLE_COLORS: Record<ReportMapPosition['role'], string> = {
  existing: 'var(--background-flat-error)',
  requested: 'var(--background-flat-success)',
}

const StyledCard = styled.section<{ $color: string }>`
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--background-alt-grey);
  border-left: 4px solid ${({ $color }) => $color};

  .heading {
    margin-bottom: 0.5rem;
    font-weight: 700;
    text-transform: uppercase;
    color: ${({ $color }) => $color};
  }

  .title {
    margin-bottom: 0.25rem;
    font-weight: 700;
  }

  .subtitle {
    margin-bottom: 0.25rem;
  }

  .section-label {
    margin: 0.75rem 0 0.25rem;
    color: var(--text-mention-grey);
  }

  .positions {
    margin: 0.5rem 0 0;
    padding: 0;
    list-style: none;

    li {
      padding: 0;
      margin: 0 0 0.25rem;

      &::before {
        content: none;
      }
    }

    button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0;
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      text-align: left;

      &:hover .position-label {
        text-decoration: underline;
      }
    }

    .dot {
      flex: none;
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      background: ${({ $color }) => $color};
    }
  }

  .fr-tags-group {
    margin: 0;
  }
`

interface ReportLocationCardProps {
  heading: string
  role: ReportMapPosition['role']
  location: ReportLocation
}

export default function ReportLocationCard({
  heading,
  role,
  location,
}: Readonly<ReportLocationCardProps>) {
  const { mapRef } = useContext(MapContext)
  const { title, complement, positions, parcelles } = location

  return (
    <StyledCard $color={ROLE_COLORS[role]}>
      <p className='heading fr-text--xs'>{heading}</p>
      <p className='title'>{title}</p>
      {complement && <p className='subtitle fr-text--sm'>{complement}</p>}

      {positions.length > 0 && (
        <ul className='positions'>
          {positions.map(({ type, coordinates }) => (
            <li key={`${type}-${coordinates.join(',')}`}>
              <button
                type='button'
                title='Centrer la carte sur cette position'
                onClick={() => mapRef?.flyTo({ center: coordinates, zoom: 20, maxDuration: 1500 })}
              >
                <span className='dot' aria-hidden='true' />
                <span className='position-label fr-text--sm'>
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
