import React, { useContext, useState } from 'react'
import { StyledForm } from '../signalement/signalement.styles'
import Input from '@codegouvfr/react-dsfr/Input'
import { useFriendlyCaptcha } from '../../hooks/useFriendlyCaptcha'
import Button from '@codegouvfr/react-dsfr/Button'
import { AlertsService, CreateAlertDTO, Source } from '../../api/signalement'
import { getAlertTypeLabel } from '../../utils/alert.utils'
import SourceContext from '../../contexts/source.context'
import { Select } from '@codegouvfr/react-dsfr/Select'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'
import Alert from '@codegouvfr/react-dsfr/Alert'
import MapContext from '../../contexts/map.context'

interface AlertFormProps {
  codeCommune: string
  alert: CreateAlertDTO
  onEdit: (property: keyof CreateAlertDTO, value: any) => void
}

const alertTypeOptions = Object.values(CreateAlertDTO.type).map((type) => ({
  value: type,
  label: getAlertTypeLabel(type),
}))

export default function AlertForm({ alert, onEdit, codeCommune }: AlertFormProps) {
  const { comment, author, type } = alert
  const { source } = useContext(SourceContext)
  const { reloadAPISignalementTiles } = useContext(MapContext)
  const { navigate } = useNavigateWithPreservedSearchParams()
  const [submitStatus, setSubmitStatus] = useState<string | null>(null)

  const { CaptchaWidget } = useFriendlyCaptcha({
    siteKey: process.env.REACT_APP_FRIENDLY_CAPTCHA_SITE_KEY || '',
    showAttribution: false,
    language: 'fr',
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitStatus('loading')
    try {
      await AlertsService.createAlert({ ...alert, codeCommune })
      reloadAPISignalementTiles()
      setSubmitStatus('success')
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      setSubmitStatus('error')
    }
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <h4>Créer une alerte</h4>
      <section>
        <div className='form-row'>
          <Select
            label="Type d'alerte*"
            nativeSelectProps={{
              required: true,
              name: 'type',
              onChange: (event) => onEdit('type', event.target.value),
              value: type || '',
              disabled: true,
            }}
          >
            {alertTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className='form-row'>
          <Input
            textArea
            label='Informations complémentaires*'
            hintText='Ajoutez les informations que vous jugez utiles pour que la commune puisse traiter votre alerte'
            nativeTextAreaProps={{
              name: 'comment',
              value: comment as string,
              onChange: (event) => onEdit('comment', event.target.value),
              placeholder: 'Merci de ne pas indiquer de données personnelles',
              required: true,
            }}
          />
        </div>
      </section>
      {source?.type !== Source.type.PRIVATE && (
        <>
          <h4>Vos coordonnées</h4>
          <section style={{ marginTop: 0 }}>
            <div className='form-row'>
              <Input
                label='Nom*'
                nativeInputProps={{
                  required: true,
                  name: 'lastName',
                  value: author?.lastName || '',
                  onChange: (event) =>
                    onEdit('author', { ...author, lastName: event.target.value }),
                }}
              />
              <Input
                label='Prénom*'
                nativeInputProps={{
                  required: true,
                  name: 'firstName',
                  value: author?.firstName || '',
                  onChange: (event) =>
                    onEdit('author', { ...author, firstName: event.target.value }),
                }}
              />
            </div>
            <div className='form-row'>
              <Input
                label='Email*'
                nativeInputProps={{
                  required: true,
                  type: 'email',
                  name: 'email',
                  value: author?.email || '',
                  onChange: (event) => onEdit('author', { ...author, email: event.target.value }),
                }}
              />
            </div>
          </section>

          <div className='captcha-wrapper'>
            <CaptchaWidget
              solvedHandler={(token) =>
                onEdit('author', {
                  ...alert.author,
                  captchaToken: token,
                })
              }
            />
          </div>
        </>
      )}
      {submitStatus === 'success' ? (
        <Alert
          severity='success'
          title='Votre alerte a été envoyée avec succès !'
          description='Merci pour votre signalement.'
        />
      ) : (
        <>
          <div className='form-controls'>
            <Button type='submit' disabled={submitStatus === 'loading'}>
              Envoyer
            </Button>
          </div>
          {submitStatus === 'error' && (
            <Alert
              severity='error'
              title='Une erreur est survenue'
              description="Une erreur est survenue lors de l'envoi de votre alerte. Veuillez réessayer ultérieurement."
            />
          )}
        </>
      )}
    </StyledForm>
  )
}
