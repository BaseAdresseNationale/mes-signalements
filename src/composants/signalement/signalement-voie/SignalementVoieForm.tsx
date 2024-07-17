import { StyledForm } from '../signalement.styles'
import { Signalement, VoieChangesRequestedDTO } from '../../../api/signalement'
import { getInitialSignalement } from '../../../utils/signalement.utils'
import React, { useMemo } from 'react'
import { getAdresseLabel } from '../../../utils/adresse.utils'
import { IBANPlateformeVoie } from '../../../api/ban-plateforme/types'

interface SignalementVoieFormProps {
  signalement: Signalement
  onEditSignalement: (property: keyof Signalement, key: string) => (event: string) => void
  onClose: () => void
  address: IBANPlateformeVoie
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export default function SignalementVoieForm({
  signalement,
  onEditSignalement,
  onClose,
  address,
  onSubmit,
}: SignalementVoieFormProps) {
  const isSubmitDisabled = useMemo(() => {
    return (
      JSON.stringify(getInitialSignalement(address, signalement.type)) ===
      JSON.stringify(signalement)
    )
  }, [address, signalement])

  const { nom, comment } = signalement.changesRequested as VoieChangesRequestedDTO

  return (
    <StyledForm onSubmit={onSubmit}>
      <h4>Demande de modification de la voie : </h4>
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
