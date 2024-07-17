import { StyledForm } from '../signalement.styles'
import { Position, Signalement, ToponymeChangesRequestedDTO } from '../../../api/signalement'
import { getInitialSignalement } from '../../../utils/signalement.utils'
import React, { useContext, useMemo } from 'react'
import { getAdresseLabel } from '../../../utils/adresse.utils'
import { IBANPlateformeLieuDit } from '../../../api/ban-plateforme/types'
import PositionInput from '../../common/PositionInput'
import { blurPosition } from '../../../utils/position.utils'
import MapContext from '../../../contexts/map.context'

interface SignalementToponymeFormProps {
  signalement: Signalement
  onEditSignalement: (property: keyof Signalement, key: string) => (value: any) => void
  onClose: () => void
  address: IBANPlateformeLieuDit
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  initialPositionCoords: number[]
}

export default function SignalementToponymeForm({
  signalement,
  onEditSignalement,
  onClose,
  address,
  onSubmit,
  initialPositionCoords,
}: SignalementToponymeFormProps) {
  const { showCadastre, setShowCadastre, setEditParcelles, editParcelles } = useContext(MapContext)
  const isSubmitDisabled = useMemo(() => {
    return (
      JSON.stringify(getInitialSignalement(address, signalement.type)) ===
      JSON.stringify(signalement)
    )
  }, [address, signalement])

  const { nom, positions, parcelles, comment } =
    signalement.changesRequested as ToponymeChangesRequestedDTO

  const enableParcellesEdition = () => {
    if (!showCadastre) {
      setShowCadastre(true)
    }
    setEditParcelles(true)
  }

  const disableParcellesEdition = () => {
    setEditParcelles(false)
    setShowCadastre(false)
  }

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
                  type: Position.type.SEGMENT,
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
            onClick={editParcelles ? disableParcellesEdition : enableParcellesEdition}
          >
            {editParcelles ? 'Masquer le cadastre' : 'Modifier les parcelles'}
          </button>
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
