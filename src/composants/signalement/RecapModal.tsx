import React, { useContext, useState } from 'react'
import { StyledForm } from './signalement.styles'

import {
  CreateSignalementDTO,
  Signalement,
  SignalementsService,
  Source,
} from '../../api/signalement'
import Modal from '../common/Modal'
import { getPositionTypeLabel } from '../../utils/signalement.utils'
import { getAdresseLabel } from '../../utils/adresse.utils'
import { ChangesRequested } from '../../types/signalement.types'
import SourceContext from '../../contexts/source.context'
import { useFriendlyCaptcha } from '../../hooks/useFriendlyCaptcha'
import {
  IBANPlateformeLieuDit,
  IBANPlateformeNumero,
  IBANPlateformeVoie,
} from '../../api/ban-plateforme/types'

interface SignalementRecapModalProps {
  signalement: Signalement
  onEditSignalement: (property: keyof Signalement, key: string) => (event: string) => void
  onCloseModal: () => void
  address: IBANPlateformeNumero | IBANPlateformeVoie | IBANPlateformeLieuDit
  onClose: () => void
}

export default function SignalementRecapModal({
  signalement,
  onEditSignalement,
  onCloseModal,
  address,
  onClose,
}: SignalementRecapModalProps) {
  const [submitStatus, setSubmitStatus] = useState<string | null>(null)
  const { source } = useContext(SourceContext)
  const { CaptchaWidget } = useFriendlyCaptcha({
    siteKey: process.env.REACT_APP_FRIENDLY_CAPTCHA_SITE_KEY || '',
    showAttribution: false,
    language: 'fr',
  })

  const getModalTitle = () => {
    switch (signalement.type) {
      case Signalement.type.LOCATION_TO_UPDATE:
        return 'Demande de modification'
      case Signalement.type.LOCATION_TO_CREATE:
        return 'Demande de création'
      case Signalement.type.LOCATION_TO_DELETE:
        return 'Demande de suppression'
      default:
        return 'Demande de signalement'
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitStatus('loading')
    try {
      const sourceId = source?.id || process.env.REACT_APP_API_SIGNALEMENT_SOURCE_ID
      await SignalementsService.createSignalement(signalement as CreateSignalementDTO, sourceId)
      setSubmitStatus('success')
    } catch (error) {
      console.error(error)
      setSubmitStatus('error')
    }
  }

  const { numero, suffixe, nomVoie, nomComplement, positions, parcelles, nom } =
    signalement.changesRequested as ChangesRequested

  const getChangesRequestedLabel = () => {
    return numero ? (
      <>
        {numero} {suffixe} {nomVoie}{' '}
        {nomComplement && (
          <>
            <br />
            {nomComplement}
            <br />
            {address.codePostal} {address.commune.nom}
          </>
        )}
      </>
    ) : (
      <>
        {nom}
        <br />
        {address.codePostal} {address.commune.nom}
      </>
    )
  }

  return (
    <Modal title={getModalTitle()} onClose={submitStatus === 'success' ? onClose : onCloseModal}>
      <StyledForm onSubmit={handleSubmit}>
        {signalement.type === Signalement.type.LOCATION_TO_UPDATE && (
          <section>
            <div className='signalement-recap'>
              <div>
                <h5>Lieu concerné</h5>
                <p>{getAdresseLabel(address)}</p>
                {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).positions && (
                  <>
                    <h6>Positions : </h6>
                    {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).positions.map(
                      ({ position, positionType }, index) => {
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
                {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).parcelles?.length >
                  0 && (
                  <>
                    <h6>Parcelles : </h6>
                    {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).parcelles.map(
                      (parcelle, index) => (
                        <div key={index}>{parcelle}</div>
                      ),
                    )}
                  </>
                )}
              </div>
              <div>
                <h5>Modifications demandées</h5>
                <p>{getChangesRequestedLabel()}</p>
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
                {parcelles?.length > 0 && (
                  <>
                    <h6>Parcelles : </h6>
                    {parcelles.map((parcelle, index) => (
                      <div key={index}>{parcelle}</div>
                    ))}
                  </>
                )}
                {signalement.changesRequested.comment && (
                  <div>
                    <h6>Autres informations</h6>
                    <p>{signalement.changesRequested.comment}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        {signalement.type === Signalement.type.LOCATION_TO_CREATE && (
          <section>
            <div className='signalement-recap'>
              <div>
                <p>{getChangesRequestedLabel()}</p>
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
                {parcelles?.length > 0 && (
                  <>
                    <h6>Parcelles : </h6>
                    {parcelles.map((parcelle, index) => (
                      <div key={index}>{parcelle}</div>
                    ))}
                  </>
                )}
                {signalement.changesRequested.comment && (
                  <div>
                    <h6>Autres informations</h6>
                    <p>{signalement.changesRequested.comment}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {signalement.type === Signalement.type.LOCATION_TO_DELETE && (
          <section>
            <div className='signalement-recap'>
              <div>
                <h5>Lieu concerné</h5>
                <p>{getAdresseLabel(address)}</p>
                {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).positions && (
                  <>
                    <h6>Positions : </h6>
                    {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).positions.map(
                      ({ position, positionType }, index) => {
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
                {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).parcelles?.length >
                  0 && (
                  <>
                    <h6>Parcelles : </h6>
                    {(address as IBANPlateformeNumero | IBANPlateformeLieuDit).parcelles.map(
                      (parcelle, index) => (
                        <div key={index}>{parcelle}</div>
                      ),
                    )}
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
        {source?.type !== Source.type.PRIVATE && (
          <section>
            <h4>Contact</h4>
            <p>
              Laissez nous vos coordonnées pour que nous puissions vous tenir informé de l&apos;état
              d&apos;avancement de votre signalement.
            </p>
            <div className='form-row'>
              <div className='fr-input-group'>
                <label className='fr-label' htmlFor='lastName'>
                  Nom
                </label>
                <input
                  name='lastName'
                  className='fr-input'
                  value={signalement.author?.lastName || ''}
                  onChange={(event) => onEditSignalement('author', 'lastName')(event.target.value)}
                />
              </div>
              <div className='fr-input-group'>
                <label className='fr-label' htmlFor='firstName'>
                  Prénom
                </label>
                <input
                  name='firstName'
                  className='fr-input'
                  value={signalement.author?.firstName || ''}
                  onChange={(event) => onEditSignalement('author', 'firstName')(event.target.value)}
                />
              </div>
            </div>
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
              <CaptchaWidget
                solvedHandler={(token) => onEditSignalement('author', 'captchaToken')(token)}
              />
            </div>
          </section>
        )}
        {submitStatus === 'success' && (
          <>
            <p className='send-date'>
              Date d&apos;envoi : <b>{new Date().toLocaleDateString()}</b>
            </p>
            <div className='fr-alert fr-alert--success'>
              <p>Votre signalement a bien été envoyée.</p>
            </div>
          </>
        )}
        {submitStatus === 'error' && (
          <div className='fr-alert fr-alert--error'>
            <p>
              Une erreur est survenue lors de l&apos;envoi de votre signalement. Veuillez réessayer
              ultérieurement.
            </p>
          </div>
        )}
        <div className='form-controls' style={{ justifyContent: 'flex-start' }}>
          {submitStatus !== 'success' ? (
            <>
              <button
                className='fr-btn'
                disabled={submitStatus === 'loading' || submitStatus === 'success'}
                type='submit'
              >
                Envoyer le signalement
              </button>

              <button className='fr-btn fr-btn--tertiary' type='button' onClick={onCloseModal}>
                Annuler
              </button>
            </>
          ) : (
            <>
              <button className='fr-btn ' type='button' onClick={() => window.print()}>
                Imprimer le récapitulatif
              </button>
              <button className='fr-btn fr-btn--tertiary' type='button' onClick={onClose}>
                Quitter
              </button>
            </>
          )}
        </div>
      </StyledForm>
    </Modal>
  )
}
