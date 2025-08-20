import React, { useEffect, useState } from 'react'
import Alert from '@codegouvfr/react-dsfr/Alert'
import { getEmailsCommune } from '../../api/api-depot'

type SignalementDisabledProps = {
  message?: string
  codeCommune: string
}

export default function SignalementDisabled({ message, codeCommune }: SignalementDisabledProps) {
  const [communeEmails, setCommuneEmails] = useState<string[]>([])

  useEffect(() => {
    async function fetchCommuneEmails() {
      try {
        const emails = await getEmailsCommune(codeCommune)
        setCommuneEmails(emails)
      } catch (err) {
        console.error(`An error occured while fetching emails for commune ${codeCommune}`)
      }
    }

    fetchCommuneEmails()
  }, [codeCommune])

  return (
    <Alert
      severity='info'
      title='Les signalements sont désactivés pour cette commune'
      description={
        <>
          {message ? (
            <div style={{ marginTop: '0.5rem' }} dangerouslySetInnerHTML={{ __html: message }} />
          ) : (
            <p style={{ marginTop: '0.5rem' }}>
              Nous vous recommandons de contacter directement la mairie.
            </p>
          )}

          {communeEmails.length > 0 && (
            <p style={{ marginTop: '0.5rem' }}>
              Contact mairie :{' '}
              {communeEmails.map((email) => (
                <a
                  style={{ display: 'block', width: 'fit-content' }}
                  key={email}
                  href={`mailto:${email}`}
                >
                  {email}
                </a>
              ))}
            </p>
          )}
        </>
      }
    />
  )
}
