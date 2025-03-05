import React from 'react'

export default function SignalementDisabled() {
  return (
    <div className='fr-alert fr-alert--info'>
      <h3 className='fr-alert__title'>Les signalements sont désactivés pour votre commune</h3>
      <p>
        <b>Pourquoi ?</b> Votre commune n&apos;a pas encore publié sa Base Adresse Locale
      </p>
      <p>
        <b>Comment faire ?</b> Nous vous recommandons de contacter directement votre mairie
      </p>
    </div>
  )
}
