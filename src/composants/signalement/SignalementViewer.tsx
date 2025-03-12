import React, { useEffect, useState } from 'react'
import { ExistingLocation, Signalement } from '../../api/signalement'
import Loader from '../common/Loader'
import { lookup as BANLookup } from '../../api/ban-plateforme'
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
  const [isLoading, setIsLoading] = useState(true)
  const [commune, setCommune] = useState<string>()

  useEffect(() => {
    async function fetchCommune() {
      const commune = (await BANLookup(signalement.codeCommune)) as any
      setCommune(commune.nomCommune)
      setIsLoading(false)
    }

    fetchCommune()
  }, [signalement])

  return isLoading ? (
    <div className='loader-wrapper'>
      <Loader />
    </div>
  ) : commune ? (
    <>
      <SignalementInfos signalement={signalement} />
      {type === Signalement.type.LOCATION_TO_UPDATE &&
        existingLocation?.type === ExistingLocation.type.TOPONYME && (
          <SignalementToponymeUpdateViewer signalement={signalement} commune={commune} />
        )}

      {signalement.type === Signalement.type.LOCATION_TO_UPDATE &&
        existingLocation?.type === ExistingLocation.type.VOIE && (
          <SignalementVoieUpdateViewer signalement={signalement} commune={commune} />
        )}

      {signalement.type === Signalement.type.LOCATION_TO_UPDATE &&
        existingLocation?.type === ExistingLocation.type.NUMERO && (
          <SignalementNumeroUpdateViewer signalement={signalement} commune={commune} />
        )}

      {signalement.type === Signalement.type.LOCATION_TO_CREATE && (
        <SignalementNumeroCreateViewer signalement={signalement} commune={commune} />
      )}

      {signalement.type === Signalement.type.LOCATION_TO_DELETE && (
        <SignalementNumeroDeleteViewer signalement={signalement} commune={commune} />
      )}
    </>
  ) : null
}
