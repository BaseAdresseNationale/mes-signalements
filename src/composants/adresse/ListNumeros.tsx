import React, { useMemo, useState } from 'react'
import { IBANPlateformeLieuDit, IBANPlateformeVoie } from '../../api/ban-plateforme/types'
import styled from 'styled-components'
import useNavigateWithPreservedSearchParams from '../../hooks/useNavigateWithPreservedSearchParams'

interface ListNumerosProps {
  adresse: IBANPlateformeVoie | IBANPlateformeLieuDit
}

const StyledListNumeros = styled.div`
  margin-top: 1rem;

  input:focus {
    outline: none;
  }

  .fr-table {
    padding-top: 0;
    margin-bottom: 0;

    table {
      position: relative;
      max-height: 300px;
      overflow: auto;
      thead {
        position: sticky;
        top: 0;
        th {
          white-space: nowrap;
        }
      }

      tbody {
        .numero-row {
          cursor: pointer;

          td {
            width: 100%;
            padding: 1rem 1.5rem;
            font-weight: bold;
          }

          &:hover {
            background-color: var(--background-contrast-grey-hover);
          }
        }
      }
    }
  }
`

export function ListNumeros({ adresse }: Readonly<ListNumerosProps>) {
  const [search, setSearch] = useState('')
  const { navigate } = useNavigateWithPreservedSearchParams()
  const filteredNumeros = useMemo(() => {
    if (!search) {
      return adresse.numeros
    }

    return adresse.numeros.filter(({ numero, suffixe }) => {
      const numeroString = suffixe ? `${numero} ${suffixe}` : `${numero}`
      return numeroString.toLowerCase().includes(search.toLowerCase())
    })
  }, [adresse.numeros, search])

  return (
    <StyledListNumeros>
      {adresse.numeros.length > 0 ? (
        <>
          <h3>
            {adresse.numeros.length === 1
              ? `1 numéro répertorié`
              : `${adresse.numeros.length} numéros répertoriés`}{' '}
          </h3>
          <div className='fr-search-bar' id='header-search' role='search'>
            <input
              className='fr-input'
              onChange={(e) => setSearch(e.target.value)}
              type='search'
              id='numeros-filter'
              name='numeros-filter'
              placeholder='Filtrer les numéros'
            />
          </div>
          {filteredNumeros.length > 0 ? (
            <div className='fr-table'>
              <div className='fr-table__wrapper'>
                <div className='fr-table__container'>
                  <div className='fr-table__content'>
                    <table>
                      <thead>
                        <tr>
                          <th>Numéro</th>
                          <th>Certifié par la commune</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNumeros.map(({ id, numero, suffixe, certifie }) => (
                          <tr onClick={() => navigate(`/${id}`)} className='numero-row' key={id}>
                            <td>{suffixe ? `${numero} ${suffixe}` : numero}</td>
                            <td>
                              {certifie ? <span className='fr-icon-checkbox-circle-line' /> : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Aucun numéro ne correspond à ce filtrage</p>
          )}
        </>
      ) : (
        <h3>Auncun numéro n&apos;est répertorié pour ce toponyme</h3>
      )}
    </StyledListNumeros>
  )
}
