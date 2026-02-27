import React from 'react'
import { StyledForm } from '../signalement/signalement.styles'
import SelectInput from '../common/SelectInput'
import Input from '@codegouvfr/react-dsfr/Input'
import { useFriendlyCaptcha } from '../../hooks/useFriendlyCaptcha'
import Button from '@codegouvfr/react-dsfr/Button'
import { CreateAlertDTO } from '../../api/signalement'

interface AlertFormProps {
  alert: CreateAlertDTO
  onEdit: (property: keyof CreateAlertDTO, value: any) => void
}

export default function AlertForm({ alert, onEdit }: AlertFormProps) {
  const { content } = alert
  const { CaptchaWidget } = useFriendlyCaptcha({
    siteKey: process.env.REACT_APP_FRIENDLY_CAPTCHA_SITE_KEY || '',
    showAttribution: false,
    language: 'fr',
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <h4>Créer une alerte</h4>
      <section>
        <div className='form-row'>
          <SelectInput label="Type d'alerte*" value={''} options={[]} handleChange={() => {}} />
        </div>
        <div className='form-row'>
          <Input
            textArea
            label='Informations complémentaires'
            nativeTextAreaProps={{
              name: 'content',
              value: content as string,
              onChange: (event) => onEdit('content', event.target.value),
              placeholder: 'Merci de ne pas indiquer de données personnelles',
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
      <div className='form-controls'>
        <Button type='submit'>Envoyer l&apos;alerte</Button>
        <Button type='button' priority='secondary'>
          Annuler
        </Button>
      </div>
    </StyledForm>
  )
}
