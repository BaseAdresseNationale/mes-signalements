import React from 'react'
import { Source } from '../../api/signalement'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'

interface HeaderProps {
  customSource?: Source
}

export function Header({ customSource }: HeaderProps) {
  const { navigate } = useNavigateWithPreservedSearchParams()

  return (
    <header role='banner' className='fr-header'>
      <div className='fr-header__body'>
        <div className='fr-container'>
          <div className='fr-header__body-row'>
            <div className='fr-header__brand fr-enlarge-link'>
              <div className='fr-header__brand-top'>
                <div className='fr-header__logo'>
                  <p className='fr-logo' />
                </div>
                <div className='fr-header__navbar'>
                  {customSource && (
                    <ul className='fr-btns-group'>
                      <li>
                        <button
                          className='fr-btn fr-icon-account-circle-fill'
                          onClick={() => navigate('/source')}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            fontSize: '0.8em',
                          }}
                        >
                          {customSource.nom}
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
              <div className='fr-header__service'>
                <a href='/' title='Accueil - Mes Signalements - DINUM)'>
                  <p className='fr-header__service-title'>Mes Signalements</p>
                </a>
                <p className='fr-header__service-tagline'>
                  Signaler un problème dans la Base Adresse Nationale
                </p>
              </div>
            </div>
            <div className='fr-header__tools'>
              <div className='fr-header__tools-links'>
                {customSource && (
                  <ul className='fr-btns-group'>
                    <li>
                      <button
                        className='fr-btn fr-icon-account-circle-fill'
                        onClick={() => navigate('/source')}
                      >
                        {customSource.nom}
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
