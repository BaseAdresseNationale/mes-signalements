import { useState } from "react";
import SignalementToponymeForm from "./signalement-toponyme/SignalementToponymeForm";
import SignalementNumeroForm from "./signalement-numero/SignalementNumeroForm";
import RecapModal from "./RecapModal";
import SignalementNumeroDeleteForm from "./signalement-numero/SignalementNumeroDeleteForm";
import { Signalement } from "../../api/signalement";

interface SignalementFormProps {
  signalement: Signalement;
  onEditSignalement: any;
  onClose: any;
  address: any;
  setIsEditParcellesMode: any;
  isEditParcellesMode: boolean;
}

export default function SignalementForm({
  signalement,
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
