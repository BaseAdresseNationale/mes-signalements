import React from 'react'
import styled from 'styled-components'
import { Point, Position } from '../../../api/signalement'
import SelectInput from '../../common/SelectInput'
import { positionTypeOptions } from '../../../utils/signalement.utils'

const StyledContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1rem;

  .fr-label {
    font-size: 0.9rem;
  }

  > button {
    margin-left: 5px;
    flex-shrink: 0;
  }

  > .position-input {
    margin-left: 5px;

    > .fr-input {
      font-size: 0.8rem;
      cursor: default;
      width: 90px;
      color: var(--text-disabled-grey);
      box-shadow: inset 0 -2px 0 0 var(--border-disabled-grey);
    }
  }
`

interface PositionItemProps {
  point: Point
  type: Position.type
  onDelete: () => void
  onEditPositionType: ({ point, type }: { point: Point; type: Position.type }) => void
}

export default function PositionItem({
  point,
  type,
  onDelete,
  onEditPositionType,
}: Readonly<PositionItemProps>) {
  return (
    <StyledContainer>
      <SelectInput
        label='Type de position*'
        value={type}
        options={positionTypeOptions}
        handleChange={(type) =>
          onEditPositionType({
            point,
            type: type as Position.type,
          })
        }
        style={{ marginBottom: 0 }}
      />
      <div className='fr-input-group position-input' style={{ marginBottom: 0 }}>
        <div className='fr-label'>Longitude</div>
        <div
          data-tooltip='Pour éditer la position, déplacez le marqueur sur la carte'
          className='fr-input'
        >
          <span>{point.coordinates[0].toFixed(5)}</span>
        </div>
      </div>
      <div className='fr-input-group position-input' style={{ marginBottom: 0 }}>
        <div className='fr-label'>Latitude</div>
        <div
          data-tooltip='Pour éditer la position, déplacez le marqueur sur la carte'
          className='fr-input'
        >
          {point.coordinates[1].toFixed(5)}
        </div>
      </div>
      <button
        type='button'
        className='fr-btn  fr-icon-delete-line fr-btn--tertiary-no-outline'
        title='Supprimer la position'
        onClick={onDelete}
      >
        Supprimer la position
      </button>
    </StyledContainer>
  )
}
