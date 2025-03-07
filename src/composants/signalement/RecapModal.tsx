import React, { useContext, useState } from 'react'
import { StyledForm } from './signalement.styles'

import {
  CreateSignalementDTO,
  Signalement,
  SignalementsService,
  Source,
} from '../../api/signalement'
import Modal from '../common/Modal'
import SourceContext from '../../contexts/source.context'
import { useFriendlyCaptcha } from '../../hooks/useFriendlyCaptcha'
import {
  IBANPlateformeLieuDit,
  IBANPlateformeNumero,
  IBANPlateformeVoie,
} from '../../api/ban-plateforme/types'
import SignalementDiffRecap from './SignalementDiffRecap'

interface SignalementRecapModalProps {
  signalement: Signalement
  onEditSignalement: (property: keyof Signalement, key: string) => (event: string) => void
  onCloseModal: () => void
  address: IBANPlateformeNumero | IBANPlateformeVoie | IBANPlateformeLieuDit
  onClose: () => void
}

export default function SignalementRecapModal({
  signalement,
  onEditSignalement,
  onCloseModal,
  address,
  onClose,
}: SignalementRecapModalProps) {
  const [submitStatus, setSubmitStatus] = useState<string | null>(null)
  const { source } = useContext(SourceContext)
  const { CaptchaWidget } = useFriendlyCaptcha({
    siteKey: process.env.REACT_APP_FRIENDLY_CAPTCHA_SITE_KEY || '',
    showAttribution: false,
    language: 'fr',
  })

  const getModalTitle = () => {
    switch (signalement.type) {
      case Signalement.type.LOCATION_TO_UPDATE:
        return 'Demande de modification'
      case Signalement.type.LOCATION_TO_CREATE:
        return 'Demande de création'
      case Signalement.type.LOCATION_TO_DELETE:
        return 'Demande de suppression'
      default:
        return 'Demande de signalement'
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitStatus('loading')
    try {
      const sourceId = source?.id || process.env.REACT_APP_API_SIGNALEMENT_SOURCE_ID
      await SignalementsService.createSignalement(signalement as CreateSignalementDTO, sourceId)
      setSubmitStatus('success')
    } catch (error) {
      console.error(error)
      setSubmitStatus('error')
    }
  }

  return (
    <Modal title={getModalTitle()} onClose={submitStatus === 'success' ? onClose : onCloseModal}>
      <StyledForm onSubmit={handleSubmit}>
        <SignalementDiffRecap signalement={signalement} address={address} />
        {source?.type !== Source.type.PRIVATE && (
          <section>
            <h4>Contact</h4>
            <p>
              Laissez nous vos coordonnées pour que nous puissions vous tenir informé de l&apos;état
              d&apos;avancement de votre signalement.
            </p>
            <div className='form-row'>
              <div className='fr-input-group'>
                <label className='fr-label' htmlFor='lastName'>
                  Nom*
                </label>
                <input
                  required
                  name='lastName'
                  className='fr-input'
                  value={signalement.author?.lastName || ''}
                  onChange={(event) => onEditSignalement('author', 'lastName')(event.target.value)}
                />
              </div>
              <div className='fr-input-group'>
                <label className='fr-label' htmlFor='firstName'>
                  Prénom*
                </label>
                <input
                  required
                  name='firstName'
                  className='fr-input'
                  value={signalement.author?.firstName || ''}
                  onChange={(event) => onEditSignalement('author', 'firstName')(event.target.value)}
                />
              </div>
            </div>
            <div className='form-row'>
              <div className='fr-input-group'>
                <label className='fr-label' htmlFor='email'>
                  Email*
                </label>
                <input
                  required
                  name='email'
                  className='fr-input'
                  type='email'
                  value={signalement.author?.email || ''}
                  onChange={(event) => onEditSignalement('author', 'email')(event.target.value)}
                />
              </div>
            </div>

            <div className='captcha-wrapper'>
              <CaptchaWidget
                solvedHandler={(token) => onEditSignalement('author', 'captchaToken')(token)}
              />
            </div>
          </section>
        )}
        {submitStatus === 'success' && (
          <>
            <p className='send-date'>
              Date d&apos;envoi : <b>{new Date().toLocaleDateString()}</b>
            </p>
            <div className='fr-alert fr-alert--success'>
              <p>Votre signalement a bien été envoyée.</p>
            </div>
          </>
        )}
        {submitStatus === 'error' && (
          <div className='fr-alert fr-alert--error'>
            <p>
              Une erreur est survenue lors de l&apos;envoi de votre signalement. Veuillez réessayer
              ultérieurement.
            </p>
          </div>
        )}
        <div className='form-controls' style={{ justifyContent: 'flex-start' }}>
          {submitStatus !== 'success' ? (
            <>
              <button
                className='fr-btn'
                disabled={submitStatus === 'loading' || submitStatus === 'success'}
                type='submit'
              >
                Envoyer le signalement
              </button>

              <button className='fr-btn fr-btn--tertiary' type='button' onClick={onCloseModal}>
                Annuler
              </button>
            </>
          ) : (
            <>
              <button className='fr-btn ' type='button' onClick={() => window.print()}>
                Imprimer le récapitulatif
              </button>
              <button className='fr-btn fr-btn--tertiary' type='button' onClick={onClose}>
                Quitter
              </button>
            </>
          )}
        </div>
      </StyledForm>
    </Modal>
  )
}
