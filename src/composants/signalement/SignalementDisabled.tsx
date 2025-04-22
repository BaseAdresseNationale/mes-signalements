import React from 'react'
import Alert from '@codegouvfr/react-dsfr/Alert'

export default function SignalementDisabled() {
  return (
    <Alert
      severity='info'
      title='Les signalements sont désactivés pour cette commune'
      description={
        <>
          <p style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
            Nous vous recommandons de contacter directement la mairie.
          </p>
          <p>
            <a
              href='https://adresse-data-gouv-fr.gitbook.io/doc-bal/deposer-un-signalement/mes-signalements'
              target='_blank'
              rel='noreferrer'
            >
              En savoir plus
            </a>
          </p>
        </>
      }
    />
  )
}
