import { useCallback, useState } from 'react'
import { ChangesRequested, Signalement, SignalementsService } from '../api/signalement'

type UseAsyncBalValidatorParams = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onEditSignalement: (property: keyof Signalement, key?: string) => (value: any) => void
}

type UseAsyncBalValidatorReturn<T> = {
  validationErrors: { [key in keyof T]?: string }
  onValidate: (
    event: React.FormEvent<HTMLFormElement>,
  ) => (changesRequested: ChangesRequested) => Promise<void>
  onEdit: (property: keyof Signalement, key?: string) => (value: any) => void
}

export function useAsyncBalValidator<T>({
  onSubmit,
  onEditSignalement,
}: UseAsyncBalValidatorParams): UseAsyncBalValidatorReturn<T> {
  const [validationErrors, setValidationErrors] = useState<{ [key in keyof T]?: string }>({})

  const onValidate =
    (event: React.FormEvent<HTMLFormElement>) => async (changesRequested: ChangesRequested) => {
      event.preventDefault()
      try {
        await SignalementsService.validateChangesRequested(changesRequested)
        onSubmit(event)
        setValidationErrors({})
      } catch (error) {
        if (Array.isArray((error as any).body.message)) {
          const errors = ((error as any).body.message as string[]).reduce(
            (acc, curr) => {
              const errorMessages = curr.split(', ')
              const [key, message] = errorMessages[0].split(':')
              acc[key as keyof T] = message

              return acc
            },
            {} as { [key in keyof T]: string },
          )
          setValidationErrors(errors)
        } else {
          console.error('Error validating signalement:', error)
        }
      }
    }

  const onEdit = useCallback(
    (property: keyof Signalement, key?: string) => (value: any) => {
      onEditSignalement(property, key)(value)
      setValidationErrors((prevErrors) => ({ ...prevErrors, [key as keyof T]: undefined }))
    },
    [onEditSignalement],
  )

  return { validationErrors, onValidate, onEdit }
}
