import React from 'react'
import { IBANPlateformeCommune } from '../../../api/ban-plateforme/types'
import { ExistingLocation, Signalement } from '../../../api/signalement'
import { Card } from '../../common/Card'
import SignalementDisabled from '../../signalement/SignalementDisabled'
import Button from '@codegouvfr/react-dsfr/Button'
import { List } from '../../common/List'
import useNavigateWithPreservedSearchParams from '../../../hooks/useNavigateWithPreservedSearchParams'
import { ChangesRequested } from '../../../types/signalement.types'

interface CommuneCardProps {
  adresse: IBANPlateformeCommune
  createSignalement?: (
    type: Signalement.type,
    adresse: IBANPlateformeCommune,
    changesRequested?: ChangesRequested,
    creationType?: ExistingLocation.type,
  ) => void
}

export function CommuneCard({ adresse, createSignalement }: CommuneCardProps) {
  const { navigate } = useNavigateWithPreservedSearchParams()

  return (
    <Card>
      <h1>
        {adresse.nomCommune} ({adresse.codeCommune})
      </h1>
      <ul>
        <li>
          Région : <b>{adresse.region.nom}</b>
        </li>
        <li>
          Département :{' '}
          <b>
            {adresse.departement.nom} ({adresse.departement.code})
          </b>
        </li>
      </ul>
      {createSignalement ? (
        <>
          <Button
            type='button'
            iconId='fr-icon-add-line'
            onClick={() => createSignalement(Signalement.type.LOCATION_TO_CREATE, adresse)}
          >
            Demander la création d&apos;une adresse
          </Button>
          <Button
            type='button'
            iconId='fr-icon-add-line'
            onClick={() =>
              createSignalement(
                Signalement.type.LOCATION_TO_CREATE,
                adresse,
                undefined,
                ExistingLocation.type.TOPONYME,
              )
            }
            priority='secondary'
          >
            Demander la création d&apos;un lieu-dit
          </Button>
        </>
      ) : (
        <SignalementDisabled />
      )}
      <List
        items={adresse.voies}
        headers={['Nom', 'Type']}
        noFilterMatchMessage='Aucun toponyme ne correspond à ce filtrage'
        title={
          adresse.voies.length === 0
            ? "Aucun toponyme n'est répertorié pour cette commune"
            : adresse.voies.length === 1
              ? '1 toponyme répertorié'
              : `${adresse.voies.length} toponymes répertoriées`
        }
        filter={{ placeholder: 'Filtrer les toponymes', filterFn: ({ nomVoie }) => nomVoie }}
        renderItem={({ id, nomVoie, type }) => (
          <tr onClick={() => navigate(`/${id}`)} className='list-row' key={id}>
            <td>{nomVoie}</td>
            <td>{type}</td>
          </tr>
        )}
      />
    </Card>
  )
}
