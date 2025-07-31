import React, { useContext, useState } from 'react'
import SignalementToponymeForm from './signalement-form/signalement-toponyme/SignalementToponymeForm'
import SignalementNumeroForm from './signalement-form/signalement-numero/SignalementNumeroForm'
import RecapModal from './RecapModal'
import SignalementDeleteForm from './signalement-form/SignalementDeleteForm'
import { CommuneStatusDTO, Signalement } from '../../api/signalement'
import {
  BANPlateformeResultTypeEnum,
  IBANPlateformeCommune,
  IBANPlateformeLieuDit,
  IBANPlateformeNumero,
  IBANPlateformeResult,
  IBANPlateformeVoie,
} from '../../api/ban-plateforme/types'
import SignalementVoieForm from './signalement-form/signalement-voie/SignalementVoieForm'
import MapContext from '../../contexts/map.context'
import { isToponymeChangesRequested } from '../../utils/signalement.utils'

interface SignalementFormProps {
  signalement: Signalement
  onEditSignalement: (property: keyof Signalement, key: string) => (value: any) => void
  onClose: () => void
  address: IBANPlateformeResult
  hasSignalementChanged: boolean
  mode: CommuneStatusDTO.mode
}

export default function SignalementForm({
  signalement,
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
        (address.type === BANPlateformeResultTypeEnum.LIEU_DIT ? (
          <SignalementToponymeForm
            onClose={onClose}
            onSubmit={handleSubmit}
            onEditSignalement={onEditSignalement}
            signalement={signalement}
            address={address as IBANPlateformeLieuDit}
            hasSignalementChanged={hasSignalementChanged}
            mode={mode}
          />
        ) : address.type === BANPlateformeResultTypeEnum.VOIE ? (
          <SignalementVoieForm
            onClose={onClose}
            onSubmit={handleSubmit}
            onEditSignalement={onEditSignalement}
            signalement={signalement}
            address={address as IBANPlateformeVoie}
            hasSignalementChanged={hasSignalementChanged}
          />
        ) : (
          <SignalementNumeroForm
            onClose={onClose}
            onSubmit={handleSubmit}
            onEditSignalement={onEditSignalement}
            signalement={signalement}
            address={address as IBANPlateformeNumero}
            initialPositionCoords={[
              (address as IBANPlateformeNumero).lon,
              (address as IBANPlateformeNumero).lat,
            ]}
            hasSignalementChanged={hasSignalementChanged}
            mode={mode}
          />
        ))}

      {signalement?.type === Signalement.type.LOCATION_TO_CREATE &&
        (isToponymeChangesRequested(signalement.changesRequested) ? (
          <SignalementToponymeForm
            onClose={onClose}
            onSubmit={handleSubmit}
            onEditSignalement={onEditSignalement}
            signalement={signalement}
            address={address as IBANPlateformeLieuDit}
            hasSignalementChanged={hasSignalementChanged}
            mode={mode}
          />
        ) : (
          <SignalementNumeroForm
            onClose={onClose}
            onSubmit={handleSubmit}
            onEditSignalement={onEditSignalement}
            signalement={signalement}
            address={address as IBANPlateformeCommune}
            hasSignalementChanged={hasSignalementChanged}
            mode={mode}
          />
        ))}

      {signalement?.type === Signalement.type.LOCATION_TO_DELETE && (
        <SignalementDeleteForm
          signalement={signalement}
          address={address}
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
