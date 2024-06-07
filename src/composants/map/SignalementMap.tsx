import { useCallback, useMemo } from "react";
import { Layer, Source, useMap } from "react-map-gl/maplibre";
import { useCadastre, parcelleHoveredLayer } from "../../hooks/useCadastre";
import { Position, Signalement } from "../../api/signalement";
import { cadastreLayers } from "./layers";
import {
  getSignalementPositionColor,
  positionTypeOptions,
} from "../../utils/signalement.utils";
import { Marker } from "./Marker";

interface SignalementMapProps {
  signalement: Signalement;
  onEditSignalement: (
    property: keyof Signalement,
    key: string
  ) => (value: any) => void;
  isEditParcellesMode: boolean;
}

function SignalementMap({
  signalement,
  onEditSignalement,
  isEditParcellesMode,
}: SignalementMapProps) {
  const { positions, parcelles } = signalement.changesRequested;
  const map = useMap();
  const { cadastreFiltre } = useCadastre({
    map,
    parcelles: parcelles || [],
    handleEditParcelle: onEditSignalement("changesRequested", "parcelles"),
  });

  const onMarkerDragEnd = useCallback(
    (index: number) => (event: any) => {
      const newPositions = [...(positions as Position[])];
      newPositions[index] = {
        ...newPositions[index],
        point: {
          type: "Point",
          coordinates: [event.lngLat.lng, event.lngLat.lat],
        },
      };
      onEditSignalement("changesRequested", "positions")(newPositions);
    },
    [positions, onEditSignalement]
  );

  const signalementLabel = useMemo(() => {
    const { numero, suffixe, nomVoie } = signalement.changesRequested;

    return [numero, suffixe, nomVoie].reduce((acc, cur) => {
      return cur ? `${acc} ${cur}` : acc;
    }, "");
  }, [signalement.changesRequested]);

  const getSignalementPositionLabel = useCallback(
    (positionType: Position.type) => {
      const positionTypeLabel = positionTypeOptions.find(
        ({ value }) => value === positionType
      )?.label;
      return `${signalementLabel} - ${positionTypeLabel}`;
    },
    [signalementLabel]
  );

  return (
    <>
      <Source
        id="cadastre"
        type="vector"
        url="https://openmaptiles.geo.data.gouv.fr/data/cadastre.json"
      >
        {[...cadastreLayers, parcelleHoveredLayer].map((cadastreLayer) => {
          if (cadastreLayer.id === "parcelle-highlighted") {
            (cadastreLayer as any).filter = cadastreFiltre;
          }

          return (
            <Layer
              key={cadastreLayer.id}
              {...(cadastreLayer as any)}
              layout={{
                ...cadastreLayer.layout,
                visibility: isEditParcellesMode ? "visible" : "none",
              }}
            />
          );
        })}
      </Source>
      {positions?.map(({ point, type }, index) => (
        <Marker
          key={index}
          label={getSignalementPositionLabel(type)}
          coordinates={point.coordinates as [number, number]}
          color={getSignalementPositionColor(type)}
          onDragEnd={onMarkerDragEnd(index)}
        />
      ))}
    </>
  );
}

export default SignalementMap;
