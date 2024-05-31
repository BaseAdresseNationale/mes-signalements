import styled from "styled-components";

const StyledButton = styled.button`
  color: white;
  margin: 20px !important;
  align-self: center;

  > svg {
    margin-left: 10px;
  }
`;

interface SignalementButtonProps {
  onClick: () => void;
  disabled: boolean;
}

function SignalementButton({ onClick, disabled }: SignalementButtonProps) {
  return (
    <StyledButton className="btn-fr" disabled={disabled} onClick={onClick}>
      Signaler un problème
    </StyledButton>
  );
}

export default SignalementButton;
