import { getExistingLocationLabel } from "../../hooks/useSignalement";
import { StyledForm } from "../signalement.styles";

interface SignalementNumeroDeleteFormProps {
  onEditSignalement: (property: string, key: string) => (event: string) => void;
  onClose: () => void;
  address: any;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function SignalementNumeroDeleteForm({
  onEditSignalement,
  onClose,
  address,
  onSubmit,
}: SignalementNumeroDeleteFormProps) {
  return (
    <StyledForm onSubmit={onSubmit}>
      <h4>Demande de suppression d&apos;un numéro</h4>
      <section>
        <h5>Adresse concernée</h5>
        <div className="form-row">{getExistingLocationLabel(address)}</div>
        <div className="form-row">
          {address.codePostal} {address.commune.nom}
        </div>
      </section>
      <section>
        <div className="form-row">
          <label className="label-fr" htmlFor="comment">
            Raisons de la suppression*
          </label>
          <textarea
            name="comment"
            onChange={(event) =>
              onEditSignalement(
                "changesRequested",
                "comment"
              )(event.target.value)
            }
            required
          />
        </div>
      </section>
      <div className="form-controls">
        <button className="btn-fr" style={{ color: "white" }} type="submit">
          Envoyer le signalement
        </button>
        <button className="btn-fr" type="button" onClick={onClose}>
          Annuler
        </button>
      </div>
    </StyledForm>
  );
}
