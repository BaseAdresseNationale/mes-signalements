import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useCustomSource } from '../hooks/useCustomSource'
import MapContext from '../contexts/map.context'
import {
  getSignalementColor,
  getSignalementCoodinates,
  getSignalementLabel,
  getSignalementTypeLabel,
} from '../utils/signalement.utils'
import { Marker } from '../composants/map/Marker'
import { Filters } from '../composants/common/Filters'
import { Signalement } from '../api/signalement'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  padding-top: 10px;
  .signalement-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    li {
      padding: 10px;
      border-bottom: 1px solid #ccc;

      &:hover {
        background-color: #f9f9f9;
        cursor: pointer;
      }

      p {
        margin: 2px 0;
      }
    }
  }
`

const StyledSignalementCard = styled.div`
  p {
    margin: 2px 0;
  }
`
const filterOptions = [
  {
    label: 'En cours',
    value: Signalement.status.PENDING,
  },
  {
    label: 'Acceptés',
    value: Signalement.status.PROCESSED,
  },
  {
    label: 'Refusés',
    value: Signalement.status.IGNORED,
  },
]

export function SourcePage() {
  const [currentFilter, setCurrentFilter] = useState<Signalement.status | null>(
    Signalement.status.PENDING,
  )
  const { setMapChildren } = useContext(MapContext)
  const { signalements: customSourceSignalements } = useCustomSource()
  const filteredSignalements = useMemo(
    () =>
      currentFilter
        ? customSourceSignalements.filter((signalement) => signalement.status === currentFilter)
        : customSourceSignalements,
    [customSourceSignalements, currentFilter],
  )

  const getSignalementCard = (signalement: Signalement) => {
    return (
      <StyledSignalementCard>
        <p className={`fr-badge fr-badge--${getSignalementColor(signalement.type)}`}>
          {getSignalementTypeLabel(signalement.type)}
        </p>
        <p>{getSignalementLabel(signalement)}</p>
        <p>Créé le {new Date(signalement._createdAt).toLocaleDateString()}</p>
        {signalement.processedBy && (
          <p>
            Traité le {new Date(signalement._updatedAt).toLocaleDateString()} par{' '}
            {signalement.processedBy.nom}
          </p>
        )}
      </StyledSignalementCard>
    )
  }

  // Map content
  const mapContent = useMemo(
    () => (
      <>
        {filteredSignalements.map((signalement) => {
          const coordinates = getSignalementCoodinates(signalement)
          return coordinates ? (
            <Marker
              key={signalement._id as string}
              coordinates={coordinates}
              color={`var(--background-action-high-${getSignalementColor(signalement.type)}`}
              popupContent={getSignalementCard(signalement)}
            />
          ) : null
        })}
      </>
    ),
    [filteredSignalements],
  )

  // Update map content
  useEffect(() => {
    setMapChildren(mapContent)
    return () => {
      setMapChildren(null)
    }
  }, [setMapChildren, mapContent])

  return (
    <StyledWrapper>
      <Filters
        value={currentFilter}
        onChange={(newValue) => setCurrentFilter(newValue as Signalement.status)}
        options={filterOptions}
      />
      <ul className='signalement-list'>
        {filteredSignalements.map((signalement, index) => (
          <li key={index}>{getSignalementCard(signalement)}</li>
        ))}
      </ul>
    </StyledWrapper>
  )
}
