/* eslint-disable react-hooks/exhaustive-deps */

import { useCallback, useMemo, useEffect, useState } from "react";
import { PARCELLES_MINZOOM } from "../composants/map/layers";
import { MapLayerMouseEvent } from "react-map-gl";

export const parcelleHoveredLayer = {
  id: "parcelle-hovered",
  type: "fill",
  source: "cadastre",
  "source-layer": "parcelles",
  minzoom: PARCELLES_MINZOOM,
  layout: {
    visibility: "none",
  },
  paint: {
    "fill-color": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      "#0053b3",
      "transparent",
    ],
    "fill-opacity": 0.6,
  },
};

interface useCadastreParams {
  map: any;
  parcelles: string[];
  handleEditParcelle: (parcelles: string[]) => void;
}

export const useCadastre = ({
  map,
  parcelles,
  handleEditParcelle,
}: useCadastreParams) => {
  const [hoveredParcelle, setHoveredParcelle] = useState<null | string>(null);

  const cadastreFiltre = useMemo(
    () =>
      parcelles
        ? ["any", ...parcelles.map((id) => ["==", ["get", "id"], id])]
        : ["==", ["get", "id"], ""],
    [parcelles]
  );

  const handleMouseMove = useCallback(
    (e: MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0) {
        if (hoveredParcelle) {
          map.current.setFeatureState(
            {
              source: "cadastre",
              sourceLayer: "parcelles",
              id: hoveredParcelle,
            },
            { hover: false }
          );
        }

        map.current.setFeatureState(
          {
            source: "cadastre",
            sourceLayer: "parcelles",
            id: e.features[0].id,
          },
          { hover: true }
        );
        setHoveredParcelle(e.features[0].id as string);
      }
    },
    [map, hoveredParcelle]
  );

  const handleMouseLeave = useCallback(() => {
    if (hoveredParcelle) {
      map.current.setFeatureState(
        { source: "cadastre", sourceLayer: "parcelles", id: hoveredParcelle },
        { hover: false }
      );
    }

    setHoveredParcelle(null);
  }, [map, hoveredParcelle]);

  const handleSelectParcelle = useCallback(
    (e: MapLayerMouseEvent) => {
      if (map && e && e.features && e.features.length > 0) {
        const selectedParcelle = e.features[0]?.properties?.id;
        if (parcelles.includes(selectedParcelle)) {
          handleEditParcelle(parcelles.filter((id) => id !== selectedParcelle));
        } else if (selectedParcelle) {
          handleEditParcelle([...parcelles, selectedParcelle]);
        }
      }
    },
    [map, parcelles, handleEditParcelle]
  );

  useEffect(() => {
    map.current.on("mousemove", "parcelle-hovered", handleMouseMove);
    map.current.on("mouseleave", "parcelle-hovered", handleMouseLeave);
    map.current.on("click", "parcelle-hovered", handleSelectParcelle);
    return () => {
      map.current.off("mousemove", "parcelle-hovered", handleMouseMove);
      map.current.off("mouseleave", "parcelle-hovered", handleMouseLeave);
      map.current.off("click", "parcelle-hovered", handleSelectParcelle);
    };
  }, [map, handleMouseMove, handleSelectParcelle, handleMouseLeave]);

  return {
    cadastreFiltre,
  };
};