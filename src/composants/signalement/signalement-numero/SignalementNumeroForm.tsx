import { useMemo } from "react";
import { StyledForm } from "../signalement.styles";
import PositionInput from "../../common/PositionInput";
import {
  getExistingLocationLabel,
  getInitialSignalement,
} from "../../../hooks/useSignalement";
import { Position, Signalement } from "../../../api/signalement";

interface SignalementNumeroFormProps {
  signalement: Signalement;
  onEditSignalement: (property: string, key: string) => (value: any) => void;
  onClose: () => void;
  address?: any;
  setIsEditParcellesMode: (isEditParcellesMode: boolean) => void;
  isEditParcellesMode: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  initialPositionCoords: number[];
}

export default function SignalementNumeroForm({
  signalement,
  onEditSignalement,
  onClose,
  address,
  setIsEditParcellesMode,
  isEditParcellesMode,
  onSubmit,
  initialPositionCoords,
}: SignalementNumeroFormProps) {
  const isCreation = !address;

  const isSubmitDisabled = useMemo(() => {
    const { changesRequested } = signalement;
    const isDisabled = changesRequested.positions?.length === 0;
    if (isCreation) {
      return isDisabled;
    }

    return (
      isDisabled ||
      JSON.stringify(getInitialSignalement(address)) ===
        JSON.stringify(signalement)
    );
  }, [address, signalement, isCreation]);

  const { numero, suffixe, nomVoie, positions, parcelles } =
    signalement.changesRequested;

  return (
    <StyledForm onSubmit={onSubmit}>
      <h4>Signalement d&apos;un problème d&apos;adressage</h4>
      {!isCreation && (
        <section>
          <h5>Adresse concernée</h5>
          <div className="form-row">{getExistingLocationLabel(address)}</div>
          <div className="form-row">
            {address.codePostal} {address.commune.nom}
          </div>
        </section>
      )}
      <section>
        <h5>
          {isCreation
            ? "Demande de création d'un numéro"
            : "Modifications demandées"}
        </h5>
        <div className="form-row">
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="numero">
              Numéro*
            </label>
            <input
              className="fr-input"
              name="numero"
              required
              min={1}
              max={9998}
              type="number"
              value={numero as number}
              onChange={(event) =>
                onEditSignalement(
                  "changesRequested",
                  "numero"
                )(event.target.value)
              }
            />
          </div>
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="suffixe">
              Suffixe
            </label>
            <input
              name="suffixe"
              className="fr-input"
              value={suffixe as string}
              placeholder={"bis, ter..."}
              onChange={(event) =>
                onEditSignalement(
                  "changesRequested",
                  "suffixe"
                )(event.target.value)
              }
            />
          </div>
        </div>
        <h6>Positions :</h6>
        <legend>
          Déplacez les marqueurs sur la carte pour éditer les positions.
        </legend>
        {positions?.map(({ point, type }, index) => (
          <PositionInput
            key={index} // eslint-disable-line react/no-array-index-key
            point={point}
            type={type}
            onEditPositionType={(updatedPosition) => {
              const newPositions = [...positions];
              newPositions[index] = updatedPosition;
              onEditSignalement("changesRequested", "positions")(newPositions);
            }}
            onDelete={() => {
              onEditSignalement(
                "changesRequested",
                "positions"
              )(positions.filter((_, i) => i !== index));
            }}
          />
        ))}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            className="fr-btn"
            style={{ color: "white", marginBottom: 10 }}
            onClick={() =>
              onEditSignalement(
                "changesRequested",
                "positions"
              )([
                ...(positions as Position[]),
                {
                  point: { type: "Point", coordinates: initialPositionCoords },
                  type: "entrée",
                },
              ])
            }
          >
            Ajouter une position
          </button>
        </div>
        <h6>Parcelles cadastrales :</h6>
        <div className="parcelles-wrapper">
          {parcelles?.map((parcelle) => (
            <div key={parcelle}>{parcelle}</div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="fr-btn"
            type="button"
            style={{ color: "white", marginBottom: 10 }}
            onClick={() => setIsEditParcellesMode(!isEditParcellesMode)}
          >
            {isEditParcellesMode
              ? "Arrêter de modifier les parcelles"
              : "Modifier les parcelles"}
          </button>
        </div>
        <div className="form-row">
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="nomVoie">
              Nom de la voie*
            </label>
            <input
              className="fr-input"
              name="nomVoie"
              required
              disabled={isCreation}
              value={nomVoie as string}
              onChange={(event) =>
                onEditSignalement(
                  "changesRequested",
                  "nomVoie"
                )(event.target.value)
              }
            />
          </div>
        </div>
      </section>
      <div className="form-controls">
        <button
          className="fr-btn"
          disabled={isSubmitDisabled}
          style={{ color: "white" }}
          type="submit"
        >
          Envoyer le signalement
        </button>
        <button className="fr-btn" type="button" onClick={onClose}>
          Annuler
        </button>
      </div>
    </StyledForm>
  );
}
