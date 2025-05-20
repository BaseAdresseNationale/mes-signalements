import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  PaginatedSignalementsDTO,
  Signalement,
  SignalementsService,
  SourcesService,
} from '../../../api/signalement'
import styled from 'styled-components'
import { useMapContent } from '../../../hooks/useMapContent'
import MapContext from '../../../contexts/map.context'
import Loader from '../Loader'
import SignalementCard from '../../signalement/SignalementCard'
import Pagination from '../Pagination'
import { SignalementViewerContext } from '../../../contexts/signalement-viewer.context'
import SignalementBrowserMap from '../../map/SignalementBrowserMap'
import Button from '@codegouvfr/react-dsfr/Button'
import { FiltersModal } from './FiltersModal'
import { SelectOptionType } from '../MultiSelectInput'

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  .header {
    display: flex;
    justify-content: center;
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

const PAGE_SIZE = 20

const defaultFilters: SignalementBrowserFilter = {
  status: [],
  types: [],
  communes: [],
  sources: [],
}

export type SignalementBrowserFilter = {
  types: Signalement.type[]
  status: Signalement.status[]
  communes: string[]
  sources: string[]
}

interface SignalementBrowserProps {
  hideSourceFilter?: boolean
  initialFilter?: SignalementBrowserFilter
}

export function SignalementBrowser({
  initialFilter: _initialFilters,
  hideSourceFilter,
}: SignalementBrowserProps) {
  const { setViewedSignalement } = useContext(SignalementViewerContext)
  const [hoveredSignalement, setHoveredSignalement] = useState<Signalement>()
  const [isLoading, setIsLoading] = useState(false)
  const [paginatedSignalements, setPaginatedSignalements] = useState<PaginatedSignalementsDTO>()
  const { setAdresseSearchMapLayersOptions, setSignalementSearchMapLayerOptions, mapRef } =
    useContext(MapContext)
  const [showFilters, setShowFilters] = useState(false)
  const initialFilters = _initialFilters || defaultFilters
  const [currentFilter, setCurrentFilter] = useState<SignalementBrowserFilter>(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [sourceOptions, setSourceOptions] = useState<SelectOptionType<string>[]>([])

  const fetchSignalements = useCallback(async (page: number, filters: SignalementBrowserFilter) => {
    const { status, types, communes, sources } = filters
    const paginatedSignalements = await SignalementsService.getSignalements(
      PAGE_SIZE,
      page,
      status,
      types,
      sources,
      communes,
    )
    setPaginatedSignalements(paginatedSignalements)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const fetchSources = async () => {
      setIsLoading(true)
      try {
        const allSources = await SourcesService.getSources()
        const sources = allSources.map((source) => ({
          label: source.nom,
          value: source.id,
        }))
        setSourceOptions(sources)
      } catch (error) {
        console.error('Error fetching sources:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!hideSourceFilter) {
      fetchSources()
    }
  }, [hideSourceFilter])

  useEffect(() => {
    fetchSignalements(currentPage, currentFilter)
  }, [fetchSignalements, currentPage, currentFilter])

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
      <SignalementBrowserMap
        signalements={paginatedSignalements.data}
        hoveredSignalement={hoveredSignalement}
        setHoveredSignalement={setHoveredSignalement}
        onSelectSignalement={handleSelectSignalement}
      />
    )
  }, [paginatedSignalements, hoveredSignalement, handleSelectSignalement])

  const hasCustomFilters = useMemo(
    () => JSON.stringify(currentFilter) !== JSON.stringify(initialFilters),
    [currentFilter],
  )

  const resetFilters = useCallback(() => {
    setCurrentFilter(initialFilters)
    setCurrentPage(1)
    setShowFilters(false)
  }, [])

  useMapContent(mapContent)

  return (
    <StyledWrapper>
      <div className='header'>
        <Button
          iconId={hasCustomFilters ? 'ri-filter-fill' : 'ri-filter-line'}
          onClick={() => setShowFilters(!showFilters)}
          priority='tertiary no outline'
        >
          {hasCustomFilters ? 'Modifier les filtres' : 'Filtrer les signalements'}
        </Button>
      </div>
      {isLoading && <Loader />}
      {!isLoading && paginatedSignalements && paginatedSignalements.data.length === 0 && (
        <p style={{ padding: 10 }}>Aucun signalement</p>
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
          <Pagination
            count={Math.ceil(paginatedSignalements.total / PAGE_SIZE)}
            currentPage={currentPage}
            onPageChange={(page) => {
              setCurrentPage(page)
            }}
          />
        </>
      )}
      {showFilters && (
        <FiltersModal
          filters={currentFilter}
          onClose={() => setShowFilters(false)}
          onSubmit={(newFilters) => {
            setCurrentFilter(newFilters)
            setCurrentPage(1)
          }}
          {...(hasCustomFilters ? { onReset: resetFilters } : {})}
          sourceOptions={sourceOptions}
        />
      )}
    </StyledWrapper>
  )
}
