import React from 'react'
import Modal from '../common/Modal'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  overflow: auto;
  h2 {
    font-size: 20px;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 18px;
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
        <h2>Vous avez un problème avec votre adresse ?</h2>
        <h3>La première étape, c&apos;est de vous assurer qu&apos;elle existe.</h3>
        <p>Pour cela, commencez par utiliser la barre de recherche pour trouver votre adresse.</p>
        <h3>La deuxième étape, c&apos;est de vous assurer qu&apos;elle soit bien renseignée.</h3>
        <p>
          Pour cela, assurez-vous qu&apos;elle soit correctement orthagraphiée et positionnée sur la
          carte.
        </p>
        <h2>Si une de ces étapes est impossible : proposez une création ou une modification !</h2>
        <ul>
          <li>
            En déposant une création ou modification, vous aidez la commune à améliorer sa{' '}
            <a href='https://adresse.data.gouv.fr/programme-bal' target='_blank' rel='noreferrer'>
              Base Adresse Locale (BAL)
            </a>
            .
          </li>
          <li>
            En améliorant sa BAL, vous améliorez l&apos;intervention des secours, le référencement
            dans les GPS, l&apos;accès aux réseaux, pour ne citer que quelques exemples.
          </li>
          <li>
            Une fois acceptée par la commune, votre proposition remontera dans la{' '}
            <a
              href='https://adresse.data.gouv.fr/decouvrir-la-BAN'
              target='_blank'
              rel='noreferrer'
            >
              Base Adresse Nationale
            </a>
            .
          </li>
        </ul>

        <p>
          Si vous souhaitez en savoir plus, consultez le{' '}
          <a
            href='https://adresse-data-gouv-fr.gitbook.io/doc-bal/deposer-un-signalement/mes-signalements'
            target='_blank'
            rel='noreferrer'
          >
            guide de Mes Signalements
          </a>
          .
        </p>

        <p>
          <i>
            L&apos;application Mes Signalement vous est proposé par le{' '}
            <a href='https://adresse.data.gouv.fr/programme-bal' target='_blank' rel='noreferrer'>
              Programme Base Adresse Locale
            </a>
          </i>
        </p>
      </StyledWrapper>
    </Modal>
  )
}
