import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  getSignalementColor,
  getSignalementColorHex,
  getSignalementCoodinates,
  getSignalementLabel,
  getSignalementTypeLabel,
} from '../utils/signalement.utils'
import { Filters } from '../composants/common/Filters'
import { PaginatedSignalementsDTO, Signalement, SignalementsService } from '../api/signalement'
import styled from 'styled-components'
import { useMapContent } from '../hooks/useMapContent'
import SourceContext from '../contexts/source.context'
import MapContext from '../contexts/map.context'
import { Pagination } from '@codegouvfr/react-dsfr/Pagination'
import Loader from '../composants/common/Loader'
import type { FeatureCollection } from 'geojson'
import { ClusterMap } from '../composants/map/ClusterMap'
import { ClusteredMarker } from '../composants/map/ClusteredMarker'
import Badge from '@codegouvfr/react-dsfr/Badge'

const StyledPagination = styled(Pagination)`
  padding: 5px;

  .fr-pagination__list {
    justify-content: center;
    align-items: center;

    .fr-pagination__link--prev,
    .fr-pagination__link--next {
      display: none;
    }
    button {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
`

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  .header {
    box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 16%);
    padding: 5px 0;
  }

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
        background-color: #f9f9f980;
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

const PAGE_SIZE = 20

export function SourcePage() {
  const { source } = useContext(SourceContext)
  const [hoveredSignalement, setHoveredSignalement] = useState<Signalement>()
  const [isLoading, setIsLoading] = useState(false)
  const [paginatedSignalements, setPaginatedSignalements] = useState<PaginatedSignalementsDTO>()
  const { setAdresseSearchMapLayersOptions, mapRef } = useContext(MapContext)
  const [currentFilter, setCurrentFilter] = useState(Signalement.status.PENDING)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchSignalements = useCallback(
    async (page: number, filter: Signalement.status, sourceId: string) => {
      try {
        const paginatedSignalements = await SignalementsService.getSignalements(
          PAGE_SIZE,
          page,
          [filter],
          undefined,
          [sourceId],
        )
        setPaginatedSignalements(paginatedSignalements)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (source) {
      fetchSignalements(currentPage, currentFilter, source.id)
    }
  }, [source, fetchSignalements, currentPage, currentFilter])

  const flyToSignalement = useCallback(
    (signalement: Signalement) => {
      if (!mapRef) {
        return
      }

      mapRef.flyTo({
        center: getSignalementCoodinates(signalement) as [number, number],
        zoom: 18,
        maxDuration: 3000,
      })
    },
    [mapRef],
  )

  const getSignalementCard = (signalement: Signalement) => {
    return (
      <StyledSignalementCard>
        <Badge
          severity={
            signalement.status === Signalement.status.PROCESSED
              ? 'success'
              : signalement.status === Signalement.status.IGNORED
                ? 'error'
                : undefined
          }
          className={`fr-badge--${getSignalementColor(signalement.type)}`}
        >
          {getSignalementTypeLabel(signalement.type)}
        </Badge>
        <p>{getSignalementLabel(signalement)}</p>
        <p>Créé le {new Date(signalement.createdAt).toLocaleDateString()}</p>
        {signalement.processedBy && (
          <p>
            {signalement.status === Signalement.status.PROCESSED ? 'Accepté' : 'Refusé'} le{' '}
            {new Date(signalement.updatedAt).toLocaleDateString()} via {signalement.processedBy.nom}
          </p>
        )}
      </StyledSignalementCard>
    )
  }

  // Hide map search layers
  useEffect(() => {
    setAdresseSearchMapLayersOptions({
      adresse: { layout: { visibility: 'none' } },
      'adresse-label': { layout: { visibility: 'none' } },
      voie: { layout: { visibility: 'none' } },
      toponyme: { layout: { visibility: 'none' } },
    })
  }, [setAdresseSearchMapLayersOptions])

  // Map content
  const mapContent = useMemo(() => {
    if (!paginatedSignalements) {
      return null
    }

    const signalementWithCoordinates = paginatedSignalements.data.filter((signalement) => {
      const coords = getSignalementCoodinates(signalement)
      return coords?.every((coord) => coord !== null)
    })

    const clustersData: FeatureCollection = {
      type: 'FeatureCollection',
      features: signalementWithCoordinates.map((signalement) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: getSignalementCoodinates(signalement) as [number, number],
        },
        properties: { id: signalement.id },
      })),
    }

    return (
      <>
        <ClusterMap data={clustersData} />
        {signalementWithCoordinates.map((signalement: Signalement) => {
          return (
            <ClusteredMarker
              key={signalement.id}
              id={signalement.id}
              color={getSignalementColorHex(signalement.type)}
              coordinates={getSignalementCoodinates(signalement) as [number, number]}
              popupContent={getSignalementCard(signalement)}
              showPopup={hoveredSignalement?.id === signalement.id}
              onClick={() => flyToSignalement(signalement)}
            />
          )
        })}
      </>
    )
  }, [paginatedSignalements, hoveredSignalement])

  useMapContent(mapContent)

  return (
    <StyledWrapper>
      <div className='header'>
        <Filters
          value={currentFilter}
          onChange={(newValue) => {
            setCurrentFilter(newValue as Signalement.status)
            setCurrentPage(1)
          }}
          options={filterOptions}
        />
      </div>
      {isLoading ? (
        <Loader />
      ) : paginatedSignalements ? (
        <>
          <ul className='signalement-list'>
            {paginatedSignalements.data.map((signalement, index) => (
              <li
                role='button'
                key={index}
                onMouseEnter={() => setHoveredSignalement(signalement)}
                onMouseLeave={() => setHoveredSignalement(undefined)}
                onClick={() => flyToSignalement(signalement)}
              >
                {getSignalementCard(signalement)}
              </li>
            ))}
          </ul>
          <StyledPagination
            count={Math.ceil(paginatedSignalements.total / PAGE_SIZE)}
            defaultPage={currentPage}
            getPageLinkProps={(pageNumber) => ({
              onClick: () => {
                setCurrentPage(pageNumber)
              },
              href: '#',
            })}
            showFirstLast={false}
          />
        </>
      ) : (
        <p>Une erreur est survenue</p>
      )}
    </StyledWrapper>
  )
}
