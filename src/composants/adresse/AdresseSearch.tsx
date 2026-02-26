import styled from 'styled-components'
import React, { forwardRef, useMemo } from 'react'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'
import { MOBILE_BREAKPOINT } from '../../hooks/useWindowSize'
import { ANIMATION_DURATION } from '../../contexts/layout.context'
import SearchInput, { SearchItemType } from '../common/SearchInput/SearchInput'
import Button from '@codegouvfr/react-dsfr/Button'
import { MappedAPIAdresseResult, useSearchAPIAdresse } from '../../hooks/useSearchAPIAdresse'

const placeHolders = [
  '10 rue Paulin Viry, Pocé-Sur-Cisse',
  '2 chemin de la Croix, Saint-Georges-sur-Cher',
  '1 rue de la Mairie, Saint-Aignan',
  '25 bis rue de la République, Tours',
  '12 rue Nationale, Amboise',
  '2 rue de la Mairie, Bléré',
  "1 rue d'Azay, Montlouis-sur-Loire",
]

const StyledSearch = styled.div<{ $animationDuration: number }>`
  width: 400px;
  position: absolute;
  display: flex;
  flex-direction: column;
  background: white;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  transition: ${({ $animationDuration }) => `top ${$animationDuration}ms ease-in-out`};

  &.show {
    top: 50px;
  }

  .fr-btn {
    align-self: flex-end;
  }

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    padding: 10px;
    width: calc(100% - 80px);
    left: 10px;
    transform: none;

    input {
      width: 100%;
    }

    &.show {
      top: 10px;
    }
  }
`

function _AdresseSearch(props: any, ref: React.ForwardedRef<HTMLDivElement>) {
  const { navigate } = useNavigateWithPreservedSearchParams()
  const { fetchAPIAdresse } = useSearchAPIAdresse()
  const placeholder = useMemo(
    () => placeHolders[Math.floor(Math.random() * placeHolders.length)],
    [],
  )

  return (
    <StyledSearch ref={ref} $animationDuration={ANIMATION_DURATION}>
      <SearchInput
        onSearch={fetchAPIAdresse()}
        onSelect={(result?: SearchItemType<MappedAPIAdresseResult> | null) => {
          if (result) {
            navigate(`/${result.id}`)
          }
        }}
        label='Rechercher une adresse, une voie ou un lieu-dit :'
        nativeInputProps={{ placeholder }}
      />
      <Button
        onClick={() => navigate(`/advanced-search`)}
        className='fr-mt-1w'
        priority='tertiary no outline'
        size='small'
        iconId='fr-icon-equalizer-line'
        iconPosition='left'
      >
        Recherche avancée
      </Button>
    </StyledSearch>
  )
}

export const AdresseSearch = forwardRef(_AdresseSearch)
