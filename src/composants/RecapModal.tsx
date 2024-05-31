import React, { useState } from "react";
import { StyledForm } from "./signalement.styles";
import {
  getExistingLocationLabel,
  getPositionTypeLabel,
} from "../hooks/useSignalement";
import { Position, Signalement, SignalementsService } from "../lib/signalement";
import Modal from "./common/Modal";

interface SignalementRecapModalProps {
  signalement: Signalement;
  onEditSignalement: (property: string, key: string) => (event: string) => void;
  onClose: () => void;
  address: any;
  onSubmit: () => void;
}

export default function SignalementRecapModal({
  signalement,
  onEditSignalement,
  onClose,
  address,
  onSubmit,
}: SignalementRecapModalProps) {
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus("loading");
    try {
      await SignalementsService.createSignalement(signalement);
      setSubmitStatus("success");
      setTimeout(() => {
        onSubmit();
      }, 2000);
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    }
  };

  const { numero, suffixe, nomVoie, positions, parcelles, nom } =
    signalement.changesRequested;

  return (
    <Modal title="Votre demande de signalement" onClose={onClose}>
      <StyledForm onSubmit={handleSubmit}>
        {signalement.type === "LOCATION_TO_UPDATE" && (
          <section>
            <h4>Récapitulatif</h4>
            <div className="signalement-recap">
              <div>
                <h5>Lieu concerné</h5>
                <p>{getExistingLocationLabel(address)}</p>
                {address.positions && (
                  <>
                    <h6>Positions : </h6>
                    {address.positions.map(
                      (
                        {
                          position,
                          positionType,
                        }: { position: any; positionType: Position.type },
                        index: number
                      ) => {
                        return (
                          <React.Fragment key={index}>
                            <b>{getPositionTypeLabel(positionType)}</b> :{" "}
                            {position.coordinates[0]}, {position.coordinates[1]}
                            <br />
                          </React.Fragment>
                        ); // eslint-disable-line react/no-array-index-key
                      }
                    )}
                  </>
                )}
                {address.parcelles && (
                  <>
                    <h6>Parcelles : </h6>
                    {address.parcelles.map(
                      (parcelle: string, index: number) => (
                        <div key={index}>{parcelle}</div>
                      )
                    )}
                  </>
                )}
              </div>
              <div>
                <h5>Modifications demandées</h5>
                <p>
                  {numero} {suffixe} {nomVoie} {nom}
                </p>
                {positions && (
                  <>
                    <h6>Positions : </h6>
                    {positions.map(({ point, type }, index) => {
                      return (
                        <React.Fragment key={index}>
                          <b>{getPositionTypeLabel(type)}</b> :{" "}
                          {point.coordinates[0]}, {point.coordinates[1]}
                          <br />
                        </React.Fragment>
                      ); // eslint-disable-line react/no-array-index-key
                    })}
                  </>
                )}
                {parcelles && (
                  <>
                    <h6>Parcelles : </h6>
                    {parcelles.map((parcelle, index) => (
                      <div key={index}>{parcelle}</div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </section>
        )}
        <section>
          <h4>Contact</h4>
          <p>
            Pour vous tenir informé de l&apos;avancement de votre signalement,
            merci de renseigner vos coordonnées.
          </p>
          <div className="form-row">
            <label className="fr-label" htmlFor="lastName">
              Nom
            </label>
            <input
              name="lastName"
              className="fr-input"
              value={signalement.author?.lastName || ""}
              onChange={(event) =>
                onEditSignalement("author", "lastName")(event.target.value)
              }
            />

            <label className="fr-label" htmlFor="firstName">
              Prénom
            </label>
            <input
              name="firstName"
              className="fr-input"
              value={signalement.author?.firstName || ""}
              onChange={(event) =>
                onEditSignalement("author", "firstName")(event.target.value)
              }
            />
          </div>

          <label className="fr-label" htmlFor="email">
            Email*
          </label>
          <input
            name="email"
            required={true}
            type="email"
            value={signalement.author?.email || ""}
            onChange={(event) =>
              onEditSignalement("author", "email")(event.target.value)
            }
          />
        </section>
        {submitStatus === "success" && (
          <div className="fr-alert fr-alert--success">
            <p>Votre signalement a bien été envoyée.</p>
          </div>
        )}
        {submitStatus === "error" && (
          <div className="fr-alert fr-alert--error">
            <p>
              Une erreur est survenue lors de l&apos;envoi de votre signalement.
              Veuillez réessayer ultérieurement.
            </p>
          </div>
        )}
        <div className="form-controls">
          <button
            className="fr-btn"
            disabled={submitStatus === "loading" || submitStatus === "success"}
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
    </Modal>
  );
}
