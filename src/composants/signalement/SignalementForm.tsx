import React, { useContext, useState } from 'react'
import SignalementToponymeForm from './signalement-form/signalement-toponyme/SignalementToponymeForm'
import SignalementNumeroForm from './signalement-form/signalement-numero/SignalementNumeroForm'
import RecapModal from './RecapModal'
import SignalementNumeroDeleteForm from './signalement-form/signalement-numero/SignalementNumeroDeleteForm'
import { CommuneStatusDTO, Signalement } from '../../api/signalement'
import {
  BANPlateformeResultTypeEnum,
  IBANPlateformeLieuDit,
  IBANPlateformeNumero,
  IBANPlateformeVoie,
} from '../../api/ban-plateforme/types'
import { MapRef } from 'react-map-gl/maplibre'
import SignalementVoieForm from './signalement-form/signalement-voie/SignalementVoieForm'
import MapContext from '../../contexts/map.context'

interface SignalementFormProps {
  signalement: Signalement
  map: MapRef | null
  onEditSignalement: (property: keyof Signalement, key: string) => (value: any) => void
  onClose: () => void
  address: IBANPlateformeVoie | IBANPlateformeLieuDit | IBANPlateformeNumero
  hasSignalementChanged: boolean
  mode: CommuneStatusDTO.mode
}

export default function SignalementForm({
  signalement,
  map,
  onEditSignalement,
  onClose,
  address,
  hasSignalementChanged,
  mode,
}: SignalementFormProps) {
  const [showRecapModal, setShowRecapModal] = useState(false)
  const { showCadastre, setShowCadastre } = useContext(MapContext)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setShowRecapModal(true)
    if (showCadastre) {
      setShowCadastre(false)
    }
  }

  return (
    <>
      {signalement?.type === Signalement.type.LOCATION_TO_UPDATE &&
        address.type === BANPlateformeResultTypeEnum.LIEU_DIT && (
          <SignalementToponymeForm
            onClose={onClose}
            onSubmit={handleSubmit}
            onEditSignalement={onEditSignalement}
            signalement={signalement}
            address={address}
            initialPositionCoords={[map?.getCenter()?.lng || 0, map?.getCenter()?.lat || 0]}
            hasSignalementChanged={hasSignalementChanged}
            mode={mode}
          />
        )}

      {signalement?.type === Signalement.type.LOCATION_TO_UPDATE &&
        address.type === BANPlateformeResultTypeEnum.VOIE && (
          <SignalementVoieForm
            onClose={onClose}
            onSubmit={handleSubmit}
            onEditSignalement={onEditSignalement}
            signalement={signalement}
            address={address}
            hasSignalementChanged={hasSignalementChanged}
          />
        )}

      {signalement?.type === Signalement.type.LOCATION_TO_CREATE &&
        address.type === BANPlateformeResultTypeEnum.VOIE && (
          <SignalementNumeroForm
            onClose={onClose}
            onSubmit={handleSubmit}
            onEditSignalement={onEditSignalement}
            signalement={signalement}
            address={address}
            initialPositionCoords={[map?.getCenter()?.lng || 0, map?.getCenter()?.lat || 0]}
            hasSignalementChanged={hasSignalementChanged}
            mode={mode}
          />
        )}

      {signalement?.type === Signalement.type.LOCATION_TO_UPDATE &&
        address.type === BANPlateformeResultTypeEnum.NUMERO && (
          <SignalementNumeroForm
            onClose={onClose}
            onSubmit={handleSubmit}
            onEditSignalement={onEditSignalement}
            signalement={signalement}
            address={address}
            initialPositionCoords={[address.lon, address.lat]}
            hasSignalementChanged={hasSignalementChanged}
            mode={mode}
          />
        )}

      {signalement?.type === Signalement.type.LOCATION_TO_DELETE && (
        <SignalementNumeroDeleteForm
          signalement={signalement}
          address={address as IBANPlateformeNumero}
          onClose={onClose}
          onSubmit={handleSubmit}
          onEditSignalement={onEditSignalement}
        />
      )}

      {showRecapModal && (
        <RecapModal
          onClose={onClose}
          onCloseModal={() => setShowRecapModal(false)}
          signalement={signalement}
          address={address}
          onEditSignalement={onEditSignalement}
        />
      )}
    </>
  )
}
