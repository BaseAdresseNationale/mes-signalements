import React, { useContext, useMemo, useState } from 'react'
import { useCustomSource } from '../hooks/useCustomSource'
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
import { useMapContent } from '../hooks/useMapContent'
import MapContext from '../contexts/map.context'
import SourceContext from '../contexts/source.context'

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 10px;
  .signalement-list {
    overflow-y: scroll;
    flex: 1;
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
  const { markerColor } = useContext(MapContext)
  const { source } = useContext(SourceContext)
  const [currentFilter, setCurrentFilter] = useState<Signalement.status | null>(
    Signalement.status.PENDING,
  )
  const { signalements: customSourceSignalements } = useCustomSource(source)
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
        <p>Créé le {new Date(signalement.createdAt).toLocaleDateString()}</p>
        {signalement.processedBy && (
          <p>
            Traité le {new Date(signalement.updatedAt).toLocaleDateString()} par{' '}
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
              key={signalement.id as string}
              coordinates={coordinates}
              color={markerColor}
              popupContent={getSignalementCard(signalement)}
            />
          ) : null
        })}
      </>
    ),
    [filteredSignalements, markerColor],
  )

  useMapContent(mapContent)

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
