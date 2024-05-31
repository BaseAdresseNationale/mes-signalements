import { useState } from "react";
import {
  ExistingLocation,
  ExistingNumero,
  ExistingToponyme,
  ExistingVoie,
  Position,
  Signalement,
} from "../lib/signalement";

export const positionTypeOptions = [
  { value: "entrée", label: "Entrée", color: "green" },
  { value: "délivrance postale", label: "Délivrance postale", color: "blue" },
  { value: "bâtiment", label: "Bâtiment", color: "orange" },
  { value: "cage d’escalier", label: "Cage d’escalier", color: "purple" },
  { value: "logement", label: "Logement", color: "red" },
  { value: "parcelle", label: "Parcelle", color: "yellow" },
  { value: "segment", label: "Segment", color: "black" },
  { value: "service technique", label: "Service technique", color: "grey" },
  { value: "inconnue", label: "Inconnu", color: "white" },
];

export const isSignalementAvailable = (address: any) => {
  return (
    address?.type === "voie" ||
    address?.type === "lieu-dit" ||
    address?.type === "numero"
  );
};

export const getPositionTypeLabel = (positionType: Position.type) => {
  return positionTypeOptions.find(({ value }) => value === positionType)?.label;
};

export function getExistingLocationType(type: string) {
  switch (type) {
    case "voie":
      return ExistingLocation.type.VOIE;
    case "lieu-dit":
      return ExistingLocation.type.TOPONYME;
    case "numero":
      return ExistingLocation.type.NUMERO;
    default:
      throw new Error(
        `Impossible de créer un signalement pour le type : ${type}`
      );
  }
}

export function getExistingLocationLabel(address: any) {
  switch (address.type) {
    case "voie":
      return address.nomVoie;
    case "lieu-dit":
      return address.nomVoie;
    case "numero":
      return `${address.numero} ${address.suffixe || ""} ${
        address.voie.nomVoie
      }`;
    default:
      throw new Error(
        `Impossible de créer un signalement pour le type : ${address.type}`
      );
  }
}

export function getExistingLocation(
  address: any
): ExistingNumero | ExistingVoie | ExistingToponyme {
  switch (address.type) {
    case "voie":
      return {
        type: ExistingLocation.type.VOIE,
        nom: address.nomVoie,
      } as ExistingVoie;
    case "lieu-dit":
      return {
        type: ExistingLocation.type.TOPONYME,
        nom: address.nomVoie,
        position: {
          point: {
            type: "Point",
            coordinates: [address.lon, address.lat],
          },
          type: address.positionType,
        },
        parcelles: address.parcelles,
      } as ExistingToponyme;
    case "numero":
      return {
        type: ExistingLocation.type.NUMERO,
        numero: address.numero,
        suffixe: address.suffixe,
        position: {
          point: {
            type: "Point",
            coordinates: [address.lon, address.lat],
          },
          type: address.positionType,
        },
        parcelles: address.parcelles,
        toponyme: {
          type: ExistingLocation.type.VOIE,
          nom: address.voie.nomVoie,
        },
      } as ExistingNumero;
    default:
      throw new Error(
        `Impossible de créer un signalement pour le type : ${address.type}`
      );
  }
}

export const getInitialSignalement = (
  address: any,
  signalementType?: Signalement.type
): Signalement | null => {
  if (!address || !isSignalementAvailable(address)) {
    return null;
  }

  const initialSignalement: Partial<Signalement> = {
    type: signalementType,
    codeCommune: address.commune.code,
    author: {
      firstName: "",
      lastName: "",
      email: "",
    },
    changesRequested: {},
  };

  if (signalementType === Signalement.type.LOCATION_TO_CREATE) {
    initialSignalement.changesRequested = {
      numero: null,
      suffixe: "",
      nomVoie: address.nomVoie,
      positions: [],
      parcelles: [],
    };
    initialSignalement.existingLocation = {
      type: ExistingLocation.type.VOIE,
      nom: address.nomVoie,
    };
  } else if (signalementType === Signalement.type.LOCATION_TO_UPDATE) {
    if (address.type === "voie") {
      initialSignalement.changesRequested = {
        nom: address.nomVoie,
      };
    } else if (address.type === "lieu-dit") {
      initialSignalement.changesRequested = {
        nom: address.nomVoie,
        // For the moment we don't allow to change the position of a toponyme
        // positions: address.positions,
        // parcelles: address.parcelles
      };
    } else {
      initialSignalement.changesRequested = {
        numero: address.numero,
        suffixe: address.suffixe,
        nomVoie: address.voie.nomVoie,
        positions: address.positions.map(
          ({
            position,
            positionType,
          }: {
            position: any;
            positionType: Position.type;
          }) => ({
            point: {
              type: "Point",
              coordinates: [...position.coordinates],
            },
            type: positionType,
          })
        ),
        parcelles: address.parcelles,
      };
    }

    initialSignalement.existingLocation = getExistingLocation(address);
  } else if (signalementType === Signalement.type.LOCATION_TO_DELETE) {
    initialSignalement.changesRequested = {
      comment: "",
    };
    initialSignalement.existingLocation = getExistingLocation(address);
  }

  return initialSignalement as Signalement;
};

export function useSignalement(address: any) {
  const [signalement, setSignalement] = useState<Signalement | null>(null);
  const [isEditParcellesMode, setIsEditParcellesMode] = useState(false);

  const createSignalement = (signalementType: Signalement.type) => {
    setSignalement(getInitialSignalement(address, signalementType));
  };

  const deleteSignalement = () => {
    setSignalement(null);
  };

  const onEditSignalement =
    (property: keyof Signalement, key: string) => (value: any) => {
      setSignalement(
        (state) =>
          state &&
          ({
            ...state,
            [property]: {
              ...(state[property] as {}),
              [key]: value,
            },
          } as Signalement)
      );
    };

  return {
    createSignalement,
    deleteSignalement,
    signalement,
    isSignalementAvailable: isSignalementAvailable(address),
    onEditSignalement,
    isEditParcellesMode,
    setIsEditParcellesMode,
  };
}
