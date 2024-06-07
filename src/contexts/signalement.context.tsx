import { createContext, useState } from "react";
import { Signalement } from "../api/signalement";
import { getInitialSignalement } from "../utils/signalement.utils";
import { IBANPlateformeResult } from "../api/ban-plateforme/types";

export interface SignalementContextType {
  signalement: Signalement | null;
  createSignalement: (
    signalementType: Signalement.type,
    adresse: IBANPlateformeResult
  ) => void;
  deleteSignalement: () => void;
  onEditSignalement: (
    property: keyof Signalement,
    key: string
  ) => (value: any) => void;
  isEditParcellesMode: boolean;
  setIsEditParcellesMode: (isEditParcellesMode: boolean) => void;
}

const SignalementContext = createContext<SignalementContextType | null>(null);

export function SignalementContextProvider(props: {
  children: React.ReactNode;
}) {
  const [signalement, setSignalement] = useState<Signalement | null>(null);
  const [isEditParcellesMode, setIsEditParcellesMode] = useState(false);

  const createSignalement = (
    signalementType: Signalement.type,
    adresse: IBANPlateformeResult
  ) => {
    setSignalement(getInitialSignalement(adresse, signalementType));
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

  const value = {
    signalement,
    createSignalement,
    deleteSignalement,
    onEditSignalement,
    isEditParcellesMode,
    setIsEditParcellesMode,
  };

  return <SignalementContext.Provider value={value} {...props} />;
}

export default SignalementContext;
