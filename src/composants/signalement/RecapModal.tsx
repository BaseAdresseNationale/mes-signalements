import React, { useState } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useSearchParams } from 'react-router-dom'
import { StyledForm } from './signalement.styles'

import {
  CreateSignalementDTO,
  Position,
  Signalement,
  SignalementsService,
} from '../../api/signalement'
import Modal from '../common/Modal'
import { getPositionTypeLabel } from '../../utils/signalement.utils'
import { getAdresseLabel } from '../../utils/adresse.utils'
import { ChangesRequested } from '../../types/signalement.types'

interface SignalementRecapModalProps {
  signalement: Signalement
  onEditSignalement: (property: string, key: string) => (event: string) => void
  onClose: () => void
  address: any
  onSubmit: () => void
}

export default function SignalementRecapModal({
  signalement,
  onEditSignalement,
  onClose,
  address,
  onSubmit,
}: SignalementRecapModalProps) {
  const [submitStatus, setSubmitStatus] = useState<string | null>(null)
  const [searchParams] = useSearchParams()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitStatus('loading')
    try {
      const sourceId =
        searchParams.get('sourceId') || process.env.REACT_APP_API_SIGNALEMENT_SOURCE_ID
      await SignalementsService.createSignalement(signalement as CreateSignalementDTO, sourceId)
      setSubmitStatus('success')
      setTimeout(() => {
        onSubmit()
      }, 2000)
    } catch (error) {
      console.error(error)
      setSubmitStatus('error')
    }
  }

  const { numero, suffixe, nomVoie, positions, parcelles, nom } =
    signalement.changesRequested as ChangesRequested

  return (
    <Modal title='Votre demande de signalement' onClose={onClose}>
      <StyledForm onSubmit={handleSubmit}>
        {signalement.type === Signalement.type.LOCATION_TO_UPDATE && (
          <section>
            <h4>Récapitulatif</h4>
            <div className='signalement-recap'>
              <div>
                <h5>Lieu concerné</h5>
                <p>{getAdresseLabel(address)}</p>
                {address.positions && (
                  <>
                    <h6>Positions : </h6>
                    {address.positions.map(
                      (
                        { position, positionType }: { position: any; positionType: Position.type },
                        index: number,
                      ) => {
                        return (
                          <React.Fragment key={index}>
                            <b>{getPositionTypeLabel(positionType)}</b> : {position.coordinates[0]},{' '}
                            {position.coordinates[1]}
                            <br />
                          </React.Fragment>
                        ) // eslint-disable-line react/no-array-index-key
                      },
                    )}
                  </>
                )}
                {address.parcelles && (
                  <>
                    <h6>Parcelles : </h6>
                    {address.parcelles.map((parcelle: string, index: number) => (
                      <div key={index}>{parcelle}</div>
                    ))}
                  </>
                )}
              </div>
              <div>
                <h5>Modifications demandées</h5>
                <p>
                  {numero} {suffixe} {nomVoie} {nom}
                </p>
                {positions && (
                  <>
                    <h6>Positions : </h6>
                    {positions.map(({ point, type }, index) => {
                      return (
                        <React.Fragment key={index}>
                          <b>{getPositionTypeLabel(type)}</b> : {point.coordinates[0]},{' '}
                          {point.coordinates[1]}
                          <br />
                        </React.Fragment>
                      ) // eslint-disable-line react/no-array-index-key
                    })}
                  </>
                )}
                {parcelles && (
                  <>
                    <h6>Parcelles : </h6>
                    {parcelles.map((parcelle, index) => (
                      <div key={index}>{parcelle}</div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </section>
        )}
        {signalement.type === Signalement.type.LOCATION_TO_CREATE && (
          <section>
            <h4>Récapitulatif</h4>
            <div className='signalement-recap'>
              <div>
                <h5>Votre demande de création</h5>
                <p>
                  {numero} {suffixe} {nomVoie} {nom}
                </p>
                {positions && (
                  <>
                    <h6>Positions : </h6>
                    {positions.map(({ point, type }, index) => {
                      return (
                        <React.Fragment key={index}>
                          <b>{getPositionTypeLabel(type)}</b> : {point.coordinates[0]},{' '}
                          {point.coordinates[1]}
                          <br />
                        </React.Fragment>
                      ) // eslint-disable-line react/no-array-index-key
                    })}
                  </>
                )}
                {parcelles && (
                  <>
                    <h6>Parcelles : </h6>
                    {parcelles.map((parcelle, index) => (
                      <div key={index}>{parcelle}</div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </section>
        )}
        {signalement.type === Signalement.type.LOCATION_TO_DELETE && (
          <section>
            <h4>Récapitulatif</h4>
            <div className='signalement-recap'>
              <div>
                <h5>Lieu concerné</h5>
                <p>{getAdresseLabel(address)}</p>
                {address.positions && (
                  <>
                    <h6>Positions : </h6>
                    {address.positions.map(
                      (
                        { position, positionType }: { position: any; positionType: Position.type },
                        index: number,
                      ) => {
                        return (
                          <React.Fragment key={index}>
                            <b>{getPositionTypeLabel(positionType)}</b> : {position.coordinates[0]},{' '}
                            {position.coordinates[1]}
                            <br />
                          </React.Fragment>
                        ) // eslint-disable-line react/no-array-index-key
                      },
                    )}
                  </>
                )}
                {address.parcelles && (
                  <>
                    <h6>Parcelles : </h6>
                    {address.parcelles.map((parcelle: string, index: number) => (
                      <div key={index}>{parcelle}</div>
                    ))}
                  </>
                )}
              </div>
              <div>
                <h5>Raison de la demande de suppression</h5>
                <p>{signalement.changesRequested.comment}</p>
              </div>
            </div>
          </section>
        )}
        <section>
          <h4>Contact</h4>
          <p>
            Vous pouvez nous laisser votre adresse email si vous souhaitez être tenu informé du
            traitement de votre signalement.
          </p>
          <div className='form-row'>
            <div className='fr-input-group'>
              <label className='fr-label' htmlFor='email'>
                Email
              </label>
              <input
                name='email'
                className='fr-input'
                type='email'
                value={signalement.author?.email || ''}
                onChange={(event) => onEditSignalement('author', 'email')(event.target.value)}
              />
            </div>
          </div>

          <div className='captcha-wrapper'>
            <HCaptcha
              sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY || ''}
              onVerify={(token) => onEditSignalement('author', 'captchaToken')(token)}
            />
          </div>
        </section>

        {submitStatus === 'success' && (
          <div className='fr-alert fr-alert--success'>
            <p>Votre signalement a bien été envoyée.</p>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className='fr-alert fr-alert--error'>
            <p>
              Une erreur est survenue lors de l&apos;envoi de votre signalement. Veuillez réessayer
              ultérieurement.
            </p>
          </div>
        )}
        <div className='form-controls'>
          <button
            className='fr-btn'
            disabled={submitStatus === 'loading' || submitStatus === 'success'}
            style={{ color: 'white' }}
            type='submit'
          >
            Envoyer le signalement
          </button>
          <button className='fr-btn' type='button' onClick={onClose}>
            Annuler
          </button>
        </div>
      </StyledForm>
    </Modal>
  )
}
