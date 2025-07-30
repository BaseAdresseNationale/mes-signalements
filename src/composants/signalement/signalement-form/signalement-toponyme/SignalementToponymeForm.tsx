import { StyledForm } from '../../signalement.styles'
import {
  CommuneStatusDTO,
  Position,
  Signalement,
  ToponymeChangesRequestedDTO,
} from '../../../../api/signalement'
import React from 'react'
import { getAdresseLabel } from '../../../../utils/adresse.utils'
import { IBANPlateformeLieuDit } from '../../../../api/ban-plateforme/types'
import PositionInput from '../../../common/Position/PositionInput'
import ParcelleInput from '../../../common/ParcelleInput'

interface SignalementToponymeFormProps {
  signalement: Signalement
  onEditSignalement: (property: keyof Signalement, key: string) => (value: any) => void
  onClose: () => void
  address: IBANPlateformeLieuDit
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  hasSignalementChanged: boolean
  mode: CommuneStatusDTO.mode
}

export default function SignalementToponymeForm({
  signalement,
  onEditSignalement,
  onClose,
  address,
  onSubmit,
  hasSignalementChanged,
  mode,
}: SignalementToponymeFormProps) {
  const { nom, positions, parcelles, comment } =
    signalement.changesRequested as ToponymeChangesRequestedDTO

  return (
    <StyledForm onSubmit={onSubmit}>
      <h4>Demande de modification du lieu-dit</h4>
      <section>
        <div>{getAdresseLabel(address)}</div>
      </section>
      <section>
        <h5>Modifications demandées</h5>
        <div className='form-row'>
          <div className='fr-input-group'>
            <label className='fr-label' htmlFor='nom'>
              Nom*
            </label>
            <input
              name='nom'
              maxLength={200}
              minLength={3}
              required
              type='text'
              className='fr-input'
              value={nom as string}
              onChange={(event) => onEditSignalement('changesRequested', 'nom')(event.target.value)}
            />
          </div>
        </div>
        <PositionInput
          positions={positions}
          onChange={onEditSignalement('changesRequested', 'positions')}
          defaultPositionType={Position.type.SEGMENT}
          multiPositionDisabled={mode !== CommuneStatusDTO.mode.FULL}
        />
        {mode === CommuneStatusDTO.mode.FULL && <ParcelleInput parcelles={parcelles} />}
      </section>
      <section>
        <div className='form-row'>
          <div className='fr-input-group'>
            <label className='fr-label' htmlFor='comment'>
              Informations complémentaires
            </label>
            <textarea
              className='fr-input'
              name='comment'
              value={comment as string}
              onChange={(event) =>
                onEditSignalement('changesRequested', 'comment')(event.target.value)
              }
              placeholder='Merci de ne pas indiquer de données personnelles'
            />
          </div>
        </div>
      </section>
      <div className='form-controls'>
        <button
          className='fr-btn'
          disabled={!hasSignalementChanged}
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
