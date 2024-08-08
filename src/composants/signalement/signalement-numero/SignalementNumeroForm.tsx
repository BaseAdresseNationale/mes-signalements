import React, { useMemo } from 'react'
import { StyledForm } from '../signalement.styles'
import PositionInput from '../../common/Position/PositionInput'
import { NumeroChangesRequestedDTO, Signalement } from '../../../api/signalement'
import { IBANPlateformeNumero, IBANPlateformeVoie } from '../../../api/ban-plateforme/types'
import ComplementInputProps from '../../common/ComplementInput'
import ParcelleInput from '../../common/ParcelleInput'
import { getAdresseLabel } from '../../../utils/adresse.utils'

interface SignalementNumeroFormProps {
  signalement: Signalement
  onEditSignalement: (property: keyof Signalement, key: string) => (value: any) => void
  onClose: () => void
  address: IBANPlateformeNumero | IBANPlateformeVoie
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  initialPositionCoords: number[]
  hasSignalementChanged: boolean
}

export default function SignalementNumeroForm({
  signalement,
  onEditSignalement,
  onClose,
  address,
  onSubmit,
  initialPositionCoords,
  hasSignalementChanged,
}: SignalementNumeroFormProps) {
  const isCreation = !address

  const isSubmitDisabled = useMemo(() => {
    const { changesRequested } = signalement
    const isDisabled = (changesRequested as NumeroChangesRequestedDTO).positions?.length === 0
    if (isCreation) {
      return isDisabled
    }

    return isDisabled || !hasSignalementChanged
  }, [hasSignalementChanged, signalement, isCreation])

  const { numero, suffixe, nomVoie, nomComplement, positions, parcelles, comment } =
    signalement.changesRequested as NumeroChangesRequestedDTO

  return (
    <StyledForm onSubmit={onSubmit}>
      {isCreation ? (
        <h5>Demande de création d&apos;une adresse</h5>
      ) : (
        <>
          <h5>Demande de modification pour l&apos;adresse</h5>
          <section>
            <div>{getAdresseLabel(address)}</div>
          </section>
        </>
      )}
      <section>
        {!isCreation && <h5>Modifications demandées</h5>}
        <div className='form-row' style={{ marginBottom: 0 }}>
          <div className='fr-input-group'>
            <label className='fr-label' htmlFor='numero'>
              Numéro*
            </label>
            <input
              className='fr-input'
              name='numero'
              required
              min={1}
              max={9998}
              type='number'
              value={numero || ''}
              onChange={(event) =>
                onEditSignalement('changesRequested', 'numero')(event.target.value)
              }
            />
          </div>
          <div className='fr-input-group'>
            <label className='fr-label' htmlFor='suffixe'>
              Suffixe
            </label>
            <input
              name='suffixe'
              className='fr-input'
              value={suffixe as string}
              placeholder={'bis, ter...'}
              onChange={(event) =>
                onEditSignalement('changesRequested', 'suffixe')(event.target.value)
              }
            />
          </div>
        </div>
        <div className='form-row'>
          <div className='fr-input-group'>
            <label className='fr-label' htmlFor='nomVoie'>
              Nom de la voie*
            </label>
            <input
              className='fr-input'
              name='nomVoie'
              required
              disabled={isCreation}
              value={nomVoie as string}
              onChange={(event) =>
                onEditSignalement('changesRequested', 'nomVoie')(event.target.value)
              }
            />
          </div>
        </div>
        <ComplementInputProps
          address={address}
          value={nomComplement ?? ''}
          onChange={(event) => onEditSignalement('changesRequested', 'nomComplement')(event)}
        />
        <PositionInput
          positions={positions}
          onChange={onEditSignalement('changesRequested', 'positions')}
          initialPositionCoords={initialPositionCoords}
        />
        <ParcelleInput parcelles={parcelles} />
      </section>
      <section>
        <div className='form-row'>
          <div className='fr-input-group'>
            <label className='fr-label' htmlFor='comment'>
              Autres informations
            </label>
            <textarea
              className='fr-input'
              name='comment'
              value={comment as string}
              onChange={(event) =>
                onEditSignalement('changesRequested', 'comment')(event.target.value)
              }
              placeholder="Informations complémentaires sur le problème d'adressage (facultatif)"
            />
          </div>
        </div>
      </section>
      <div className='form-controls'>
        <button
          className='fr-btn'
          disabled={isSubmitDisabled}
          style={{ color: 'white' }}
          type='submit'
        >
          Envoyer le signalement
        </button>
        <button className='fr-btn' type='button' onClick={onClose}>
          Annuler
        </button>
      </div>
    </StyledForm>
  )
}
