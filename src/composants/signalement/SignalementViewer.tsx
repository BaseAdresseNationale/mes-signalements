import React from 'react'
import { ExistingLocation, Signalement } from '../../api/signalement'
import SignalementNumeroUpdateViewer from './signalement-viewer/signalement-numero/SignalementNumeroUpdateViewer'
import SignalementInfos from './signalement-viewer/SignalementInfos'
import SignalementNumeroDeleteViewer from './signalement-viewer/signalement-numero/SignalementNumeroDeleteViewer'
import SignalementNumeroCreateViewer from './signalement-viewer/signalement-numero/SignalementNumeroCreateViewer'
import SignalementVoieUpdateViewer from './signalement-viewer/signalement-voie/SignalementVoieUpdateViewer'
import SignalementToponymeUpdateViewer from './signalement-viewer/signalement-toponyme/SignalementToponymeUpdateViewer'

interface SignalementFormProps {
  signalement: Signalement
}

export default function SignalementViewer({ signalement }: SignalementFormProps) {
  const { type, existingLocation } = signalement

  return (
    <>
      <SignalementInfos signalement={signalement} />
      {type === Signalement.type.LOCATION_TO_UPDATE &&
        existingLocation?.type === ExistingLocation.type.TOPONYME && (
          <SignalementToponymeUpdateViewer signalement={signalement} />
        )}

      {signalement.type === Signalement.type.LOCATION_TO_UPDATE &&
        existingLocation?.type === ExistingLocation.type.VOIE && (
          <SignalementVoieUpdateViewer signalement={signalement} />
        )}

      {signalement.type === Signalement.type.LOCATION_TO_UPDATE &&
        existingLocation?.type === ExistingLocation.type.NUMERO && (
          <SignalementNumeroUpdateViewer signalement={signalement} />
        )}

      {signalement.type === Signalement.type.LOCATION_TO_CREATE && (
        <SignalementNumeroCreateViewer signalement={signalement} />
      )}

      {signalement.type === Signalement.type.LOCATION_TO_DELETE && (
        <SignalementNumeroDeleteViewer signalement={signalement} />
      )}
    </>
  )
}
