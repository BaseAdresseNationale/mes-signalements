import React from 'react'
import { Signalement } from '../../../api/signalement'
import { IBANPlateformeNumero, IBANPlateformeResult } from '../../../api/ban-plateforme/types'
import { Card } from '../../common/Card'
import { getAdresseLabel } from '../../../utils/adresse.utils'
import useNavigateWithPreservedSearchParams from '../../../hooks/useNavigateWithPreservedSearchParams'
import SignalementDisabled from '../../signalement/SignalementDisabled'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Button from '@codegouvfr/react-dsfr/Button'

interface NumeroCardProps {
  adresse: IBANPlateformeNumero
  createSignalement?: (type: Signalement.type, adresse: IBANPlateformeResult) => void
  disabledMessage?: string
}

export function NumeroCard({ adresse, createSignalement, disabledMessage }: NumeroCardProps) {
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
        <li>
          Code postal : <b>{adresse.codePostal}</b>
        </li>
        <li>
          Clé d&apos;interopérabilité : <b>{adresse.id}</b>
        </li>
      </ul>

      {adresse.parcelles?.length > 0 && (
        <div>
          <h3>Parcelles rattachées</h3>
          <div>
            {adresse.parcelles.map((parcelle) => (
              <Badge style={{ marginRight: 4 }} key={parcelle}>
                {parcelle}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3>Certification</h3>
        <p>
          {adresse.certifie ? (
            <>
              <span className='fr-icon-checkbox-circle-line' /> Cette adresse a été certifiée par la
              commune
            </>
          ) : (
            <>Cette adresse n&apos;a pas été certifiée par la commune</>
          )}
        </p>
      </div>

      {createSignalement ? (
        <>
          <Button
            type='button'
            iconId='fr-icon-edit-line'
            onClick={() => createSignalement(Signalement.type.LOCATION_TO_UPDATE, adresse)}
          >
            Modifier l&apos;adresse
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
        <SignalementDisabled message={disabledMessage} />
      )}
    </Card>
  )
}
