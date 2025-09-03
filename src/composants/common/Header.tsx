import React, { useState } from 'react'
import { Source } from '../../api/signalement'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'
import { AuthentificationModal } from '../authentification/AuthentificationModal'
import { Header as HeaderDSFR } from '@codegouvfr/react-dsfr/Header'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import SearchMobileButton from './SearchMobileButton'

interface HeaderProps {
  customSource?: Source
  toggleShowInfo: () => void
}

export function Header({ customSource, toggleShowInfo }: HeaderProps) {
  const { navigate } = useNavigateWithPreservedSearchParams()
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
        serviceTitle={
          <>
            Mes Signalements{' '}
            <Badge as='span' noIcon severity='info'>
              Beta
            </Badge>
          </>
        }
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
          customSource
            ? {
                iconId: 'fr-icon-account-circle-fill',
                buttonProps: {
                  onClick: () => navigate('/source'),
                },
                text: customSource.nom,
              }
            : {
                iconId: 'fr-icon-lock-line',
                buttonProps: {
                  onClick: () => setShowConnectionModal(true),
                },
                text: 'Se connecter',
              },
        ]}
      />
      <SearchMobileButton />
      {showConnectionModal && (
        <AuthentificationModal onClose={() => setShowConnectionModal(false)} />
      )}
    </>
  )
}
