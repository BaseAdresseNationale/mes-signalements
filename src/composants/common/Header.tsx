import React, { useState } from 'react'
import { Source } from '../../api/signalement'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'
import styled from 'styled-components'
import { AuthentificationModal } from '../authentification/AuthentificationModal'

const StyledHeader = styled.header`
  .fr-header__navbar > .fr-btns-group {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    margin-right: 10px;

    button {
      margin: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 0.6em;
    }
  }

  @media print {
    display: flex;
    align-items: center;
    height: 100px;
    div {
      filter: none;
    }
    .fr-container {
      margin: 0;
    }
  }
`

interface HeaderProps {
  customSource?: Source
  toggleShowInfo: () => void
}

export function Header({ customSource, toggleShowInfo }: HeaderProps) {
  const { navigate } = useNavigateWithPreservedSearchParams()
  const [showConnectionModal, setShowConnectionModal] = useState(false)

  return (
    <>
      <StyledHeader role='banner' className='fr-header'>
        <div className='fr-header__body'>
          <div className='fr-container'>
            <div className='fr-header__body-row'>
              <div className='fr-header__brand fr-enlarge-link'>
                <div className='fr-header__brand-top'>
                  <div className='fr-header__logo'>
                    <p className='fr-logo' />
                  </div>
                  <div className='fr-header__navbar'>
                    <ul className='fr-btns-group'>
                      <li>
                        <button
                          title='À propos'
                          className='fr-btn fr-icon-information-fill'
                          onClick={toggleShowInfo}
                        >
                          À propos
                        </button>
                      </li>
                      <li>
                        {customSource ? (
                          <button
                            className='fr-btn fr-icon-account-circle-fill'
                            onClick={() => navigate('/source')}
                          >
                            {customSource.nom}
                          </button>
                        ) : (
                          <button
                            className='fr-btn fr-icon-account-circle-line'
                            onClick={() => setShowConnectionModal(true)}
                          >
                            Se connecter
                          </button>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='fr-header__service'>
                  <a href='/' title='Accueil - Mes Signalements - DINUM)'>
                    <p className='fr-header__service-title'>
                      Mes Signalements{' '}
                      <span className='fr-badge fr-badge--info fr-badge--no-icon'>Beta</span>
                    </p>
                  </a>
                  <p className='fr-header__service-tagline'>
                    Contribuez à améliorer l&apos;adressage de votre commune
                  </p>
                </div>
              </div>
              <div className='fr-header__tools'>
                <div className='fr-header__tools-links'>
                  <ul className='fr-btns-group'>
                    <li>
                      {customSource ? (
                        <button
                          className='fr-btn fr-icon-account-circle-fill'
                          onClick={() => navigate('/source')}
                        >
                          {customSource.nom}
                        </button>
                      ) : (
                        <button
                          className='fr-btn fr-icon-account-circle-line'
                          onClick={() => setShowConnectionModal(true)}
                        >
                          Se connecter
                        </button>
                      )}
                    </li>
                    <li>
                      <button className='fr-btn fr-icon-information-fill' onClick={toggleShowInfo}>
                        À propos
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StyledHeader>
      {showConnectionModal && (
        <AuthentificationModal onClose={() => setShowConnectionModal(false)} />
      )}
    </>
  )
}
