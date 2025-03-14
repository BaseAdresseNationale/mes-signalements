import React, { useContext, useEffect, useMemo } from 'react'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import {
  IBANPlateformeNumero,
  BANPlateformeResultTypeEnum,
  IBANPlateformeVoie,
  IBANPlateformeLieuDit,
} from '../api/ban-plateforme/types'
import { NumeroCard } from '../composants/adresse/NumeroCard'
import SignalementForm from '../composants/signalement/SignalementForm'
import {
  NumeroChangesRequestedDTO,
  Signalement,
  ToponymeChangesRequestedDTO,
} from '../api/signalement'
import { VoieCard } from '../composants/adresse/VoieCard'
import { LieuDitCard } from '../composants/adresse/LieuDitCard'
import useWindowSize from '../hooks/useWindowSize'
import { MapContext } from '../contexts/map.context'
import SignalementMap from '../composants/map/SignalementMap'
import { useMapContent } from '../hooks/useMapContent'
import { ChangesRequested, SignalementMode } from '../types/signalement.types'
import { FilterSpecification } from 'maplibre-gl'
import { SignalementContext } from '../contexts/signalement.context'

export function SignalementPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { isMobile } = useWindowSize()
  const { mapRef, editParcelles, setAdresseSearchMapLayersOptions } = useContext(MapContext)
  const { adresse, mode } = useLoaderData() as {
    adresse: IBANPlateformeVoie | IBANPlateformeLieuDit | IBANPlateformeNumero
    mode: SignalementMode
  }
  const {
    signalement,
    createSignalement,
    deleteSignalement,
    onEditSignalement,
    hasSignalementChanged,
  } = useContext(SignalementContext)

  // Fly to location
  useEffect(() => {
    if (!mapRef) {
      return
    }

    let position
    const isVoieOrLieuDit =
      adresse.type === BANPlateformeResultTypeEnum.VOIE ||
      adresse.type === BANPlateformeResultTypeEnum.LIEU_DIT
    if (isVoieOrLieuDit && adresse.displayBBox) {
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
      zoom: isVoieOrLieuDit ? 18 : 20,
      screenSpeed: 2,
    })
  }, [mapRef, adresse, isMobile])

  // Create a signalement from search params
  useEffect(() => {
    const type = searchParams.get('type')
    const changesRequested = searchParams.get('changesRequested')

    if (type) {
      createSignalement(
        type as Signalement.type,
        adresse,
        changesRequested
          ? (JSON.parse(decodeURI(changesRequested)) as ChangesRequested)
          : undefined,
      )
      searchParams.delete('type')
      searchParams.delete('changesRequested')
      setSearchParams(searchParams)
    }
  }, [searchParams, adresse, createSignalement])

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
            ['literal', adresse.numeros.map((numero) => numero.id)],
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
      {signalement ? (
        <SignalementForm
          address={adresse}
          mode={mode}
          map={mapRef || null}
          signalement={signalement as Signalement}
          onEditSignalement={onEditSignalement}
          onClose={handleCloseSignalementForm}
          hasSignalementChanged={hasSignalementChanged}
        />
      ) : (
        <>
          {adresse.type === BANPlateformeResultTypeEnum.NUMERO && (
            <NumeroCard
              adresse={adresse}
              {...(mode === SignalementMode.DISABLED
                ? {}
                : {
                    createSignalement,
                  })}
            />
          )}
          {adresse.type === BANPlateformeResultTypeEnum.VOIE && (
            <VoieCard
              adresse={adresse}
              {...(mode === SignalementMode.DISABLED
                ? {}
                : {
                    createSignalement,
                  })}
            />
          )}
          {adresse.type === BANPlateformeResultTypeEnum.LIEU_DIT && (
            <LieuDitCard
              adresse={adresse}
              {...(mode === SignalementMode.DISABLED
                ? {}
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
