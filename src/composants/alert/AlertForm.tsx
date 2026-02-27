import React, { useContext } from 'react'
import { StyledForm } from '../signalement/signalement.styles'
import Input from '@codegouvfr/react-dsfr/Input'
import { useFriendlyCaptcha } from '../../hooks/useFriendlyCaptcha'
import Button from '@codegouvfr/react-dsfr/Button'
import { CreateAlertDTO, Source } from '../../api/signalement'
import { getAlertTypeLabel } from '../../utils/alert.utils'
import SourceContext from '../../contexts/source.context'
import { Select } from '@codegouvfr/react-dsfr/Select'

interface AlertFormProps {
  alert: CreateAlertDTO
  onEdit: (property: keyof CreateAlertDTO, value: any) => void
}

const alertTypeOptions = Object.values(CreateAlertDTO.type).map((type) => ({
  value: type,
  label: getAlertTypeLabel(type),
}))

export default function AlertForm({ alert, onEdit }: AlertFormProps) {
  const { comment, author, type } = alert
  const { source } = useContext(SourceContext)

  const { CaptchaWidget } = useFriendlyCaptcha({
    siteKey: process.env.REACT_APP_FRIENDLY_CAPTCHA_SITE_KEY || '',
    showAttribution: false,
    language: 'fr',
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('Submitting alert:', alert)
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <h4>Créer une alerte</h4>
      <section>
        <div className='form-row'>
          <Select
            label="Type d'alerte*"
            hint="Si votre signalement ne correspond pas à ces types, choisissez 'Autre' et précisez le dans les informations complémentaires"
            nativeSelectProps={{
              required: true,
              name: 'type',
              onChange: (event) => onEdit('type', event.target.value),
              value: type || '',
            }}
          >
            <option disabled hidden selected value=''>
              Selectionnez une option
            </option>
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
          <section>
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
      <div className='form-controls'>
        <Button type='submit'>Envoyer</Button>
      </div>
    </StyledForm>
  )
}
