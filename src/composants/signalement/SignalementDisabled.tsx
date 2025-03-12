import Alert from '@codegouvfr/react-dsfr/Alert'
import React from 'react'

export default function SignalementDisabled() {
  return (
    <Alert
      severity='info'
      title='Les signalements sont désactivés pour votre commune'
      description={
        <>
          <p style={{ marginTop: '0.5rem' }}>
            <b>Pourquoi ?</b>
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Votre commune n&apos;a pas encore publié sa{' '}
            <a href='https://adresse.data.gouv.fr/programme-bal' target='_blank' rel='noreferrer'>
              Base Adresse Locale
            </a>
          </p>
          <p>
            <b>Comment faire ?</b>
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Nous vous recommandons de contacter directement votre mairie.
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
