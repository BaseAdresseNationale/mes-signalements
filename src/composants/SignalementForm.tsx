import { useState } from "react";

import { getExistingLocationLabel } from "../hooks/useSignalement";
import { StyledForm } from "./signalement.styles";
import SignalementToponymeForm from "./signalement-toponyme/SignalementToponymeForm";
import SignalementNumeroForm from "./signalement-numero/SignalementNumeroForm";
import RecapModal from "./RecapModal";
import SignalementNumeroDeleteForm from "./signalement-numero/SignalementNumeroDeleteForm";
import { Signalement } from "../lib/signalement";

interface SignalementFormProps {
  signalement: Signalement;
  createSignalement: (type: Signalement.type) => void;
  onEditSignalement: any;
  onClose: any;
  address: any;
  setIsEditParcellesMode: any;
  isEditParcellesMode: boolean;
}

export default function SignalementForm({
  signalement,
  createSignalement,
  onEditSignalement,
  onClose,
  address,
  setIsEditParcellesMode,
  isEditParcellesMode,
}: SignalementFormProps) {
  const [showRecapModal, setShowRecapModal] = useState(false);

  const getCenterCoords = () => {
    const splittedHash = window.location.hash.split("/");
    return [
      Number.parseFloat(splittedHash[2]),
      Number.parseFloat(splittedHash[1]),
    ];
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowRecapModal(true);
  };

  return (
    <>
      {!signalement && (
        <StyledForm>
          <button className="close-btn" type="button" onClick={onClose}>
            X
          </button>
          <section>
            <h4>Signalement</h4>
            <h5>Lieu concerné</h5>
            <div className="form-row">{getExistingLocationLabel(address)}</div>
            <div className="form-row">
              {address.codePostal} {address.commune.nom}
            </div>
            <br />
            <div className="form-row">
              <button
                type="button"
                style={{ color: "white", marginBottom: 10 }}
                onClick={() =>
                  createSignalement(Signalement.type.LOCATION_TO_UPDATE)
                }
              >
                Demander une modification
              </button>
            </div>
            <div className="form-row">
              {address.type === "numero" && (
                <button
                  type="button"
                  style={{ color: "white", marginBottom: 10 }}
                  onClick={() =>
                    createSignalement(Signalement.type.LOCATION_TO_DELETE)
                  }
                >
                  Demander la suppression
                </button>
              )}
            </div>
          </section>
          {address.type === "voie" && (
            <section>
              <h5>Adresse non référencée</h5>
              <div className="form-row">
                <button
                  type="button"
                  style={{ color: "white", marginBottom: 10 }}
                  onClick={() =>
                    createSignalement(Signalement.type.LOCATION_TO_CREATE)
                  }
                >
                  Signaler un numéro manquant
                </button>
              </div>
            </section>
          )}
        </StyledForm>
      )}

      {signalement?.type === Signalement.type.LOCATION_TO_UPDATE &&
        (address.type === "voie" || address.type === "lieu-dit") && (
          <SignalementToponymeForm
            onClose={onClose}
            onSubmit={handleSubmit}
            onEditSignalement={onEditSignalement}
            signalement={signalement}
            address={address}
          />
        )}

      {signalement?.type === Signalement.type.LOCATION_TO_CREATE &&
        address.type === "voie" && (
          <SignalementNumeroForm
            setIsEditParcellesMode={setIsEditParcellesMode}
            onClose={onClose}
            onSubmit={handleSubmit}
            onEditSignalement={onEditSignalement}
            signalement={signalement}
            isEditParcellesMode={isEditParcellesMode}
            initialPositionCoords={getCenterCoords()}
          />
        )}

      {signalement?.type === Signalement.type.LOCATION_TO_UPDATE &&
        address.type === "numero" && (
          <SignalementNumeroForm
            setIsEditParcellesMode={setIsEditParcellesMode}
            onClose={onClose}
            onSubmit={handleSubmit}
            onEditSignalement={onEditSignalement}
            signalement={signalement}
            isEditParcellesMode={isEditParcellesMode}
            address={address}
            initialPositionCoords={[address.lon, address.lat]}
          />
        )}

      {signalement?.type === Signalement.type.LOCATION_TO_DELETE && (
        <SignalementNumeroDeleteForm
          address={address}
          onClose={onClose}
          onSubmit={handleSubmit}
          onEditSignalement={onEditSignalement}
        />
      )}
      {showRecapModal && (
        <RecapModal
          onSubmit={onClose}
          onClose={() => setShowRecapModal(false)}
          signalement={signalement}
          address={address}
          onEditSignalement={onEditSignalement}
        />
      )}
    </>
  );
}
