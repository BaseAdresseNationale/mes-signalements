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
  onEditSignalement: (property: keyof Signalement, key: string) => (value: any) => void
  onClose: () => void
  address: any
}

export default function SignalementForm({
  signalement,
  map,
  onEditSignalement,
  onClose,
  address,
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
            initialPositionCoords={[map?.getCenter()?.lng || 0, map?.getCenter()?.lat || 0]}
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
            onClose={onClose}
            onSubmit={handleSubmit}
            onEditSignalement={onEditSignalement}
            signalement={signalement}
            address={address}
            initialPositionCoords={[map?.getCenter()?.lng || 0, map?.getCenter()?.lat || 0]}
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
