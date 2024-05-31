import { positionTypeOptions } from "../hooks/useSignalement";
import styled from "styled-components";
import { Point, Position } from "../lib/signalement";
import SelectInput from "./common/SelectInput";

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
      <input
        className="fr-input"
        disabled
        style={{ width: 90, padding: 5, marginLeft: 10, marginRight: 10 }}
        value={point.coordinates[0]}
      />
      <input
        className="fr-input"
        disabled
        style={{ width: 90, padding: 5 }}
        value={point.coordinates[1]}
      />
      <button
        type="button"
        onClick={onDelete}
        style={{ marginTop: 5, marginLeft: 5 }}
      >
        <span className="icon">X</span>
      </button>
    </StyledContainer>
  );
}
