import React from 'react'
import { IBANPlateformeResult, IBANPlateformeVoie } from '../../api/ban-plateforme/types'
import { Signalement } from '../../api/signalement'
import { getExistingLocationLabel } from '../../utils/signalement.utils'
import { Card } from '../common/Card'

interface VoieCardProps {
  adresse: IBANPlateformeVoie
  createSignalement: (type: Signalement.type, adresse: IBANPlateformeResult) => void
}

export function VoieCard({ adresse, createSignalement }: VoieCardProps) {
  return (
    <Card>
      <h1>{getExistingLocationLabel(adresse)}</h1>
      <h2>
        {adresse.commune.nom} - {adresse.commune.code}
      </h2>
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

      <button
        type='button'
        className='fr-btn'
        onClick={() => createSignalement(Signalement.type.LOCATION_TO_UPDATE, adresse)}
      >
        Demander une modification
      </button>

      <button
        type='button'
        className='fr-btn'
        onClick={() => createSignalement(Signalement.type.LOCATION_TO_CREATE, adresse)}
      >
        Signaler un numéro manquant
      </button>
    </Card>
  )
}
