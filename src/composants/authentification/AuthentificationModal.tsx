import React, { useContext, useState } from 'react'
import Modal from '../common/Modal'
import styled from 'styled-components'
import SourceContext from '../../contexts/source.context'

const StyledWrapper = styled.form`
  .form-control {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-top: 20px;

    > button:last-of-type {
      margin-left: 10px;
    }
  }

  .fr-alert {
    margin-top: 20px;
  }
`

interface AuthentificationModal {
  onClose: () => void
}

export function AuthentificationModal({ onClose }: AuthentificationModal) {
  const [token, setToken] = useState('')
  const [submitStatus, setSubmitStatus] = useState<string | null>(null)
  const { fetchSourceByToken } = useContext(SourceContext)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitStatus('loading')
    try {
      await fetchSourceByToken(token)
      setSubmitStatus('success')
      onClose()
    } catch (error) {
      setSubmitStatus('error')
    }
  }

  return (
    <Modal title='Connexion' onClose={onClose}>
      <StyledWrapper onSubmit={handleSubmit}>
        <p>Connectez-vous pour accéder à vos signalements.</p>
        <label className='fr-label' htmlFor='nomVoie'>
          Renseignez votre jeton d&apos;accès
        </label>
        <input
          className='fr-input'
          type='password'
          name='token'
          required
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
        {submitStatus === 'success' && (
          <div className='fr-alert fr-alert--success'>
            <p>Authentification réussie</p>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className='fr-alert fr-alert--error'>
            <p>Le jeton est incorrect</p>
          </div>
        )}
        <div className='form-control'>
          <button className='fr-btn fr-btn--secondary' onClick={onClose} type='button'>
            Annuler
          </button>
          <button
            className='fr-btn'
            type='submit'
            disabled={submitStatus === 'loading' || submitStatus === 'success'}
          >
            Se connecter
          </button>
        </div>
      </StyledWrapper>
    </Modal>
  )
}
