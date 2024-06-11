import { useLoaderData } from "react-router-dom";
import {
  IBANPlateformeNumero,
  IBANPlateformeResult,
  BANPlateformeResultTypeEnum,
  IBANPlateformeVoie,
  IBANPlateformeLieuDit,
} from "../api/ban-plateforme/types";
import { NumeroCard } from "../composants/adresse/NumeroCard";
import SignalementForm from "../composants/signalement/SignalementForm";
import { Signalement } from "../api/signalement";
import { VoieCard } from "../composants/adresse/VoieCard";
import { LieuDitCard } from "../composants/adresse/LieuDitCard";
import { useContext, useEffect } from "react";
import { MapContext } from "../layouts/MapLayout";
import SignalementContext, {
  SignalementContextType,
} from "../contexts/signalement.context";
import useWindowSize from "../hooks/useWindowSize";

export function AdressePage() {
  const mapContext = useContext(MapContext);
  const { isMobile } = useWindowSize();
  const map = mapContext?.map;

  const { adresse } = useLoaderData() as {
    adresse: IBANPlateformeResult;
  };

  useEffect(() => {
    if (!map) {
      return;
    }

    let position;
    if ((adresse as any).displayBBox) {
      const voieOrLieuDit = adresse as
        | IBANPlateformeVoie
        | IBANPlateformeLieuDit;
      position = [
        (voieOrLieuDit.displayBBox[0] + voieOrLieuDit.displayBBox[2]) / 2,
        (voieOrLieuDit.displayBBox[1] + voieOrLieuDit.displayBBox[3]) / 2,
      ];
    } else {
      const numero = adresse as IBANPlateformeNumero;
      position = [numero.lon, numero.lat];
    }
    map.flyTo({
      center: position as [number, number],
      offset: [0, isMobile ? -100 : 0],
      zoom: 20,
      screenSpeed: 2,
    });
  }, [map, adresse, isMobile]);

  const {
    createSignalement,
    deleteSignalement,
    signalement,
    onEditSignalement,
    isEditParcellesMode,
    setIsEditParcellesMode,
  } = useContext(SignalementContext) as SignalementContextType;

  const handleCloseSignalementForm = () => {
    deleteSignalement();
  };

  return (
    <>
      {!signalement && (
        <>
          {adresse.type === BANPlateformeResultTypeEnum.NUMERO && (
            <NumeroCard
              adresse={adresse as IBANPlateformeNumero}
              createSignalement={createSignalement}
            />
          )}
          {adresse.type === BANPlateformeResultTypeEnum.VOIE && (
            <VoieCard
              adresse={adresse as IBANPlateformeVoie}
              createSignalement={createSignalement}
            />
          )}
          {adresse.type === BANPlateformeResultTypeEnum.LIEU_DIT && (
            <LieuDitCard
              adresse={adresse as IBANPlateformeLieuDit}
              createSignalement={createSignalement}
            />
          )}
        </>
      )}

      {signalement && (
        <SignalementForm
          address={adresse}
          signalement={signalement as Signalement}
          onEditSignalement={onEditSignalement}
          onClose={handleCloseSignalementForm}
          setIsEditParcellesMode={setIsEditParcellesMode}
          isEditParcellesMode={isEditParcellesMode}
        />
      )}
    </>
  );
}
