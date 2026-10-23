import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, ExistingLocation, Signalement } from '../api/signalement'
import MapContext from '../contexts/map.context'
import ReportMap from '../composants/map/ReportMap'
import { MOBILE_BREAKPOINT } from './useWindowSize'
import {
  getReportMapPositions,
  getReportParcelles,
  getRequestedReportLocation,
  isReportSignalement,
  ReportRole,
} from '../utils/report.utils'
import { isToponymeChangesRequested } from '../utils/signalement.utils'

const NUMERO_ZOOM = 20
const DEFAULT_ZOOM = 18

function getReportZoom(report: Signalement | Alert): number {
  if (!isReportSignalement(report)) {
    return DEFAULT_ZOOM
  }

  const isToponymeOrVoie =
    report.type === Signalement.type.LOCATION_TO_CREATE
      ? isToponymeChangesRequested(report.changesRequested)
      : report.existingLocation?.type === ExistingLocation.type.TOPONYME ||
        report.existingLocation?.type === ExistingLocation.type.VOIE

  return isToponymeOrVoie ? DEFAULT_ZOOM : NUMERO_ZOOM
}

// Marges pour que les positions ne soient pas masquées par le drawer (à gauche, ou en bas sur mobile).
function getMapPadding() {
  const margin = 80
  return window.innerWidth <= MOBILE_BREAKPOINT
    ? { top: margin, right: 40, left: 40, bottom: Math.round(window.innerHeight * 0.5) + 20 }
    : { top: margin, right: margin, bottom: margin, left: 400 + margin }
}

// Affiche sur la carte un rapport (ou un brouillon de signalement) : positions, parcelles et cadrage.
export function useReportMap(report: Signalement | Alert | null) {
  const { mapRef, showCadastre, setShowCadastre } = useContext(MapContext)

  // Un brouillon est recréé à chaque saisie : on ne réagit qu'aux changements de la demande elle-même.
  const signalement = report && isReportSignalement(report) ? report : null
  const stableReport = useMemo(
    () => report,
    [report?.id, signalement?.type, signalement?.changesRequested, signalement?.existingLocation],
  )

  const mapPositions = useMemo(
    () =>
      stableReport && isReportSignalement(stableReport) ? getReportMapPositions(stableReport) : [],
    [stableReport],
  )

  const parcelles = useMemo(
    () =>
      stableReport && isReportSignalement(stableReport) ? getReportParcelles(stableReport) : [],
    [stableReport],
  )
  const hasParcelles = parcelles.length > 0

  // Le cadastre est affiché le temps de la consultation, puis remis comme avant.
  const showCadastreRef = useRef(showCadastre)
  showCadastreRef.current = showCadastre
  useEffect(() => {
    if (!hasParcelles || showCadastreRef.current) {
      return
    }

    setShowCadastre(true)
    return () => setShowCadastre(false)
  }, [hasParcelles, setShowCadastre])

  // La demande est affichée par défaut ; sans demande (suppression), c'est l'existant.
  const [selectedRole, setSelectedRole] = useState<ReportRole | null>(null)
  useEffect(() => setSelectedRole(null), [stableReport])
  const activeRole: ReportRole =
    selectedRole ??
    (stableReport && isReportSignalement(stableReport) && getRequestedReportLocation(stableReport)
      ? 'requested'
      : 'existing')

  const mapContent = useMemo(
    () =>
      mapPositions.length > 0 || hasParcelles ? (
        <ReportMap positions={mapPositions} parcelles={parcelles} activeRole={activeRole} />
      ) : null,
    [mapPositions, parcelles, hasParcelles, activeRole],
  )

  useEffect(() => {
    if (!mapRef || !stableReport) {
      return
    }

    const coordinates = mapPositions.length
      ? mapPositions.map(({ coordinates }) => coordinates)
      : stableReport.point?.coordinates
        ? [stableReport.point.coordinates as [number, number]]
        : []
    if (coordinates.length === 0) {
      return
    }

    const lngs = coordinates.map(([lng]) => lng)
    const lats = coordinates.map(([, lat]) => lat)
    mapRef.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: getMapPadding(), maxZoom: getReportZoom(stableReport), maxDuration: 3000 },
    )
  }, [mapRef, stableReport, mapPositions])

  return { mapContent, mapPositions, activeRole, setActiveRole: setSelectedRole }
}
