import React from 'react'
import { IBANPlateformeLieuDit, IBANPlateformeResult } from '../../api/ban-plateforme/types'
import { Signalement } from '../../api/signalement'
import { Card } from '../common/Card'
import { getAdresseLabel } from '../../utils/adresse.utils'
import { ListNumeros } from './ListNumeros'

interface LieuDitCardProps {
  adresse: IBANPlateformeLieuDit
  createSignalement: (type: Signalement.type, adresse: IBANPlateformeResult) => void
}

export function LieuDitCard({ adresse, createSignalement }: LieuDitCardProps) {
  return (
    <Card>
      <h1>{getAdresseLabel(adresse)}</h1>
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

      <ListNumeros adresse={adresse} />
    </Card>
  )
}
