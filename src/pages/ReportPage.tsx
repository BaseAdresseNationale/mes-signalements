import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { ExpressionSpecification } from '@maplibre/maplibre-gl-style-spec'
import { Alert, ExistingLocation, ExistingNumero, Signalement } from '../api/signalement'
import MapContext from '../contexts/map.context'
import SignalementViewer from '../composants/signalement/SignalementViewer'
import AlertViewer from '../composants/alert/AlertViewer'
import ReportMap from '../composants/map/ReportMap'
import { useMapContent } from '../hooks/useMapContent'
import { MOBILE_BREAKPOINT } from '../hooks/useWindowSize'
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

export function ReportPage() {
  const { report } = useLoaderData() as { report: Signalement | Alert }
  const {
    mapRef,
    showCadastre,
    setShowCadastre,
    setAdresseSearchMapLayersOptions,
    setSignalementSearchMapLayerOptions,
  } = useContext(MapContext)

  // Les tuiles BAN n'exposent pas le banId : on retrouve l'adresse par ses propriétés.
  const existingNumeroFilter = useMemo<ExpressionSpecification | null>(() => {
    if (
      !isReportSignalement(report) ||
      report.type === Signalement.type.LOCATION_TO_CREATE ||
      report.existingLocation?.type !== ExistingLocation.type.NUMERO
    ) {
      return null
    }

    const { numero, suffixe, toponyme } = report.existingLocation as ExistingNumero
    return [
      'all',
      ['==', ['get', 'codeCommune'], report.codeCommune],
      ['==', ['get', 'numero'], numero],
      ['==', ['coalesce', ['get', 'suffixe'], ''], suffixe || ''],
      ['==', ['get', 'nomVoie'], toponyme.nom],
    ]
  }, [report])

  const mapPositions = useMemo(
    () => (isReportSignalement(report) ? getReportMapPositions(report) : []),
    [report],
  )

  const parcelles = useMemo(
    () => (isReportSignalement(report) ? getReportParcelles(report) : []),
    [report],
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
  useEffect(() => setSelectedRole(null), [report])
  const activeRole: ReportRole =
    selectedRole ??
    (isReportSignalement(report) && getRequestedReportLocation(report) ? 'requested' : 'existing')

  const mapContent = useMemo(
    () =>
      mapPositions.length > 0 || hasParcelles ? (
        <ReportMap positions={mapPositions} parcelles={parcelles} activeRole={activeRole} />
      ) : null,
    [mapPositions, parcelles, hasParcelles, activeRole],
  )

  useMapContent(mapContent)

  useEffect(() => {
    // L'adresse concernée est représentée par les marqueurs du rapport : on la masque de la BAN.
    const isHidden = existingNumeroFilter
    const hoverOpacity: ExpressionSpecification = [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      1,
      0.6,
    ]

    setAdresseSearchMapLayersOptions({
      adresse: isHidden
        ? {
            paint: {
              'circle-opacity': ['case', isHidden, 0, hoverOpacity],
              'circle-stroke-opacity': ['case', isHidden, 0, 1],
            },
          }
        : {},
      'adresse-label': isHidden
        ? { paint: { 'text-opacity': ['case', isHidden, 0, hoverOpacity] } }
        : {},
      voie: {},
      toponyme: {},
    })
    // Les marqueurs du rapport remplacent les points de l'API pour ne pas se superposer.
    setSignalementSearchMapLayerOptions(
      mapPositions.length > 0 ? { layout: { visibility: 'none' } } : {},
    )
  }, [
    setAdresseSearchMapLayersOptions,
    setSignalementSearchMapLayerOptions,
    mapPositions,
    existingNumeroFilter,
  ])

  useEffect(() => {
    if (!mapRef) {
      return
    }

    const coordinates = mapPositions.length
      ? mapPositions.map(({ coordinates }) => coordinates)
      : report.point?.coordinates
        ? [report.point.coordinates as [number, number]]
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
      { padding: getMapPadding(), maxZoom: getReportZoom(report), maxDuration: 3000 },
    )
  }, [mapRef, report, mapPositions])

  return (
    <div className='fr-p-1w'>
      {isReportSignalement(report) ? (
        <SignalementViewer
          signalement={report}
          activeRole={activeRole}
          onActiveRoleChange={setSelectedRole}
        />
      ) : (
        <AlertViewer alert={report} />
      )}
    </div>
  )
}
