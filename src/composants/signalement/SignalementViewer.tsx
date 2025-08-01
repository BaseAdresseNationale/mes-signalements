import React from 'react'
import { ExistingLocation, Signalement } from '../../api/signalement'
import SignalementNumeroUpdateViewer from './signalement-viewer/signalement-numero/SignalementNumeroUpdateViewer'
import SignalementInfos from './signalement-viewer/SignalementInfos'
import SignalementNumeroDeleteViewer from './signalement-viewer/signalement-numero/SignalementNumeroDeleteViewer'
import SignalementNumeroCreateViewer from './signalement-viewer/signalement-numero/SignalementNumeroCreateViewer'
import SignalementVoieUpdateViewer from './signalement-viewer/signalement-voie/SignalementVoieUpdateViewer'
import SignalementToponymeUpdateViewer from './signalement-viewer/signalement-toponyme/SignalementToponymeUpdateViewer'
import { isToponymeChangesRequested } from '../../utils/signalement.utils'
import SignalementToponymeCreateViewer from './signalement-viewer/signalement-toponyme/SignalementToponymeCreateViewer'
import SignalementVoieDeleteViewer from './signalement-viewer/signalement-voie/SignalementVoieDeleteViewer'
import SignalementToponymeDeleteViewer from './signalement-viewer/signalement-toponyme/SignalementToponymeDeleteViewer'

interface SignalementFormProps {
  signalement: Signalement
}

export default function SignalementViewer({ signalement }: SignalementFormProps) {
  const { type, existingLocation } = signalement

  return (
    <>
      <SignalementInfos signalement={signalement} />
      {type === Signalement.type.LOCATION_TO_UPDATE &&
        (existingLocation?.type === ExistingLocation.type.TOPONYME ? (
          <SignalementToponymeUpdateViewer signalement={signalement} />
        ) : existingLocation?.type === ExistingLocation.type.VOIE ? (
          <SignalementVoieUpdateViewer signalement={signalement} />
        ) : (
          <SignalementNumeroUpdateViewer signalement={signalement} />
        ))}

      {signalement.type === Signalement.type.LOCATION_TO_CREATE &&
        (isToponymeChangesRequested(signalement.changesRequested) ? (
          <SignalementToponymeCreateViewer signalement={signalement} />
        ) : (
          <SignalementNumeroCreateViewer signalement={signalement} />
        ))}

      {signalement.type === Signalement.type.LOCATION_TO_DELETE &&
        (existingLocation?.type === ExistingLocation.type.TOPONYME ? (
          <SignalementToponymeDeleteViewer signalement={signalement} />
        ) : existingLocation?.type === ExistingLocation.type.VOIE ? (
          <SignalementVoieDeleteViewer signalement={signalement} />
        ) : (
          <SignalementNumeroDeleteViewer signalement={signalement} />
        ))}
    </>
  )
}
