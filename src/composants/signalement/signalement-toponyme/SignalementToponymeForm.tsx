import { StyledForm } from '../signalement.styles'
import { Signalement, ToponymeChangesRequestedDTO } from '../../../api/signalement'
import { getInitialSignalement } from '../../../utils/signalement.utils'
import React, { useMemo } from 'react'
import { getAdresseLabel } from '../../../utils/adresse.utils'

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

  const { nom, comment } = signalement.changesRequested as ToponymeChangesRequestedDTO

  return (
    <StyledForm onSubmit={onSubmit}>
      <h4>Demande de modification du lieu-dit : </h4>
      <section>
        <div className='form-row'>{getAdresseLabel(address)}</div>
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
            {isEditParcellesMode ? 'Masquer le cadastre' : 'Modifier les parcelles'}
          </Button>
        </div> */}
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
