import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

const StyledList = styled.div`
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
        .list-row {
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

interface ListProps<T> {
  items: T[]
  headers: string[]
  renderItem: (item: T) => React.ReactNode
  filter: {
    placeholder?: string
    filterFn: (item: T) => string
  }
  noFilterMatchMessage: string
  title: string
}

export function List<T>({
  items,
  headers,
  noFilterMatchMessage,
  title,
  renderItem,
  filter,
}: Readonly<ListProps<T>>) {
  const [search, setSearch] = useState('')
  const filteredItems = useMemo(() => {
    if (!search) {
      return items
    }

    return items.filter((item) => {
      const filterString = filter.filterFn(item).toLowerCase()

      return filterString.includes(search.toLowerCase())
    })
  }, [items, search])

  return (
    <StyledList>
      <h3>{title}</h3>
      {items.length > 0 && (
        <>
          <div className='fr-search-bar' id='header-search' role='search'>
            <input
              className='fr-input'
              onChange={(e) => setSearch(e.target.value)}
              type='search'
              id='list-filter'
              name='list-filter'
              placeholder={filter.placeholder}
            />
          </div>
          {filteredItems.length > 0 ? (
            <div className='fr-table'>
              <div className='fr-table__wrapper'>
                <div className='fr-table__container'>
                  <div className='fr-table__content'>
                    <table>
                      <thead>
                        <tr>
                          {headers.map((header) => (
                            <th key={header}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>{filteredItems.map((item) => renderItem(item))}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>{noFilterMatchMessage}</p>
          )}
        </>
      )}
    </StyledList>
  )
}
