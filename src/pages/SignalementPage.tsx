import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import {
  IBANPlateformeNumero,
  BANPlateformeResultTypeEnum,
  IBANPlateformeResult,
  IBANPlateformeCommune,
  IBANPlateformeLieuDit,
  IBANPlateformeVoie,
} from '../api/ban-plateforme/types'
import { NumeroCard } from '../composants/adresse/Cards/NumeroCard'
import SignalementForm from '../composants/signalement/SignalementForm'
import {
  NumeroChangesRequestedDTO,
  Signalement,
  ToponymeChangesRequestedDTO,
} from '../api/signalement'
import { VoieCard } from '../composants/adresse/Cards/VoieCard'
import { LieuDitCard } from '../composants/adresse/Cards/LieuDitCard'
import useWindowSize from '../hooks/useWindowSize'
import { MapContext } from '../contexts/map.context'
import SignalementMap from '../composants/map/SignalementMap'
import { useMapContent } from '../hooks/useMapContent'
import { ChangesRequested } from '../types/signalement.types'
import { FilterSpecification } from 'maplibre-gl'
import { SignalementContext } from '../contexts/signalement.context'
import {
  getModalTitle,
  getSignalementExistingLocationString,
  getSignalementFromFeatureAPISignalement,
} from '../utils/signalement.utils'
import Alert from '@codegouvfr/react-dsfr/Alert'
import { SignalementViewerContext } from '../contexts/signalement-viewer.context'
import Button from '@codegouvfr/react-dsfr/Button'
import { getAdresseString } from '../utils/adresse.utils'
import { useCommuneStatus } from '../hooks/useCommuneStatus'
import Loader from '../composants/common/Loader'
import { CommuneCard } from '../composants/adresse/Cards/CommuneCard'

export function SignalementPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { setViewedSignalement } = useContext(SignalementViewerContext)
  const [pendingSignalements, setPendingSignalements] = useState<Signalement[]>([])
  const { isMobile } = useWindowSize()
  const {
    mapRef,
    editParcelles,
    setAdresseSearchMapLayersOptions,
    setSignalementSearchMapLayerOptions,
  } = useContext(MapContext)
  const { adresse } = useLoaderData() as {
    adresse: IBANPlateformeResult
  }
  const {
    signalement,
    createSignalement,
    deleteSignalement,
    onEditSignalement,
    hasSignalementChanged,
  } = useContext(SignalementContext)

  const { communeStatus, isCommuneStatusLoading } = useCommuneStatus({
    codeCommune:
      adresse.type === BANPlateformeResultTypeEnum.COMMUNE
        ? (adresse as IBANPlateformeCommune).codeCommune
        : (adresse as IBANPlateformeNumero).commune.code,
  })

  // Fly to location
  useEffect(() => {
    if (!mapRef) {
      return
    }

    let position
    if (adresse.displayBBox) {
      position = [
        (adresse.displayBBox[0] + adresse.displayBBox[2]) / 2,
        (adresse.displayBBox[1] + adresse.displayBBox[3]) / 2,
      ]
    } else {
      const numero = adresse as IBANPlateformeNumero
      position = [numero.lon, numero.lat]
    }
    mapRef.flyTo({
      center: position as [number, number],
      offset: [0, isMobile ? -100 : 0],
      zoom:
        adresse.type === BANPlateformeResultTypeEnum.COMMUNE
          ? 12
          : adresse.type === BANPlateformeResultTypeEnum.NUMERO
            ? 20
            : 18,
      maxDuration: 3000,
    })
  }, [mapRef, adresse, isMobile])

  // Create a signalement from search params
  useEffect(() => {
    if (isCommuneStatusLoading) {
      return
    }

    const type = searchParams.get('type')
    const changesRequested = searchParams.get('changesRequested')

    if (type) {
      if (!communeStatus?.disabled) {
        createSignalement(
          type as Signalement.type,
          adresse,
          changesRequested
            ? (JSON.parse(decodeURI(changesRequested)) as ChangesRequested)
            : undefined,
        )
      }
      searchParams.delete('type')
      searchParams.delete('changesRequested')
      setSearchParams(searchParams)
    }
  }, [searchParams, adresse, createSignalement, communeStatus, isCommuneStatusLoading])

  const handleCloseSignalementForm = () => {
    deleteSignalement()
  }

  // Only show the adresses related to the current toponyme
  useEffect(() => {
    const filter =
      adresse.type === BANPlateformeResultTypeEnum.LIEU_DIT
        ? ([
            'in',
            ['get', 'id'],
            ['literal', (adresse as IBANPlateformeLieuDit).numeros.map((numero) => numero.id)],
          ] as FilterSpecification)
        : (['in', adresse.id, ['get', 'id']] as FilterSpecification)

    if (
      (signalement?.changesRequested as NumeroChangesRequestedDTO | ToponymeChangesRequestedDTO)
        ?.positions
    ) {
      setAdresseSearchMapLayersOptions({
        adresse: { layout: { visibility: 'none' } },
        'adresse-label': { layout: { visibility: 'none' } },
        voie: { layout: { visibility: 'none' } },
        toponyme: { layout: { visibility: 'none' } },
      })
    } else {
      setAdresseSearchMapLayersOptions({
        adresse: { filter },
        'adresse-label': { filter },
        voie: { layout: { visibility: 'none' } },
        toponyme: { layout: { visibility: 'none' } },
      })
    }
  }, [setAdresseSearchMapLayersOptions, adresse, signalement])

  // Query the map to get existing signalements
  useEffect(() => {
    // Dirty hack : To be able to query the features, they need to stay "visible"
    setSignalementSearchMapLayerOptions({
      layout: { 'icon-size': 0.0000001 },
      paint: { 'icon-opacity': 0 },
    })

    if (!mapRef) {
      return
    }

    const handleQueryPendingSignalements = () => {
      const pendingSignalements = mapRef
        .querySourceFeatures('api-signalement', {
          sourceLayer: 'signalements',
        })
        .map((feature) => getSignalementFromFeatureAPISignalement(feature))
        .filter((signalement) => {
          if (adresse.banId && signalement.existingLocation?.banId) {
            return adresse.banId === signalement.existingLocation?.banId
          } else {
            return getAdresseString(adresse) === getSignalementExistingLocationString(signalement)
          }
        })

      setPendingSignalements(pendingSignalements)
    }

    mapRef.once('idle', handleQueryPendingSignalements)

    return () => {
      mapRef.off('idle', handleQueryPendingSignalements)
    }
  }, [mapRef, setSignalementSearchMapLayerOptions])

  // Map content
  const mapContent = useMemo(() => {
    return (
      (signalement?.changesRequested as NumeroChangesRequestedDTO | ToponymeChangesRequestedDTO)
        ?.positions && (
        <SignalementMap
          isEditParcellesMode={editParcelles}
          signalement={signalement as Signalement}
          onEditSignalement={onEditSignalement}
        />
      )
    )
  }, [signalement, editParcelles])

  useMapContent(mapContent)

  return (
    <>
      {isCommuneStatusLoading ? (
        <div className='loader-wrapper'>
          <Loader />
        </div>
      ) : signalement && communeStatus.mode ? (
        <SignalementForm
          address={adresse}
          mode={communeStatus.mode}
          signalement={signalement as Signalement}
          onEditSignalement={onEditSignalement}
          onClose={handleCloseSignalementForm}
          hasSignalementChanged={hasSignalementChanged}
        />
      ) : (
        <>
          {pendingSignalements.length > 0 && (
            <Alert
              style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}
              severity='info'
              title={`${pendingSignalements.length} signalement${pendingSignalements.length > 1 ? 's' : ''} en attente de traitement`}
              description={
                <ul>
                  {pendingSignalements.map((signalement) => (
                    <Button
                      size='small'
                      priority='tertiary no outline'
                      key={signalement.id}
                      onClick={() => setViewedSignalement(signalement)}
                    >
                      {`${getModalTitle(signalement)} déposée le ${new Date(signalement.createdAt).toLocaleDateString()}`}
                    </Button>
                  ))}
                </ul>
              }
            />
          )}
          {adresse.type === BANPlateformeResultTypeEnum.NUMERO && (
            <NumeroCard
              adresse={adresse as IBANPlateformeNumero}
              {...(communeStatus.disabled
                ? {
                    disabledMessage: communeStatus.message,
                  }
                : {
                    createSignalement,
                  })}
            />
          )}
          {adresse.type === BANPlateformeResultTypeEnum.VOIE && (
            <VoieCard
              adresse={adresse as IBANPlateformeVoie}
              {...(communeStatus.disabled
                ? {
                    disabledMessage: communeStatus.message,
                  }
                : {
                    createSignalement,
                  })}
            />
          )}
          {adresse.type === BANPlateformeResultTypeEnum.LIEU_DIT && (
            <LieuDitCard
              adresse={adresse as IBANPlateformeLieuDit}
              {...(communeStatus.disabled
                ? {
                    disabledMessage: communeStatus.message,
                  }
                : {
                    createSignalement,
                  })}
            />
          )}
          {adresse.type === BANPlateformeResultTypeEnum.COMMUNE && (
            <CommuneCard
              adresse={adresse as IBANPlateformeCommune}
              {...(communeStatus.disabled
                ? {
                    disabledMessage: communeStatus.message,
                  }
                : {
                    createSignalement,
                  })}
            />
          )}
        </>
      )}
    </>
  )
}
