import React, { useMemo } from 'react'
import { StyledForm } from '../signalement.styles'
import PositionInput from '../../common/PositionInput'
import { NumeroChangesRequestedDTO, Position, Signalement } from '../../../api/signalement'
import { getInitialSignalement } from '../../../utils/signalement.utils'
import { blurPosition } from '../../../utils/position.utils'
import { getAdresseLabel } from '../../../utils/adresse.utils'
import { IBANPlateformeNumero, IBANPlateformeVoie } from '../../../api/ban-plateforme/types'

interface SignalementNumeroFormProps {
  signalement: Signalement
  onEditSignalement: (property: string, key: string) => (value: any) => void
  onClose: () => void
  address?: IBANPlateformeNumero | IBANPlateformeVoie
  setIsEditParcellesMode: (isEditParcellesMode: boolean) => void
  isEditParcellesMode: boolean
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  initialPositionCoords: number[]
}

export default function SignalementNumeroForm({
  signalement,
  onEditSignalement,
  onClose,
  address,
  setIsEditParcellesMode,
  isEditParcellesMode,
  onSubmit,
  initialPositionCoords,
}: SignalementNumeroFormProps) {
  const isCreation = !address

  const isSubmitDisabled = useMemo(() => {
    const { changesRequested } = signalement
    const isDisabled = (changesRequested as NumeroChangesRequestedDTO).positions?.length === 0
    if (isCreation) {
      return isDisabled
    }

    return (
      isDisabled ||
      JSON.stringify(getInitialSignalement(address, signalement.type)) ===
        JSON.stringify(signalement)
    )
  }, [address, signalement, isCreation])

  const { numero, suffixe, nomVoie, positions, parcelles, comment } =
    signalement.changesRequested as NumeroChangesRequestedDTO

  return (
    <StyledForm onSubmit={onSubmit}>
      {isCreation ? (
        <h4>Demande de création d&apos;une adresse</h4>
      ) : (
        <>
          <h4>Demande de modification pour l&apos;adresse : </h4>
          <section>
            <div className='form-row'>{getAdresseLabel(address)}</div>
            <div className='form-row'>
              {address.codePostal} {address.commune.nom}
            </div>
          </section>
        </>
      )}

      <section>
        {!isCreation && <h5>Modifications demandées</h5>}
        <div className='form-row'>
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
        <h6>Positions :</h6>
        {positions?.map(({ point, type }, index) => (
          <PositionInput
            key={index} // eslint-disable-line react/no-array-index-key
            point={point}
            type={type}
            onEditPositionType={(updatedPosition) => {
              const newPositions = [...positions]
              newPositions[index] = updatedPosition
              onEditSignalement('changesRequested', 'positions')(newPositions)
            }}
            onDelete={() => {
              onEditSignalement(
                'changesRequested',
                'positions',
              )(positions.filter((_, i) => i !== index))
            }}
          />
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type='button'
            className='fr-btn'
            style={{ color: 'white', marginBottom: 10 }}
            onClick={() =>
              onEditSignalement(
                'changesRequested',
                'positions',
              )([
                ...(positions as Position[]),
                {
                  point: {
                    type: 'Point',
                    coordinates: blurPosition(initialPositionCoords),
                  },
                  type: Position.type.ENTR_E,
                },
              ])
            }
          >
            Ajouter une position
          </button>
        </div>
        <h6>Parcelles cadastrales :</h6>
        <div className='parcelles-wrapper'>
          {parcelles?.map((parcelle) => <div key={parcelle}>{parcelle}</div>)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className='fr-btn'
            type='button'
            style={{ color: 'white', marginBottom: 10 }}
            onClick={() => setIsEditParcellesMode(!isEditParcellesMode)}
          >
            {isEditParcellesMode ? 'Masquer le cadastre' : 'Modifier les parcelles'}
          </button>
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
