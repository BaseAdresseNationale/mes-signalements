import { getExistingLocationLabel } from "../../hooks/useSignalement";
import { Signalement } from "../../api/signalement";
import { IBANPlateformeNumero } from "../../api/ban-plateforme/types";
import { Card } from "../common/Card";

interface NumeroCardProps {
  adresse: IBANPlateformeNumero;
  createSignalement: (type: Signalement.type) => void;
}

export function NumeroCard({ adresse, createSignalement }: NumeroCardProps) {
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
        <li>
          Code postal : <b>{adresse.codePostal}</b>
        </li>
        <li>
          Clé d'interopérabilité : <b>{adresse.id}</b>
        </li>
      </ul>

      {adresse.parcelles?.length > 0 && (
        <div>
          <h3>Parcelles rattachées</h3>
          <ul>
            {adresse.parcelles.map((parcelle) => (
              <li key={parcelle}>{parcelle}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3>Certification</h3>
        <p>
          {adresse.certifie ? (
            <>✅ Cette adresse a été certifiée par la commune</>
          ) : (
            <>❌ Cette adresse n'a pas été certifiée par la commune</>
          )}
        </p>
      </div>

      <button
        type="button"
        className="fr-btn"
        onClick={() => createSignalement(Signalement.type.LOCATION_TO_UPDATE)}
      >
        Demander une modification
      </button>
      <button
        type="button"
        className="fr-btn"
        onClick={() => createSignalement(Signalement.type.LOCATION_TO_DELETE)}
      >
        Demander la suppression
      </button>
    </Card>
  );
}
