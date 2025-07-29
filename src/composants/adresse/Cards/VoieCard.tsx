import React from 'react'
import { IBANPlateformeResult, IBANPlateformeVoie } from '../../../api/ban-plateforme/types'
import { Signalement } from '../../../api/signalement'
import { Card } from '../../common/Card'
import { getAdresseLabel } from '../../../utils/adresse.utils'
import SignalementDisabled from '../../signalement/SignalementDisabled'
import useNavigateWithPreservedSearchParams from '../../../hooks/useNavigateWithPreservedSearchParams'
import Button from '@codegouvfr/react-dsfr/Button'
import { List } from '../../common/List'

interface VoieCardProps {
  adresse: IBANPlateformeVoie
  createSignalement?: (type: Signalement.type, adresse: IBANPlateformeResult) => void
}

export function VoieCard({ adresse, createSignalement }: VoieCardProps) {
  const { navigate } = useNavigateWithPreservedSearchParams()

  return (
    <Card>
      <h2 style={{ lineHeight: 'normal' }}>{getAdresseLabel(adresse, { navigateFn: navigate })}</h2>
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
          <Button
            type='button'
            iconId='fr-icon-add-line'
            onClick={() => createSignalement(Signalement.type.LOCATION_TO_CREATE, adresse)}
          >
            Ajouter un numéro manquant
          </Button>

          <Button
            type='button'
            iconId='fr-icon-edit-line'
            onClick={() => createSignalement(Signalement.type.LOCATION_TO_UPDATE, adresse)}
            priority='secondary'
          >
            Modifier le nom de la voie
          </Button>

          <Button
            type='button'
            iconId='fr-icon-delete-line'
            priority='secondary'
            onClick={() => createSignalement(Signalement.type.LOCATION_TO_DELETE, adresse)}
          >
            Demander la suppression
          </Button>
        </>
      ) : (
        <SignalementDisabled />
      )}

      <List
        items={adresse.numeros}
        headers={['Numéro', 'Certifié par la commune']}
        noFilterMatchMessage='Aucun numéro ne correspond à ce filtrage'
        title={
          adresse.numeros.length === 0
            ? "Aucun numéro n'est répertorié pour cette commune"
            : adresse.numeros.length === 1
              ? '1 numéro répertorié'
              : `${adresse.numeros.length} numéros répertoriées`
        }
        filter={{
          placeholder: 'Filtrer les numéros',
          filterFn: ({ numero, suffixe }) => (suffixe ? `${numero} ${suffixe}` : `${numero}`),
        }}
        renderItem={({ id, numero, suffixe, certifie }) => (
          <tr onClick={() => navigate(`/${id}`)} className='list-row' key={id}>
            <td>{suffixe ? `${numero} ${suffixe}` : numero}</td>
            <td>{certifie ? <span className='fr-icon-checkbox-circle-line' /> : ''}</td>
          </tr>
        )}
      />
    </Card>
  )
}
