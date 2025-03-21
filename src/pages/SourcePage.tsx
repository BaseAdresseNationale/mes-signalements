import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Filters } from '../composants/common/Filters'
import { PaginatedSignalementsDTO, Signalement, SignalementsService } from '../api/signalement'
import styled from 'styled-components'
import { useMapContent } from '../hooks/useMapContent'
import SourceContext from '../contexts/source.context'
import MapContext from '../contexts/map.context'
import { Pagination } from '@codegouvfr/react-dsfr/Pagination'
import Loader from '../composants/common/Loader'
import SignalementCard from '../composants/signalement/SignalementCard'
import SourceMap from '../composants/map/SourceMap'
import { SignalementViewerContext } from '../contexts/signalement-viewer.context'

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
  const { setViewedSignalement } = useContext(SignalementViewerContext)
  const [hoveredSignalement, setHoveredSignalement] = useState<Signalement>()
  const [isLoading, setIsLoading] = useState(false)
  const [paginatedSignalements, setPaginatedSignalements] = useState<PaginatedSignalementsDTO>()
  const { setAdresseSearchMapLayersOptions, setSignalementSearchMapLayerOptions, mapRef } =
    useContext(MapContext)
  const [currentFilter, setCurrentFilter] = useState(Signalement.status.PENDING)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchSignalements = useCallback(
    async (page: number, filter: Signalement.status, sourceId: string) => {
      const paginatedSignalements = await SignalementsService.getSignalements(
        PAGE_SIZE,
        page,
        [filter],
        undefined,
        [sourceId],
      )
      setPaginatedSignalements(paginatedSignalements)
      setIsLoading(false)
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

      if (signalement.point) {
        mapRef.flyTo({
          center: signalement.point.coordinates as [number, number],
          zoom: 18,
          maxDuration: 3000,
        })
      }
    },
    [mapRef],
  )

  const handleSelectSignalement = useCallback(
    (signalement: Signalement) => {
      setViewedSignalement(signalement)
      flyToSignalement(signalement)
    },
    [flyToSignalement, setViewedSignalement],
  )

  // Hide map search layers
  useEffect(() => {
    setAdresseSearchMapLayersOptions({
      adresse: { layout: { visibility: 'none' } },
      'adresse-label': { layout: { visibility: 'none' } },
      voie: { layout: { visibility: 'none' } },
      toponyme: { layout: { visibility: 'none' } },
    })
    setSignalementSearchMapLayerOptions({ layout: { visibility: 'none' } })
  }, [setAdresseSearchMapLayersOptions, setSignalementSearchMapLayerOptions])

  // Map content
  const mapContent = useMemo(() => {
    if (!paginatedSignalements) {
      return null
    }

    return (
      <SourceMap
        signalements={paginatedSignalements.data}
        hoveredSignalement={hoveredSignalement}
        setHoveredSignalement={setHoveredSignalement}
        onSelectSignalement={handleSelectSignalement}
      />
    )
  }, [paginatedSignalements, hoveredSignalement, handleSelectSignalement])

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
      {isLoading && <Loader />}
      {!isLoading && paginatedSignalements && paginatedSignalements.data.length === 0 && (
        <p>Aucun signalement</p>
      )}
      {!isLoading && paginatedSignalements && paginatedSignalements.data.length > 0 && (
        <>
          <ul className='signalement-list'>
            {paginatedSignalements.data.map((signalement, index) => (
              <li
                role='button'
                key={index}
                onMouseEnter={() => setHoveredSignalement(signalement)}
                onMouseLeave={() => setHoveredSignalement(undefined)}
                onClick={() => handleSelectSignalement(signalement)}
              >
                <SignalementCard signalement={signalement} />
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
      )}
    </StyledWrapper>
  )
}
