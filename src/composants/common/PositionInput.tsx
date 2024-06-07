import styled from "styled-components";
import { Point, Position } from "../../api/signalement";
import SelectInput from "../common/SelectInput";
import { positionTypeOptions } from "../../utils/signalement.utils";

const StyledContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  > button {
    margin-top: 30px;
    align-self: center;
  }

  > .position-input {
    max-width: 100px;
    margin-left: 5px;
  }
`;

interface PositionInputProps {
  point: Point;
  type: Position.type;
  onDelete: () => void;
  onEditPositionType: ({
    point,
    type,
  }: {
    point: Point;
    type: Position.type;
  }) => void;
}

export default function PositionInput({
  point,
  type,
  onDelete,
  onEditPositionType,
}: PositionInputProps) {
  return (
    <StyledContainer>
      <SelectInput
        label="Type de position*"
        value={type}
        options={positionTypeOptions}
        handleChange={(type) =>
          onEditPositionType({
            point,
            type: type as Position.type,
          })
        }
      />
      <div className="fr-input-group position-input">
        <label className="fr-label">Longitude</label>
        <input className="fr-input" disabled value={point.coordinates[0]} />
      </div>
      <div className="fr-input-group position-input">
        <label className="fr-label">Latitude</label>
        <input className="fr-input" disabled value={point.coordinates[1]} />
      </div>
      <button type="button" onClick={onDelete}>
        <span className="icon">X</span>
      </button>
    </StyledContainer>
  );
}
