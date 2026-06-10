import React, { useState } from 'react'
import { StyledForm } from '../signalement/signalement.styles'
import Input from '@codegouvfr/react-dsfr/Input'
import Button from '@codegouvfr/react-dsfr/Button'
import Alert from '@codegouvfr/react-dsfr/Alert'
import { AuthorInput, Source, SourcesService, UpdateSourceDTO } from '../../api/signalement'
import { getValueFromLocalStorage, LocalStorageKeys } from '../../utils/localStorage.utils'

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

const buildInitialFormState = (source: Source): UpdateSourceDTO => ({
  nom: source.nom,
  defaultAuthor: {
    firstName: source.defaultAuthor?.firstName ?? '',
    lastName: source.defaultAuthor?.lastName ?? '',
    email: source.defaultAuthor?.email ?? '',
  },
})

const sanitizeAuthor = (author: AuthorInput | null | undefined): AuthorInput | null => {
  const firstName = author?.firstName?.trim() || null
  const lastName = author?.lastName?.trim() || null
  const email = author?.email?.trim() || null

  if (!firstName && !lastName && !email) {
    return null
  }

  return { firstName, lastName, email }
}

interface SourceSettingsFormProps {
  source: Source
  onUpdate?: (source: Source) => void
}

export function SourceSettingsForm({ source, onUpdate }: SourceSettingsFormProps) {
  const [formState, setFormState] = useState<UpdateSourceDTO>(() => buildInitialFormState(source))
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

  const handleAuthorChange = (field: keyof AuthorInput, value: string) => {
    setFormState((prev) => ({
      ...prev,
      defaultAuthor: {
        ...(prev.defaultAuthor ?? {}),
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitStatus('loading')

    try {
      const payload: UpdateSourceDTO = {
        nom: formState.nom?.trim() || source.nom,
        defaultAuthor: sanitizeAuthor(formState.defaultAuthor),
      }
      const updatedSource = await SourcesService.updateSource(source.id, payload)
      setFormState(buildInitialFormState(updatedSource))
      setSubmitStatus('success')
      onUpdate?.(updatedSource)
    } catch (error) {
      console.error(error)
      setSubmitStatus('error')
    }
  }

  const { nom, defaultAuthor } = formState
  const wasProconnected = getValueFromLocalStorage<boolean>(LocalStorageKeys.PROCONNECTED)

  return (
    <StyledForm onSubmit={handleSubmit}>
      <section>
        <h4>Informations générales</h4>
        <div className='form-row'>
          <Input
            label='Nom de la source*'
            nativeInputProps={{
              required: true,
              name: 'nom',
              value: nom ?? '',
              onChange: (event) => setFormState((prev) => ({ ...prev, nom: event.target.value })),
            }}
          />
        </div>
      </section>

      {!wasProconnected && (
        <section>
          <h4>Notifications</h4>
          <p>
            Les notifications de traitements des signalements seront envoyées à ce contact par
            défaut.
          </p>
          <div className='form-row'>
            <Input
              label='Nom'
              nativeInputProps={{
                name: 'lastName',
                value: defaultAuthor?.lastName ?? '',
                onChange: (event) => handleAuthorChange('lastName', event.target.value),
              }}
            />
            <Input
              label='Prénom'
              nativeInputProps={{
                name: 'firstName',
                value: defaultAuthor?.firstName ?? '',
                onChange: (event) => handleAuthorChange('firstName', event.target.value),
              }}
            />
          </div>
          <div className='form-row'>
            <Input
              label='Email'
              nativeInputProps={{
                type: 'email',
                name: 'email',
                value: defaultAuthor?.email ?? '',
                onChange: (event) => handleAuthorChange('email', event.target.value),
              }}
            />
          </div>
        </section>
      )}

      <div className='form-controls'>
        <Button type='submit' disabled={submitStatus === 'loading'}>
          Enregistrer
        </Button>
      </div>

      {submitStatus === 'success' && (
        <Alert
          severity='success'
          small
          description='Les paramètres de la source ont été mis à jour.'
        />
      )}
      {submitStatus === 'error' && (
        <Alert
          severity='error'
          small
          description='Une erreur est survenue lors de la mise à jour. Veuillez réessayer.'
        />
      )}
    </StyledForm>
  )
}
