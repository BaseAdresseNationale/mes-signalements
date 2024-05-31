import { useCallback, useMemo } from "react";
import { Marker, Layer, Source, useMap } from "react-map-gl/maplibre";
import { positionTypeOptions } from "../hooks/useSignalement";
import { useCadastre, parcelleHoveredLayer } from "../hooks/useCadastre";
import { cadastreLayers } from "./map/layers";
import { Position, Signalement } from "../lib/signalement";

interface SignalementMapProps {
  signalement: Signalement;
  onEditSignalement: (property: string, key: string) => (value: any) => void;
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

  const getSignalementPositionColor = useCallback(
    (positionType: Position.type) => {
      return (
        positionTypeOptions.find(({ value }) => value === positionType)
          ?.color || "white"
      );
    },
    []
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
          key={index} // eslint-disable-line react/no-array-index-key
          longitude={point.coordinates[0]}
          latitude={point.coordinates[1]}
          anchor="bottom"
          draggable
          onDragEnd={onMarkerDragEnd(index)}
        >
          <label
            className="map-pin-label"
            style={{ color: getSignalementPositionColor(type) }}
          >
            {getSignalementPositionLabel(type)}
          </label>
          {/* <style jsx>{`
            .map-pin-label {
              position: absolute;
              top: -20px;
              white-space: nowrap;
              transform: translateX(calc(-50% + 10px));
            }
          `}</style> */}
          <span
            className="fr-icon-map-pin-2-line"
            aria-hidden="true"
            style={{ color: getSignalementPositionColor(type) }}
          />
        </Marker>
      ))}
    </>
  );
}

export default SignalementMap;
