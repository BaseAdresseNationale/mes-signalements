import { IBANPlateformeLieuDit } from "../../api/ban-plateforme/types";
import { getExistingLocationLabel } from "../../hooks/useSignalement";
import { Signalement } from "../../api/signalement";
import { Card } from "../common/Card";

interface LieuDitCardProps {
  adresse: IBANPlateformeLieuDit;
  createSignalement: (type: Signalement.type) => void;
}

export function LieuDitCard({ adresse, createSignalement }: LieuDitCardProps) {
  return (
    <Card>
      <h1>{getExistingLocationLabel(adresse)}</h1>
      <h2>
        {adresse.commune.nom} - {adresse.commune.code}
      </h2>
      <ul>
        <li>
          Région : <b>{adresse.commune.region.nom}</b>
        </li>
        <li>
          Département :{" "}
          <b>
            {adresse.commune.departement.nom} (
            {adresse.commune.departement.code})
          </b>
        </li>
      </ul>

      <button
        type="button"
        className="fr-btn"
        onClick={() => createSignalement(Signalement.type.LOCATION_TO_UPDATE)}
      >
        Demander une modification
      </button>
    </Card>
  );
}
