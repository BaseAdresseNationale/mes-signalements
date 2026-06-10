import React, { useState } from 'react'
import styled from 'styled-components'
import { Source } from '../../api/signalement'
import { AuthentificationModal } from '../authentification/AuthentificationModal'
import { Header as HeaderDSFR } from '@codegouvfr/react-dsfr/Header'
import SourcePortal from '../authentification/SourceMenu'
import { MOBILE_BREAKPOINT } from '../../hooks/useWindowSize'

interface HeaderProps {
  customSource?: Source
  toggleShowInfo: () => void
}

const StyledHeaderDSFR = styled(HeaderDSFR)`
  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    .fr-header__service {
      display: none;
    }
    #header-menu-modal-mes-signalements-header {
      .fr-container::before {
        position: absolute;
        content: 'Mes Signalements';
        display: block;
        margin-top: 0.2rem;
        font-size: 1.2rem;
        font-weight: 700;
      }
    }
  }
`

export function Header({ customSource, toggleShowInfo }: HeaderProps) {
  const [showConnectionModal, setShowConnectionModal] = useState(false)

  return (
    <>
      <StyledHeaderDSFR
        id='mes-signalements-header'
        brandTop={
          <>
            RÉPUBLIQUE
            <br />
            FRANÇAISE
          </>
        }
        serviceTitle='Mes Signalements'
        serviceTagline="Contribuez à améliorer l'adressage de votre commune"
        homeLinkProps={{
          href: '/',
          title: 'Accueil - Mes Signalements',
        }}
        quickAccessItems={[
          {
            iconId: 'fr-icon-question-line',
            buttonProps: {
              onClick: toggleShowInfo,
            },
            text: 'Aide',
          },
          customSource ? (
            <SourcePortal source={customSource} />
          ) : (
            {
              iconId: 'fr-icon-lock-line',
              buttonProps: {
                onClick: () => setShowConnectionModal(true),
              },
              text: 'Se connecter',
            }
          ),
        ]}
      />
      {showConnectionModal && (
        <AuthentificationModal onClose={() => setShowConnectionModal(false)} />
      )}
    </>
  )
}
