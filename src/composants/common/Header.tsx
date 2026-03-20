import React, { useState } from 'react'
import { Source } from '../../api/signalement'
import { AuthentificationModal } from '../authentification/AuthentificationModal'
import { Header as HeaderDSFR } from '@codegouvfr/react-dsfr/Header'
import SearchMobileButton from './SearchMobileButton'
import SourcePortal from '../authentification/SourcePortal'

interface HeaderProps {
  customSource?: Source
  toggleShowInfo: () => void
}

export function Header({ customSource, toggleShowInfo }: HeaderProps) {
  const [showConnectionModal, setShowConnectionModal] = useState(false)

  return (
    <>
      <HeaderDSFR
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
      <SearchMobileButton />
      {showConnectionModal && (
        <AuthentificationModal onClose={() => setShowConnectionModal(false)} />
      )}
    </>
  )
}
