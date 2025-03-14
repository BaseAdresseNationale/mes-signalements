import React from 'react'
import { IBANPlateformeResult, IBANPlateformeVoie } from '../../api/ban-plateforme/types'
import { Signalement } from '../../api/signalement'
import { Card } from '../common/Card'
import { getAdresseLabel } from '../../utils/adresse.utils'
import { ListNumeros } from './ListNumeros'
import SignalementDisabled from '../signalement/SignalementDisabled'

interface VoieCardProps {
  adresse: IBANPlateformeVoie
  createSignalement?: (type: Signalement.type, adresse: IBANPlateformeResult) => void
}

export function VoieCard({ adresse, createSignalement }: VoieCardProps) {
  return (
    <Card>
      <h2 style={{ lineHeight: 'normal' }}>{getAdresseLabel(adresse)}</h2>
      <ul>
        <li>
          Région : <b>{adresse.commune.region.nom}</b>
        </li>
        <li>
          Département :{' '}
          <b>
            {adresse.commune.departement.nom} ({adresse.commune.departement.code})
          </b>
        </li>
      </ul>

      {createSignalement ? (
        <>
          <button
            type='button'
            className='fr-btn'
            onClick={() => createSignalement(Signalement.type.LOCATION_TO_UPDATE, adresse)}
          >
            Modifier le nom de la voie
          </button>

          <button
            type='button'
            className='fr-btn'
            onClick={() => createSignalement(Signalement.type.LOCATION_TO_CREATE, adresse)}
          >
            Ajouter un numéro manquant
          </button>
        </>
      ) : (
        <SignalementDisabled />
      )}

      <ListNumeros adresse={adresse} />
    </Card>
  )
}
