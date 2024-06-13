import { StyledForm } from '../signalement.styles'
import { Signalement } from '../../../api/signalement'
import { getExistingLocationLabel, getInitialSignalement } from '../../../utils/signalement.utils'
import React, { useMemo } from 'react'

interface SignalementToponymeFormProps {
  signalement: Signalement
  onEditSignalement: (property: string, key: string) => (event: string) => void
  onClose: () => void
  address: any
  onSubmit: any
}

export default function SignalementToponymeForm({
  signalement,
  onEditSignalement,
  onClose,
  address,
  onSubmit,
}: SignalementToponymeFormProps) {
  const isSubmitDisabled = useMemo(() => {
    return (
      JSON.stringify(getInitialSignalement(address, signalement.type)) ===
      JSON.stringify(signalement)
    )
  }, [address, signalement])

  const { nom } = signalement.changesRequested

  return (
    <StyledForm onSubmit={onSubmit}>
      <h4>Signalement d&apos;un problème d&apos;adressage</h4>
      <section>
        <h5>Lieu concernée</h5>
        <div className='form-row'>{getExistingLocationLabel(address)}</div>
        <div className='form-row'>{address.commune.nom}</div>
      </section>
      <section>
        <h5>Modifications demandées</h5>
        <div className='form-row'>
          <div className='fr-input-group'>
            <label className='fr-label' htmlFor='nom'>
              Nom
            </label>
            <input
              name='nom'
              required
              type='text'
              className='fr-input'
              value={nom as string}
              onChange={(event) => onEditSignalement('changesRequested', 'nom')(event.target.value)}
            />
          </div>
        </div>
        {/* <h6>Positions :</h6>
        {positions.map(({position, positionType}, index) => (
          <PositionInput
            key={index} // eslint-disable-line react/no-array-index-key
            position={position}
            positionType={positionType}
            onEditPositionType={updatedPosition => {
              const newPositions = [...positions]
              newPositions[index] = updatedPosition
              onEditSignalement('changesRequested', 'positions')(newPositions)
            }}
            onDelete={() => {
              onEditSignalement('changesRequested', 'positions')(positions.filter((_, i) => i !== index))
            }} />
        ))}
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button
            type='button'
            style={{color: 'white', marginBottom: 10}}
            onClick={() => onEditSignalement('changesRequested', 'positions')([...positions, {position: {type: 'Point', coordinates: blurPosition(initialPositionCoords)}, positionType: 'entrée'}])}
          >
            Ajouter une position
          </Button>
        </div>
        <h6>Parcelles cadastrales :</h6>
        <div className='parcelles-wrapper'>
          {parcelles.map(parcelle => (
            <div key={parcelle}>
              {parcelle}
            </div>
          ))}
        </div> */}
        {/* <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button
            type='button'
            style={{color: 'white', marginBottom: 10}}
            onClick={() => setIsEditParcellesMode(!isEditParcellesMode)}
          >
            {isEditParcellesMode ? 'Arrêter de modifier les parcelles' : 'Modifier les parcelles'}
          </Button>
        </div> */}
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
