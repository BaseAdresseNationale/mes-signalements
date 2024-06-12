import styled from "styled-components";
import { APIAdressePropertyType } from "../../api/api-adresse/types";
import { search } from "../../api/api-adresse";
import Autocomplete from "../common/Autocomplete";
import { ANIMATION_DURATION } from "../../layouts/MapLayout";
import { forwardRef } from "react";
import useNavigateWithPreservedSearchParams from "../../hooks/useNavigateWithPreservedSearchParams";

const StyledSearch = styled.div<{ $animationDuration: number }>`
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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: ${({ $animationDuration }) =>
    `top ${$animationDuration}ms ease-in-out`};
  max-width: calc(100% - 20px);

  &.show {
    top: 50px;
  }
`;

const StyledResultList = styled.div`
  display: flex;
  flex-direction: column;
  > div {
    padding: 5px;
    > label {
      font-weight: bold;
    }
    > button {
      width: 100%;
      text-align: left;
      padding: 5px 10px;
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
    }
  }
`;

interface IAdresseResult {
  code: string;
  nom: string;
  type: APIAdressePropertyType;
}

function _AdresseSearch(props: {}, ref: React.ForwardedRef<HTMLDivElement>) {
  const { navigate } = useNavigateWithPreservedSearchParams();

  const fetchAdresses = async (query: string): Promise<IAdresseResult[]> => {
    const results = await search({ q: query, limit: 10 });

    return results.features.map((feature) => ({
      code: feature.properties.id,
      nom: feature.properties.label,
      type: feature.properties.type,
    }));
  };

  return (
    <StyledSearch ref={ref} $animationDuration={ANIMATION_DURATION}>
      <Autocomplete
        inputProps={{
          placeholder: "10 avenue de Ségure, Paris",
          style: { width: 400 },
        }}
        fetchResults={fetchAdresses}
        onSelect={(adresse) => navigate(`/${adresse.code}`)}
        renderResultList={(results) => {
          const houseNumbers = results.filter(
            ({ type }) => type === APIAdressePropertyType.HOUSE_NUMBER
          );
          const streets = results.filter(
            ({ type }) => type === APIAdressePropertyType.STREET
          );
          const localities = results.filter(
            ({ type }) => type === APIAdressePropertyType.LOCALITY
          );

          const filteredResults = [
            { name: "Adresses", results: houseNumbers },
            { name: "Rues", results: streets },
            { name: "Lieux-dits", results: localities },
          ].filter(({ results }) => results.length > 0);

          return (
            <StyledResultList>
              {filteredResults.map(({ name, results }) => (
                <div key={name}>
                  <label>{name}</label>
                  {results.map((result) => (
                    <button
                      tabIndex={0}
                      onClick={result.onClick}
                      key={result.code}
                      type="button"
                    >
                      {result.nom}
                    </button>
                  ))}
                </div>
              ))}
            </StyledResultList>
          );
        }}
      />
    </StyledSearch>
  );
}

export const AdresseSearch = forwardRef(_AdresseSearch);
