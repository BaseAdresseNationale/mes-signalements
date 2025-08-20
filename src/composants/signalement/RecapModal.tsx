import React, { useContext, useState } from 'react'
import { StyledForm } from './signalement.styles'
import { Signalement, SignalementsService, Source } from '../../api/signalement'
import Modal from '../common/Modal'
import SourceContext from '../../contexts/source.context'
import { useFriendlyCaptcha } from '../../hooks/useFriendlyCaptcha'
import { IBANPlateformeResult } from '../../api/ban-plateforme/types'
import SignalementDiffRecap from './SignalementDiffRecap'
import { getModalTitle } from '../../utils/signalement.utils'
import {
  getValueFromLocalStorage,
  LocalStorageKeys,
  removeValueFromLocalStorage,
  setValueInLocalStorage,
} from '../../utils/localStorage.utils'
import { Checkbox } from '@codegouvfr/react-dsfr/Checkbox'
import { Input } from '@codegouvfr/react-dsfr/Input'

interface SignalementRecapModalProps {
  signalement: Signalement
  onEditSignalement: (property: keyof Signalement, key?: string) => (event: string) => void
  onCloseModal: () => void
  address: IBANPlateformeResult
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
  const [saveContact, setSaveContact] = useState(
    Boolean(getValueFromLocalStorage(LocalStorageKeys.AUTHOR_CONTACT)),
  )

  const { CaptchaWidget } = useFriendlyCaptcha({
    siteKey: process.env.REACT_APP_FRIENDLY_CAPTCHA_SITE_KEY || '',
    showAttribution: false,
    language: 'fr',
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitStatus('loading')
    try {
      const sourceId = source?.id || process.env.REACT_APP_API_SIGNALEMENT_SOURCE_ID
      await SignalementsService.createSignalement(signalement, sourceId)
      if (saveContact && signalement.author) {
        setValueInLocalStorage(LocalStorageKeys.AUTHOR_CONTACT, {
          lastName: signalement.author.lastName,
          firstName: signalement.author.firstName,
          email: signalement.author.email,
        })
      } else {
        removeValueFromLocalStorage(LocalStorageKeys.AUTHOR_CONTACT)
      }
      setSubmitStatus('success')
    } catch (error) {
      console.error(error)
      setSubmitStatus('error')
    }
  }

  return (
    <Modal
      title={getModalTitle(signalement)}
      onClose={submitStatus === 'success' ? onClose : onCloseModal}
    >
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
              <Input
                label='Nom*'
                nativeInputProps={{
                  required: true,
                  name: 'lastName',
                  value: signalement.author?.lastName || '',
                  onChange: (event) => onEditSignalement('author', 'lastName')(event.target.value),
                }}
              />
              <Input
                label='Prénom*'
                nativeInputProps={{
                  required: true,
                  name: 'firstName',
                  value: signalement.author?.firstName || '',
                  onChange: (event) => onEditSignalement('author', 'firstName')(event.target.value),
                }}
              />
            </div>
            <div className='form-row'>
              <Input
                label='Email*'
                nativeInputProps={{
                  required: true,
                  name: 'email',
                  type: 'email',
                  value: signalement.author?.email || '',
                  onChange: (event) => onEditSignalement('author', 'email')(event.target.value),
                }}
              />
            </div>
            <div className='form-row'>
              <Checkbox
                small
                options={[
                  {
                    label: 'Enregistrer ces informations',
                    hintText:
                      'Le formulaire de contact sera pré-rempli lors des prochains signalements',
                    nativeInputProps: {
                      name: 'save-contact',
                      checked: saveContact,
                      onChange: (event) => {
                        setSaveContact(event.target.checked)
                      },
                    },
                  },
                ]}
              />
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
