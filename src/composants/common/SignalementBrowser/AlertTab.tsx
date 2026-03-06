import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Alert, AlertsService, PaginatedAlertsDTO, SourcesService } from '../../../api/signalement'
import { useMapContent } from '../../../hooks/useMapContent'
import MapContext from '../../../contexts/map.context'
import Loader from '../Loader'
import Pagination from '../Pagination'
import Button from '@codegouvfr/react-dsfr/Button'
import { alertFilterStatusOptions, alertFilterTypesOptions, FiltersModal } from './FiltersModal'
import { SelectOptionType } from '../MuiSelectInput'
import { AlertBrowserFilter } from './types'
import AlertCard from '../../alert/AlertCard'
import AlertBrowserMap from '../../map/AlertBrowserMap'
import { StyledBrowserTabWrapper } from './BrowserTab.styles'

const PAGE_SIZE = 20

interface AlertTabProps {
  hideSourceFilter?: boolean
  initialFilter: AlertBrowserFilter
}

export function AlertTab({ hideSourceFilter, initialFilter }: AlertTabProps) {
  const [hoveredAlert, setHoveredAlert] = useState<Alert>()
  const [selectedAlert, setSelectedAlert] = useState<Alert>()
  const [isLoading, setIsLoading] = useState(false)
  const [paginatedAlerts, setPaginatedAlerts] = useState<PaginatedAlertsDTO>()
  const { setAdresseSearchMapLayersOptions, setSignalementSearchMapLayerOptions, mapRef } =
    useContext(MapContext)
  const [showFilters, setShowFilters] = useState(false)
  const [currentFilter, setCurrentFilter] = useState<AlertBrowserFilter>(initialFilter)
  const [currentPage, setCurrentPage] = useState(1)
  const [sourceOptions, setSourceOptions] = useState<SelectOptionType<string>[]>([])

  const fetchAlerts = useCallback(async (page: number, filters: AlertBrowserFilter) => {
    const { status, types, communes, sources } = filters
    const paginatedAlerts = await AlertsService.getAlerts(
      PAGE_SIZE,
      page,
      status.map((s) => s.value),
      types.map((t) => t.value),
      sources.map((s) => s.value),
      communes.map((c) => c.value),
    )
    setPaginatedAlerts(paginatedAlerts)
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
    setIsLoading(true)
    fetchAlerts(currentPage, currentFilter)
  }, [fetchAlerts, currentPage, currentFilter])

  const flyToAlert = useCallback(
    (alert: Alert) => {
      if (!mapRef) {
        return
      }

      if (alert.point) {
        mapRef.flyTo({
          center: alert.point.coordinates as [number, number],
          zoom: 18,
          maxDuration: 3000,
        })
      }
    },
    [mapRef],
  )

  const handleSelectAlert = useCallback(
    (alert: Alert) => {
      setSelectedAlert(alert)
      flyToAlert(alert)
    },
    [flyToAlert],
  )

  useEffect(() => {
    setAdresseSearchMapLayersOptions({
      adresse: { layout: { visibility: 'none' } },
      'adresse-label': { layout: { visibility: 'none' } },
      voie: { layout: { visibility: 'none' } },
      toponyme: { layout: { visibility: 'none' } },
    })
    setSignalementSearchMapLayerOptions({ layout: { visibility: 'none' } })
  }, [setAdresseSearchMapLayersOptions, setSignalementSearchMapLayerOptions])

  const mapContent = useMemo(() => {
    if (!paginatedAlerts) {
      return null
    }

    return (
      <AlertBrowserMap
        alerts={paginatedAlerts.data}
        hoveredAlert={hoveredAlert}
        selectedAlert={selectedAlert}
        setHoveredAlert={setHoveredAlert}
        onSelectAlert={handleSelectAlert}
      />
    )
  }, [paginatedAlerts, hoveredAlert, selectedAlert, handleSelectAlert])

  const hasCustomFilters = useMemo(
    () => JSON.stringify(currentFilter) !== JSON.stringify(initialFilter),
    [currentFilter],
  )

  const resetFilters = useCallback(() => {
    setCurrentFilter(initialFilter)
    setCurrentPage(1)
    setShowFilters(false)
  }, [])

  useMapContent(mapContent)

  return (
    <StyledBrowserTabWrapper>
      <div className='header'>
        <Button
          iconId={hasCustomFilters ? 'ri-filter-fill' : 'ri-filter-line'}
          onClick={() => setShowFilters(!showFilters)}
          priority='tertiary no outline'
        >
          {hasCustomFilters ? 'Modifier les filtres' : 'Filtrer les alertes'}
        </Button>
      </div>
      {isLoading && <Loader />}
      {!isLoading && paginatedAlerts && paginatedAlerts.data.length === 0 && (
        <p style={{ padding: 10 }}>Aucune alerte</p>
      )}
      {!isLoading && paginatedAlerts && paginatedAlerts.data.length > 0 && (
        <>
          <ul className='signalement-list'>
            {paginatedAlerts.data.map((alert, index) => (
              <li
                role='button'
                key={index}
                onMouseEnter={() => setHoveredAlert(alert)}
                onMouseLeave={() => setHoveredAlert(undefined)}
                onClick={() => handleSelectAlert(alert)}
              >
                <AlertCard alert={alert} />
              </li>
            ))}
          </ul>
          <Pagination
            count={Math.ceil(paginatedAlerts.total / PAGE_SIZE)}
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
          title='Filtrer les alertes'
          statusOptions={alertFilterStatusOptions}
          typeOptions={alertFilterTypesOptions}
          sourceHint='Sources de provenance des alertes'
          communeHint='Communes sur lesquelles les alertes ont été effectuées'
        />
      )}
    </StyledBrowserTabWrapper>
  )
}
