import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Tabs } from '@codegouvfr/react-dsfr/Tabs'
import styled from 'styled-components'
import {
  Alert,
  AlertsService,
  PaginatedAlertsDTO,
  PaginatedSignalementsDTO,
  Signalement,
  SignalementsService,
  SourcesService,
} from '../../../api/signalement'
import MapContext from '../../../contexts/map.context'
import { useOpenReport } from '../../../hooks/useOpenReport'
import { useMapContent } from '../../../hooks/useMapContent'
import { useBrowserData } from '../../../hooks/useBrowserData'
import { SelectOptionType } from '../MuiSelectInput'
import SignalementCard from '../../signalement/SignalementCard'
import AlertCard from '../../alert/AlertCard'
import SignalementBrowserMap from '../../map/SignalementBrowserMap'
import AlertBrowserMap from '../../map/AlertBrowserMap'
import { BrowserTab } from './BrowserTab'
import {
  alertFilterStatusOptions,
  alertFilterTypesOptions,
  signalementFilterStatusOptions,
  signalementFilterTypesOptions,
} from './FiltersModal'
import { BrowserFilter, BrowserTabId } from './types'
import { updateHashSearchParams } from '../../../utils/signalement-browser.utils'

interface SignalementBrowserProps {
  initialFilters: BrowserFilter
  initialTab?: BrowserTabId
  initialPage?: number
  fromSource?: { value: string; label: string }
}

const StyledTabs = styled(Tabs)`
  height: 100%;
  .fr-tabs__panel {
    height: 100%;
    padding: 0;
  }
`

const PAGE_SIZE = 20

const SIGNALEMENTS_TAB_ID: BrowserTabId = 'signalements'
const ALERTS_TAB_ID: BrowserTabId = 'alerts'

export function SignalementBrowser({
  fromSource,
  initialFilters,
  initialTab = SIGNALEMENTS_TAB_ID,
  initialPage = 1,
}: SignalementBrowserProps) {
  const hideSourceFilter = !!fromSource
  const openReport = useOpenReport()
  const { setAdresseSearchMapLayersOptions, setSignalementSearchMapLayerOptions } =
    useContext(MapContext)

  const [activeTabId, setActiveTabId] = useState<string>(initialTab)
  const [hoveredSignalement, setHoveredSignalement] = useState<Signalement>()
  const [hoveredAlert, setHoveredAlert] = useState<Alert>()
  const [sourceOptions, setSourceOptions] = useState<SelectOptionType<string>[]>([])

  // Shared: fetch source options
  useEffect(() => {
    if (hideSourceFilter) {
      return
    }
    const fetchSources = async () => {
      try {
        const allSources = await SourcesService.getSources()
        setSourceOptions(
          allSources.map((source) => ({
            label: source.nom,
            value: source.id,
          })),
        )
      } catch (error) {
        console.error('Error fetching sources:', error)
      }
    }
    fetchSources()
  }, [hideSourceFilter])

  // Shared: hide map search layers
  useEffect(() => {
    setAdresseSearchMapLayersOptions({
      adresse: { layout: { visibility: 'none' } },
      'adresse-label': { layout: { visibility: 'none' } },
      voie: { layout: { visibility: 'none' } },
      toponyme: { layout: { visibility: 'none' } },
    })
    setSignalementSearchMapLayerOptions({ layout: { visibility: 'none' } })
  }, [setAdresseSearchMapLayersOptions, setSignalementSearchMapLayerOptions])

  // Data fetching per tab
  const fetchSignalements = useCallback(
    async (page: number, filter: BrowserFilter): Promise<PaginatedSignalementsDTO> => {
      const { status, signalementTypes: types, communes, departements, sources } = filter
      return SignalementsService.getSignalements(
        PAGE_SIZE,
        page,
        status.map((s) => s.value),
        types.map((t) => t.value),
        sources.map((s) => s.value),
        departements.map((d) => d.value),
        communes.map((c) => c.value),
      )
    },
    [],
  )

  const fetchAlerts = useCallback(
    async (page: number, filter: BrowserFilter): Promise<PaginatedAlertsDTO> => {
      const { status, alertTypes: types, communes, departements, sources } = filter
      return AlertsService.getAlerts(
        PAGE_SIZE,
        page,
        status.map((s) => s.value),
        types.map((t) => t.value),
        sources.map((s) => s.value),
        departements.map((d) => d.value),
        communes.map((c) => c.value),
      )
    },
    [],
  )

  const { signalementsBrowser, alertsBrowser, filter, setFilter, resetFilter } = useBrowserData(
    { fetchSignalements, fetchAlerts },
    initialFilters,
    {
      signalements: initialTab === SIGNALEMENTS_TAB_ID ? initialPage : 1,
      alerts: initialTab === ALERTS_TAB_ID ? initialPage : 1,
    },
  )

  const activePage = activeTabId === ALERTS_TAB_ID ? alertsBrowser.page : signalementsBrowser.page

  // Keep tab and page in the URL so that closing a report brings back to the same view.
  useEffect(() => {
    updateHashSearchParams({
      tab: activeTabId === ALERTS_TAB_ID ? ALERTS_TAB_ID : null,
      page: activePage > 1 ? String(activePage) : null,
    })
  }, [activeTabId, activePage])

  const handleSelectSignalement = useCallback(
    (signalement: Signalement) => openReport(signalement, { backOnClose: true }),
    [openReport],
  )

  const handleSelectAlert = useCallback(
    (alert: Alert) => openReport(alert, { backOnClose: true }),
    [openReport],
  )

  // Map content per active tab
  const signalementsMapContent = useMemo(() => {
    if (!signalementsBrowser.paginatedData) {
      return null
    }
    return (
      <SignalementBrowserMap
        signalements={signalementsBrowser.paginatedData.data}
        hoveredSignalement={hoveredSignalement}
        setHoveredSignalement={setHoveredSignalement}
        onSelectSignalement={handleSelectSignalement}
      />
    )
  }, [signalementsBrowser.paginatedData, hoveredSignalement, handleSelectSignalement])

  const alertsMapContent = useMemo(() => {
    if (!alertsBrowser.paginatedData) {
      return null
    }
    return (
      <AlertBrowserMap
        alerts={alertsBrowser.paginatedData.data}
        hoveredAlert={hoveredAlert}
        setHoveredAlert={setHoveredAlert}
        onSelectAlert={handleSelectAlert}
      />
    )
  }, [alertsBrowser.paginatedData, hoveredAlert, handleSelectAlert])

  const mapContent = useMemo(
    () => (activeTabId === ALERTS_TAB_ID ? alertsMapContent : signalementsMapContent),
    [activeTabId, alertsMapContent, signalementsMapContent],
  )

  useMapContent(mapContent)

  const getAvailableFiltersWithSource = useCallback(
    (filters: string[]) => {
      if (hideSourceFilter) {
        return filters
      }
      return [...filters, 'sources']
    },
    [hideSourceFilter, sourceOptions],
  )

  return (
    <StyledTabs
      selectedTabId={activeTabId}
      onTabChange={setActiveTabId}
      tabs={[
        { tabId: SIGNALEMENTS_TAB_ID, label: 'Signalements' },
        { tabId: ALERTS_TAB_ID, label: 'Alertes' },
      ]}
    >
      {activeTabId === SIGNALEMENTS_TAB_ID && (
        <BrowserTab
          isLoading={signalementsBrowser.isLoading}
          paginatedData={signalementsBrowser.paginatedData}
          pageSize={PAGE_SIZE}
          page={signalementsBrowser.page}
          onPageChange={signalementsBrowser.setPage}
          filter={filter}
          onFilterChange={setFilter}
          onResetFilter={resetFilter}
          renderItem={(signalement) => <SignalementCard signalement={signalement} />}
          getItemKey={(signalement, index) => signalement.id ?? index}
          onItemHover={setHoveredSignalement}
          onItemSelect={handleSelectSignalement}
          emptyMessage='Aucun signalement'
          filtersConfig={{
            title: 'Filtrer les signalements',
            statusOptions: signalementFilterStatusOptions,
            typeOptions: signalementFilterTypesOptions,
            sourceOptions: sourceOptions,
            sourceHint: 'Sources de provenance des signalements',
            communeHint:
              'Départements ou communes sur lesquelles les signalements ont été effectués',
            typeKey: 'signalementTypes',
            availableFilters: getAvailableFiltersWithSource([
              'status',
              'signalementTypes',
              'communes',
              'departements',
            ]),
            buttonLabel: 'Filtrer les signalements',
            buttonLabelActive: 'Modifier les filtres',
          }}
        />
      )}
      {activeTabId === ALERTS_TAB_ID && (
        <BrowserTab
          isLoading={alertsBrowser.isLoading}
          paginatedData={alertsBrowser.paginatedData}
          pageSize={PAGE_SIZE}
          page={alertsBrowser.page}
          onPageChange={alertsBrowser.setPage}
          filter={filter}
          onFilterChange={setFilter}
          onResetFilter={resetFilter}
          renderItem={(alert) => <AlertCard alert={alert} />}
          getItemKey={(alert, index) => alert.id ?? index}
          onItemHover={setHoveredAlert}
          onItemSelect={handleSelectAlert}
          emptyMessage='Aucune alerte'
          filtersConfig={{
            title: 'Filtrer les alertes',
            statusOptions: alertFilterStatusOptions,
            typeOptions: alertFilterTypesOptions,
            sourceOptions: sourceOptions,
            sourceHint: 'Sources de provenance des alertes',
            communeHint: 'Départements ou communes sur lesquelles les alertes ont été effectuées',
            availableFilters: getAvailableFiltersWithSource([
              'status',
              'alertTypes',
              'communes',
              'departements',
            ]),
            typeKey: 'alertTypes',
            buttonLabel: 'Filtrer les alertes',
            buttonLabelActive: 'Modifier les filtres',
          }}
        />
      )}
    </StyledTabs>
  )
}
