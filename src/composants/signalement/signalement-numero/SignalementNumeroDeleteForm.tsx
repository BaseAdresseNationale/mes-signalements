import React, { useMemo } from 'react'
import { getExistingLocationLabel, getInitialSignalement } from '../../../utils/signalement.utils'
import { StyledForm } from '../signalement.styles'
import { Signalement } from '../../../api/signalement'

interface SignalementNumeroDeleteFormProps {
  signalement: Signalement
  onEditSignalement: (property: string, key: string) => (event: string) => void
  onClose: () => void
  address: any
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export default function SignalementNumeroDeleteForm({
  signalement,
  onEditSignalement,
  onClose,
  address,
  onSubmit,
}: SignalementNumeroDeleteFormProps) {
  const isSubmitDisabled = useMemo(() => {
    return (
      JSON.stringify(getInitialSignalement(address, signalement.type)) ===
      JSON.stringify(signalement)
    )
  }, [address, signalement])
  return (
    <StyledForm onSubmit={onSubmit}>
      <h4>Demande de suppression d&apos;un numéro</h4>
      <section>
        <h5>Adresse concernée</h5>
        <div className='form-row'>{getExistingLocationLabel(address)}</div>
        <div className='form-row'>
          {address.codePostal} {address.commune.nom}
        </div>
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
              onChange={(event) =>
                onEditSignalement('changesRequested', 'comment')(event.target.value)
              }
              required
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
