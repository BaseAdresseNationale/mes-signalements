import React from 'react'
import styled from 'styled-components'
import PositionItem from './PositionItem'
import { Position } from '../../../api/signalement'
import { blurPosition } from '../../../utils/position.utils'

const StyledContainer = styled.div`
  margin-top: 1.5rem;

  p {
    margin-bottom: 0.5rem;
  }
`

interface PositionInputProps {
  positions: Position[]
  initialPositionCoords: number[]
  onChange: (positions: Position[]) => void
  defaultPositionType?: Position.type
  multiPositionDisabled?: boolean
}

export default function PositionInput({
  positions,
  initialPositionCoords,
  onChange,
  defaultPositionType = Position.type.ENTR_E,
  multiPositionDisabled,
}: Readonly<PositionInputProps>) {
  return (
    <StyledContainer>
      <p>{`Position${multiPositionDisabled ? '' : 's'}*`}</p>
      {positions?.map(({ point, type }, index) => (
        <PositionItem
          key={point.coordinates.toString()}
          point={point}
          type={type}
          onEditPositionType={(updatedPosition) => {
            const newPositions = [...positions]
            newPositions[index] = updatedPosition
            onChange(newPositions)
          }}
          {...(multiPositionDisabled
            ? {}
            : {
                onDelete: () => {
                  onChange(positions.filter((_, i) => i !== index))
                },
              })}
        />
      ))}
      {(!multiPositionDisabled || positions.length === 0) && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type='button'
            className='fr-btn'
            style={{ color: 'white', marginBottom: 10 }}
            onClick={() =>
              onChange([
                ...positions,
                {
                  point: {
                    type: 'Point',
                    coordinates: blurPosition(initialPositionCoords),
                  },
                  type: defaultPositionType,
                },
              ])
            }
          >
            Ajouter une position
          </button>
        </div>
      )}
    </StyledContainer>
  )
}
