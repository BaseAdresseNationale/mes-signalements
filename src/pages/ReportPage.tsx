import React, { useContext, useEffect, useMemo } from 'react'
import { useLoaderData } from 'react-router-dom'
import { ExpressionSpecification } from '@maplibre/maplibre-gl-style-spec'
import { Alert, ExistingLocation, ExistingNumero, Signalement } from '../api/signalement'
import MapContext from '../contexts/map.context'
import SignalementViewer from '../composants/signalement/SignalementViewer'
import AlertViewer from '../composants/alert/AlertViewer'
import { useMapContent } from '../hooks/useMapContent'
import { useReportMap } from '../hooks/useReportMap'
import { isReportSignalement } from '../utils/report.utils'

export function ReportPage() {
  const { report } = useLoaderData() as { report: Signalement | Alert }
  const { setAdresseSearchMapLayersOptions, setSignalementSearchMapLayerOptions } =
    useContext(MapContext)

  const { mapContent, mapPositions, activeRole, setActiveRole } = useReportMap(report)
  useMapContent(mapContent)

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

  return (
    <div className='fr-p-1w'>
      {isReportSignalement(report) ? (
        <SignalementViewer
          signalement={report}
          activeRole={activeRole}
          onActiveRoleChange={setActiveRole}
        />
      ) : (
        <AlertViewer alert={report} />
      )}
    </div>
  )
}
