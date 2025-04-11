import React from 'react'
import { StyledForm } from '../../signalement.styles'
import { Signalement } from '../../../../api/signalement'
import { getAdresseLabel } from '../../../../utils/adresse.utils'
import { IBANPlateformeNumero } from '../../../../api/ban-plateforme/types'

interface SignalementNumeroDeleteFormProps {
  signalement: Signalement
  onEditSignalement: (property: keyof Signalement, key: string) => (event: string) => void
  onClose: () => void
  address: IBANPlateformeNumero
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export default function SignalementNumeroDeleteForm({
  signalement,
  onEditSignalement,
  onClose,
  address,
  onSubmit,
}: SignalementNumeroDeleteFormProps) {
  const { comment } = signalement.changesRequested

  return (
    <StyledForm onSubmit={onSubmit}>
      <h4>Demande de suppression d&apos;un numéro</h4>
      <section>
        <h5>Adresse concernée</h5>
        <div>{getAdresseLabel(address)}</div>
      </section>
      <section>
        <div className='form-row'>
          <div className='fr-input-group'>
            <label className='fr-label' htmlFor='comment'>
              Raisons de la suppression*
            </label>
            <textarea
              className='fr-input'
              name='comment'
              value={comment as string}
              onChange={(event) =>
                onEditSignalement('changesRequested', 'comment')(event.target.value)
              }
              required
              placeholder='Merci de ne pas indiquer de données personnelles'
            />
          </div>
        </div>
      </section>
      <div className='form-controls'>
        <button className='fr-btn' disabled={!comment?.trim()} style={{ color: 'white' }} type='submit'>
          Envoyer le signalement
        </button>
        <button className='fr-btn' type='button' onClick={onClose}>
          Annuler
        </button>
      </div>
    </StyledForm>
  )
}
