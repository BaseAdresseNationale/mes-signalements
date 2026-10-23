import React, { useContext, useEffect, useRef, useState } from 'react'
import { StyledForm } from './signalement.styles'
import { Signalement, SignalementsService, Source } from '../../api/signalement'
import SourceContext from '../../contexts/source.context'
import { useFriendlyCaptcha } from '../../hooks/useFriendlyCaptcha'
import SignalementViewer from './SignalementViewer'
import {
  getValueFromLocalStorage,
  LocalStorageKeys,
  removeValueFromLocalStorage,
  setValueInLocalStorage,
} from '../../utils/localStorage.utils'
import { ReportRole } from '../../utils/report.utils'
import { Checkbox } from '@codegouvfr/react-dsfr/Checkbox'
import { Input } from '@codegouvfr/react-dsfr/Input'
import MapContext from '../../contexts/map.context'
import Alert from '@codegouvfr/react-dsfr/Alert'

interface SignalementRecapProps {
  signalement: Signalement
  onEditSignalement: (property: keyof Signalement, key?: string) => (event: string) => void
  activeRole: ReportRole
  onActiveRoleChange: (role: ReportRole) => void
  onBack: () => void
  onClose: () => void
}

export default function SignalementRecap({
  signalement,
  onEditSignalement,
  activeRole,
  onActiveRoleChange,
  onBack,
  onClose,
}: Readonly<SignalementRecapProps>) {
  const [submitStatus, setSubmitStatus] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Active les styles d'impression du récapitulatif (carte masquée, drawer pleine page).
  useEffect(() => {
    document.body.classList.add('print-recap')
    return () => document.body.classList.remove('print-recap')
  }, [])

  // Le drawer (ou la sheet mobile) garde son défilement : on remonte le premier parent défilant.
  useEffect(() => {
    let parent = formRef.current?.parentElement
    while (parent) {
      const { overflowY } = window.getComputedStyle(parent)
      if (/(auto|scroll)/.test(overflowY) && parent.scrollHeight > parent.clientHeight) {
        parent.scrollTop = 0
        return
      }
      parent = parent.parentElement
    }
  }, [])
  const { source } = useContext(SourceContext)
  const { reloadAPISignalementTiles } = useContext(MapContext)
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
      reloadAPISignalementTiles()
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
    <StyledForm ref={formRef} onSubmit={handleSubmit}>
      <div className='signalement-recap'>
        <p className='fr-text--sm'>
          {submitStatus === 'success'
            ? 'Récapitulatif de votre signalement.'
            : 'Vérifiez votre signalement avant de l’envoyer.'}
        </p>
        <SignalementViewer
          preview
          signalement={signalement}
          activeRole={activeRole}
          onActiveRoleChange={onActiveRoleChange}
        />
      </div>
      {source?.type !== Source.type.PRIVATE && (
        <section>
          <h4>Contact</h4>
          <div className='fr-text--sm'>
            Laissez vos coordonnées afin que la mairie puisse vous recontacter et vous informer du
            traitement de votre signalement.
          </div>
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
            <p>Votre signalement a bien été envoyé.</p>
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
      {submitStatus !== 'success' ? (
        <>
          <Alert
            style={{ marginBottom: '0.5rem' }}
            severity='info'
            title='Le signalement sera transmis à la mairie'
            description='La mairie recevra votre signalement et pourra y répondre. Le délai de traitement peut varier en fonction de la commune.'
          />
          <div className='form-controls'>
            <button className='fr-btn' disabled={submitStatus === 'loading'} type='submit'>
              Envoyer à la mairie
            </button>

            <button className='fr-btn fr-btn--tertiary' type='button' onClick={onBack}>
              Annuler
            </button>
          </div>
        </>
      ) : (
        <div className='form-controls'>
          <button className='fr-btn ' type='button' onClick={() => window.print()}>
            Imprimer le récapitulatif
          </button>
          <button className='fr-btn fr-btn--tertiary' type='button' onClick={onClose}>
            Quitter
          </button>
        </div>
      )}
    </StyledForm>
  )
}
