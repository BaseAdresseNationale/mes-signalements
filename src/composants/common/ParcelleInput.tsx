import React, { useContext } from 'react'
import styled from 'styled-components'
import MapContext from '../../contexts/map.context'

const StyledContainer = styled.div`
  .parcelles-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    > div {
      margin-right: 1em;
      margin-bottom: 1em;
      padding: 0.5em;
      background-color: #f5f5f5;
      border-radius: 5px;
    }
  }
`

interface ParcelleInputProps {
  parcelles: string[]
}

export default function ParcelleInput({ parcelles }: ParcelleInputProps) {
  const { setShowCadastre, showCadastre, editParcelles, setEditParcelles } = useContext(MapContext)

  const enableParcellesEdition = () => {
    if (!showCadastre) {
      setShowCadastre(true)
    }
    setEditParcelles(true)
  }

  const disableParcellesEdition = () => {
    setEditParcelles(false)
    setShowCadastre(false)
  }

  return (
    <StyledContainer>
      <p>Parcelles cadastrales</p>
      <div className='parcelles-wrapper'>
        {parcelles?.map((parcelle) => <div key={parcelle}>{parcelle}</div>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className='fr-btn'
          type='button'
          style={{ color: 'white', marginBottom: 10 }}
          onClick={editParcelles ? disableParcellesEdition : enableParcellesEdition}
        >
          {editParcelles ? 'Masquer le cadastre' : 'Modifier les parcelles'}
        </button>
      </div>
    </StyledContainer>
  )
}
