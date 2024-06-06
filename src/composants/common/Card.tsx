import styled from "styled-components";

interface CardProps {
  children: React.ReactNode;
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;

  h1 {
    font-size: 1.5rem;
    margin: 0;
  }
  h2 {
    font-size: 1.25rem;
    margin: 0;
  }
  h3 {
    font-size: 1rem;
    margin: 0;
  }

  button:not(:first-of-type) {
    margin-top: 10px;
  }
`;

export function Card({ children }: CardProps) {
  return <StyledContainer>{children}</StyledContainer>;
}
