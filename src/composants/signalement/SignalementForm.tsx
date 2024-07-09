import React, { useState } from 'react'
import SignalementToponymeForm from './signalement-toponyme/SignalementToponymeForm'
import SignalementNumeroForm from './signalement-numero/SignalementNumeroForm'
import RecapModal from './RecapModal'
import SignalementNumeroDeleteForm from './signalement-numero/SignalementNumeroDeleteForm'
import { Signalement } from '../../api/signalement'
import { BANPlateformeResultTypeEnum } from '../../api/ban-plateforme/types'
import { MapRef } from 'react-map-gl/maplibre'
import SignalementVoieForm from './signalement-voie/SignalementVoieForm'

interface SignalementFormProps {
  signalement: Signalement
  map: MapRef | null
  onEditSignalement: any
  onClose: any
  address: any
  setIsEditParcellesMode: any
  isEditParcellesMode: boolean
}

export default function SignalementForm({
  signalement,
  map,
  onEditSignalement,
  onClose,
  address,
  setIsEditParcellesMode,
  isEditParcellesMode,
}: SignalementFormProps) {
  const [showRecapModal, setShowRecapModal] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setShowRecapModal(true)
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
          />
        )}

      {signalement?.type === Signalement.type.LOCATION_TO_CREATE &&
        address.type === BANPlateformeResultTypeEnum.VOIE && (
          <SignalementNumeroForm
            setIsEditParcellesMode={setIsEditParcellesMode}
            onClose={onClose}
            onSubmit={handleSubmit}
            onEditSignalement={onEditSignalement}
            signalement={signalement}
            isEditParcellesMode={isEditParcellesMode}
            initialPositionCoords={[map?.getCenter()?.lng || 0, map?.getCenter()?.lat || 0]}
          />
        )}

      {signalement?.type === Signalement.type.LOCATION_TO_UPDATE &&
        address.type === BANPlateformeResultTypeEnum.NUMERO && (
          <SignalementNumeroForm
            setIsEditParcellesMode={setIsEditParcellesMode}
            onClose={onClose}
            onSubmit={handleSubmit}
            onEditSignalement={onEditSignalement}
            signalement={signalement}
            isEditParcellesMode={isEditParcellesMode}
            address={address}
            initialPositionCoords={[address.lon, address.lat]}
          />
        )}

      {signalement?.type === Signalement.type.LOCATION_TO_DELETE && (
        <SignalementNumeroDeleteForm
          signalement={signalement}
          address={address}
          onClose={onClose}
          onSubmit={handleSubmit}
          onEditSignalement={onEditSignalement}
        />
      )}

      {showRecapModal && (
        <RecapModal
          onSubmit={onClose}
          onClose={() => setShowRecapModal(false)}
          signalement={signalement}
          address={address}
          onEditSignalement={onEditSignalement}
        />
      )}
    </>
  )
}
