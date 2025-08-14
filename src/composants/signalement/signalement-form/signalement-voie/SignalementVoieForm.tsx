import { StyledForm } from '../../signalement.styles'
import { Signalement, VoieChangesRequestedDTO } from '../../../../api/signalement'
import React from 'react'
import { getAdresseLabel } from '../../../../utils/adresse.utils'
import { IBANPlateformeVoie } from '../../../../api/ban-plateforme/types'
import { useAsyncBalValidator } from '../../../../hooks/useAsyncBALValidator'
import { Input } from '@codegouvfr/react-dsfr/Input'

interface SignalementVoieFormProps {
  signalement: Signalement
  onEditSignalement: (property: keyof Signalement, key?: string) => (event: string) => void
  onClose: () => void
  address: IBANPlateformeVoie
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  hasSignalementChanged: boolean
}

export default function SignalementVoieForm({
  signalement,
  onEditSignalement,
  onClose,
  address,
  onSubmit,
  hasSignalementChanged,
}: SignalementVoieFormProps) {
  const { nom, comment } = signalement.changesRequested as VoieChangesRequestedDTO
  const { validationErrors, onValidate } = useAsyncBalValidator<VoieChangesRequestedDTO>({
    onSubmit,
  })

  return (
    <StyledForm onSubmit={(event) => onValidate(event)(signalement.changesRequested)}>
      <h4>Demande de modification de la voie</h4>
      <section>
        <div className='form-row'>{getAdresseLabel(address)}</div>
      </section>
      <section>
        <div className='form-row'>
          <Input
            label='Nom*'
            nativeInputProps={{
              required: true,
              name: 'nom',
              value: nom as string,
              onChange: (event) => onEditSignalement('changesRequested', 'nom')(event.target.value),
            }}
            {...(validationErrors?.nom && {
              stateRelatedMessage: validationErrors.nom,
              state: 'error',
            })}
          />
        </div>
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
