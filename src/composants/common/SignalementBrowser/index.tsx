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
import { SignalementViewerContext } from '../../../contexts/signalement-viewer.context'
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
import { AlertBrowserFilter, SignalementBrowserFilter } from './types'

interface SignalementBrowserProps {
  signalementsInitialFilter: SignalementBrowserFilter
  alertsInitialFilter: AlertBrowserFilter
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

const SIGNALEMENTS_TAB_ID = 'signalements'
const ALERTS_TAB_ID = 'alerts'

export function SignalementBrowser({
  fromSource,
  signalementsInitialFilter,
  alertsInitialFilter,
}: SignalementBrowserProps) {
  const hideSourceFilter = !!fromSource
  const { setViewedSignalement } = useContext(SignalementViewerContext)
  const { setAdresseSearchMapLayersOptions, setSignalementSearchMapLayerOptions, mapRef } =
    useContext(MapContext)

  const [activeTabId, setActiveTabId] = useState<string>(SIGNALEMENTS_TAB_ID)
  const [hoveredSignalement, setHoveredSignalement] = useState<Signalement>()
  const [hoveredAlert, setHoveredAlert] = useState<Alert>()
  const [selectedAlert, setSelectedAlert] = useState<Alert>()
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
    async (page: number, filter: SignalementBrowserFilter): Promise<PaginatedSignalementsDTO> => {
      const { status, types, communes, sources } = filter
      return SignalementsService.getSignalements(
        PAGE_SIZE,
        page,
        status.map((s) => s.value),
        types.map((t) => t.value),
        sources.map((s) => s.value),
        communes.map((c) => c.value),
      )
    },
    [],
  )

  const fetchAlerts = useCallback(
    async (page: number, filter: AlertBrowserFilter): Promise<PaginatedAlertsDTO> => {
      const { status, types, communes, sources } = filter
      return AlertsService.getAlerts(
        PAGE_SIZE,
        page,
        status.map((s) => s.value),
        types.map((t) => t.value),
        sources.map((s) => s.value),
        communes.map((c) => c.value),
      )
    },
    [],
  )

  const signalementsBrowser = useBrowserData(fetchSignalements, signalementsInitialFilter)
  const alertsBrowser = useBrowserData(fetchAlerts, alertsInitialFilter)

  // flyTo helper
  const flyTo = useCallback(
    (coordinates?: [number, number]) => {
      if (!mapRef || !coordinates) {
        return
      }
      mapRef.flyTo({ center: coordinates, zoom: 18, maxDuration: 3000 })
    },
    [mapRef],
  )

  const handleSelectSignalement = useCallback(
    (signalement: Signalement) => {
      setViewedSignalement(signalement)
      if (signalement.point) {
        flyTo(signalement.point.coordinates as [number, number])
      }
    },
    [flyTo, setViewedSignalement],
  )

  const handleSelectAlert = useCallback(
    (alert: Alert) => {
      setSelectedAlert(alert)
      if (alert.point) {
        flyTo(alert.point.coordinates as [number, number])
      }
    },
    [flyTo],
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
        selectedAlert={selectedAlert}
        setHoveredAlert={setHoveredAlert}
        onSelectAlert={handleSelectAlert}
      />
    )
  }, [alertsBrowser.paginatedData, hoveredAlert, selectedAlert, handleSelectAlert])

  const mapContent = useMemo(
    () => (activeTabId === ALERTS_TAB_ID ? alertsMapContent : signalementsMapContent),
    [activeTabId, alertsMapContent, signalementsMapContent],
  )

  useMapContent(mapContent)

  const sharedSourceOptions = hideSourceFilter ? undefined : sourceOptions

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
        <BrowserTab<Signalement, Signalement.type, Signalement.status>
          isLoading={signalementsBrowser.isLoading}
          paginatedData={signalementsBrowser.paginatedData}
          pageSize={PAGE_SIZE}
          page={signalementsBrowser.page}
          onPageChange={signalementsBrowser.setPage}
          filter={signalementsBrowser.filter}
          initialFilter={signalementsInitialFilter}
          onFilterChange={signalementsBrowser.setFilter}
          onResetFilter={signalementsBrowser.resetFilter}
          renderItem={(signalement) => <SignalementCard signalement={signalement} />}
          getItemKey={(signalement, index) => signalement.id ?? index}
          onItemHover={setHoveredSignalement}
          onItemSelect={handleSelectSignalement}
          emptyMessage='Aucun signalement'
          filterButtonLabel='Filtrer les signalements'
          filterButtonLabelActive='Modifier les filtres'
          filtersConfig={{
            title: 'Filtrer les signalements',
            statusOptions: signalementFilterStatusOptions,
            typeOptions: signalementFilterTypesOptions,
            sourceOptions: sharedSourceOptions,
            sourceHint: 'Sources de provenance des signalements',
            communeHint: 'Communes sur lesquelles les signalements ont été effectués',
          }}
        />
      )}
      {activeTabId === ALERTS_TAB_ID && (
        <BrowserTab<Alert, Alert.type, Alert.status>
          isLoading={alertsBrowser.isLoading}
          paginatedData={alertsBrowser.paginatedData}
          pageSize={PAGE_SIZE}
          page={alertsBrowser.page}
          onPageChange={alertsBrowser.setPage}
          filter={alertsBrowser.filter}
          initialFilter={alertsInitialFilter}
          onFilterChange={alertsBrowser.setFilter}
          onResetFilter={alertsBrowser.resetFilter}
          renderItem={(alert) => <AlertCard alert={alert} />}
          getItemKey={(alert, index) => alert.id ?? index}
          onItemHover={setHoveredAlert}
          onItemSelect={handleSelectAlert}
          emptyMessage='Aucune alerte'
          filterButtonLabel='Filtrer les alertes'
          filterButtonLabelActive='Modifier les filtres'
          filtersConfig={{
            title: 'Filtrer les alertes',
            statusOptions: alertFilterStatusOptions,
            typeOptions: alertFilterTypesOptions,
            sourceOptions: sharedSourceOptions,
            sourceHint: 'Sources de provenance des alertes',
            communeHint: 'Communes sur lesquelles les alertes ont été effectuées',
          }}
        />
      )}
    </StyledTabs>
  )
}
