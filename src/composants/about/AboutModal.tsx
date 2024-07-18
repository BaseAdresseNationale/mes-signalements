import React from 'react'
import Modal from '../common/Modal'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  overflow: auto;
  h2 {
    font-size: 20px;
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 10px;
  }
`

interface ModalProps {
  onClose: () => void
}

export function AboutModal({ onClose }: ModalProps) {
  return (
    <Modal title='À propos de Mes Signalements' onClose={onClose}>
      <StyledWrapper>
        <section>
          <h2>A quoi ça sert?</h2>
          <p>
            L&apos;application Mes Signalements vous permet de signaler un problème dans la Base
            Adresse Nationale (BAN).
          </p>
          <p>Via cette application, vous pouvez : </p>
          <ul>
            <li>
              Signaler une <b>erreur ou des informations manquantes</b> sur une adresse, une voie ou
              un lieu-dit.
            </li>
            <li>
              Signaler une <b>adresse manquante</b>.
            </li>
            <li>
              Demander la <b>suppression d&apos;une adresse</b>.
            </li>
          </ul>
        </section>

        <section>
          <h2>Comment ça marche?</h2>
          <p>
            Une fois votre signalement effectué, il sera transmis à la commune concernée qui pourra
            le traiter. Vous pourrez être averti de l&apos;avancement de son traitement en laissant
            votre email dans le fenêtre de confirmation.
          </p>
        </section>

        <section>
          <h2>Comment signaler un problème d&apos;adressage?</h2>
          <p>
            Afin de signaler un problème, commencer par rechercher l&apos;objet de votre signalement
            via la barre de recherche ou la carte. Il peut s&apos;agit d&apos;une adresse,
            d&apos;une voie ou d&apos;un lieu-dit.
          </p>
          <p>
            <b>
              Si vous souhaiter signaler une adresse manquante, merci de rechercher la voie à
              laquelle l&apos;adresse est rattachée puis cliquer sur &quot;Signaler un numéro
              manquant&quot;.
            </b>
          </p>
          <p>
            Ensuite il vous suffit de remplir le formulaire sans oublier d&apos;ajouter les
            positions et les parcelles (ces informations devront être saisies via la carte.)
          </p>
          <p>
            Enfin une fenêtre de confirmation s&apos;ouvrira pour vous permettre de laisser votre
            adresse email si vous souhaitez être tenu informé de l&apos;avancement du traitement de
            votre signalement. Vous devrez alors compléter le captcha pour envoyer le signalement.
          </p>
        </section>

        <section>
          <h2>Qui sommes-nous?</h2>
          <p>
            Pour plus d&apos;information, retrouvez-nous sur le site{' '}
            <a rel='noreferrer' target='_blank' href='https://adresse.data.gouv.fr/'>
              adresse.data.gouv.fr
            </a>
          </p>
        </section>
      </StyledWrapper>
    </Modal>
  )
}
