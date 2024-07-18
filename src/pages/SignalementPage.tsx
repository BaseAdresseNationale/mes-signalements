import React, { useContext, useEffect, useMemo } from 'react'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import {
  IBANPlateformeNumero,
  IBANPlateformeResult,
  BANPlateformeResultTypeEnum,
  IBANPlateformeVoie,
  IBANPlateformeLieuDit,
} from '../api/ban-plateforme/types'
import { NumeroCard } from '../composants/adresse/NumeroCard'
import SignalementForm from '../composants/signalement/SignalementForm'
import { NumeroChangesRequestedDTO, Signalement } from '../api/signalement'
import { VoieCard } from '../composants/adresse/VoieCard'
import { LieuDitCard } from '../composants/adresse/LieuDitCard'
import useWindowSize from '../hooks/useWindowSize'
import { useSignalement } from '../hooks/useSignalement'
import { MapContext } from '../contexts/map.context'
import SignalementMap from '../composants/map/SignalementMap'
import { Marker } from '../composants/map/Marker'
import { getAdresseLabel } from '../utils/adresse.utils'
import { useMapContent } from '../hooks/useMapContent'
import { ChangesRequested } from '../types/signalement.types'
import { AdresseSearchMap } from '../composants/map/AdresseSearchMap'

export function SignalementPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { isMobile } = useWindowSize()
  const { mapRef, editParcelles } = useContext(MapContext)
  const { adresse } = useLoaderData() as {
    adresse: IBANPlateformeResult
  }
  const { signalement, createSignalement, deleteSignalement, onEditSignalement } = useSignalement()

  // Fly to location
  useEffect(() => {
    if (!mapRef) {
      return
    }

    let position
    if ((adresse as any).displayBBox) {
      const voieOrLieuDit = adresse as IBANPlateformeVoie | IBANPlateformeLieuDit
      position = [
        (voieOrLieuDit.displayBBox[0] + voieOrLieuDit.displayBBox[2]) / 2,
        (voieOrLieuDit.displayBBox[1] + voieOrLieuDit.displayBBox[3]) / 2,
      ]
    } else {
      const numero = adresse as IBANPlateformeNumero
      position = [numero.lon, numero.lat]
    }
    mapRef.flyTo({
      center: position as [number, number],
      offset: [0, isMobile ? -100 : 0],
      zoom: 20,
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

  // Map content
  const mapContent = useMemo(() => {
    return (
      <>
        {!(signalement?.changesRequested as NumeroChangesRequestedDTO)?.positions &&
          Boolean((adresse as IBANPlateformeNumero)?.lat) &&
          Boolean((adresse as IBANPlateformeNumero)?.lon) && (
            <Marker
              label={getAdresseLabel(adresse)}
              coordinates={[
                (adresse as IBANPlateformeNumero).lon,
                (adresse as IBANPlateformeNumero).lat,
              ]}
            />
          )}
        {(signalement?.changesRequested as NumeroChangesRequestedDTO)?.positions && (
          <SignalementMap
            isEditParcellesMode={editParcelles}
            signalement={signalement as Signalement}
            onEditSignalement={onEditSignalement}
          />
        )}
        {(adresse.type === BANPlateformeResultTypeEnum.VOIE ||
          adresse.type === BANPlateformeResultTypeEnum.LIEU_DIT) && (
          <AdresseSearchMap
            layers={['adresse', 'adresse-label']}
            filter={['in', adresse.id, ['get', 'id']]}
          />
        )}
      </>
    )
  }, [signalement, adresse, editParcelles])

  useMapContent(mapContent)

  return (
    <>
      {!signalement && (
        <>
          {adresse.type === BANPlateformeResultTypeEnum.NUMERO && (
            <NumeroCard
              adresse={adresse as IBANPlateformeNumero}
              createSignalement={createSignalement}
            />
          )}
          {adresse.type === BANPlateformeResultTypeEnum.VOIE && (
            <VoieCard
              adresse={adresse as IBANPlateformeVoie}
              createSignalement={createSignalement}
            />
          )}
          {adresse.type === BANPlateformeResultTypeEnum.LIEU_DIT && (
            <LieuDitCard
              adresse={adresse as IBANPlateformeLieuDit}
              createSignalement={createSignalement}
            />
          )}
        </>
      )}

      {signalement && (
        <SignalementForm
          address={adresse}
          map={mapRef || null}
          signalement={signalement as Signalement}
          onEditSignalement={onEditSignalement}
          onClose={handleCloseSignalementForm}
        />
      )}
    </>
  )
}
