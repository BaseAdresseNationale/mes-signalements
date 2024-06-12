import styled from "styled-components";
import Map, { MapRef } from "react-map-gl/maplibre";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Header } from "../composants/common/Header";
import { Drawer } from "../composants/common/Drawer";
import {
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import { AdresseSearch } from "../composants/adresse/AdresseSearch";
import SignalementMap from "../composants/map/SignalementMap";
import SignalementContext, {
  SignalementContextType,
} from "../contexts/signalement.context";
import Loader from "../composants/common/Loader";
import { IBANPlateformeNumero } from "../api/ban-plateforme/types";
import { Marker } from "../composants/map/Marker";
import {
  getExistingLocationLabel,
  getSignalementPositionColor,
} from "../utils/signalement.utils";
import useNavigateWithPreservedSearchParams from "../hooks/useNavigateWithPreservedSearchParams";
import { Source, SourcesService } from "../api/signalement";

const Layout = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;

  > header {
    flex: 0 0 auto;
  }

  > .main-wrapper {
    flex: 1 1 auto;
    position: relative;
    height: 100%;
    overflow: hidden;

    .loader-wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export const ANIMATION_DURATION = 300;

interface MapContextValue {
  map: MapRef | null;
}

export const MapContext = createContext<MapContextValue | null>(null);

interface MapLayoutProps {
  children?: React.ReactNode;
}

export function MapLayout({ children }: MapLayoutProps) {
  const [customSource, setCustomSource] = useState<Source>();
  const mapRef = useRef<MapRef>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const {
    isEditParcellesMode,
    signalement,
    onEditSignalement,
    deleteSignalement,
  } = useContext(SignalementContext) as SignalementContextType;

  const { navigate } = useNavigateWithPreservedSearchParams();
  let [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const location = useLocation();
  const loaderData = useLoaderData();
  const adresse = (loaderData as { adresse: IBANPlateformeNumero })?.adresse;

  useEffect(() => {
    if (!drawerRef.current || !searchRef.current) {
      return;
    }

    if (location.pathname !== "/" || navigation.location) {
      searchRef.current.classList.remove("show");
      searchRef.current.setAttribute("aria-hidden", "true");
      drawerRef.current.classList.add("open");
      drawerRef.current.setAttribute("aria-hidden", "false");
    } else {
      searchRef.current.classList.add("show");
      searchRef.current.setAttribute("aria-hidden", "false");
      drawerRef.current.classList.remove("open");
      drawerRef.current.setAttribute("aria-hidden", "true");
    }
  }, [navigation, location]);

  useEffect(() => {
    async function fetchCustomSource() {
      const source = await SourcesService.getSourceById(
        searchParams.get("sourceId") as string
      );

      setCustomSource(source);
    }
    if (!searchParams.has("sourceId")) {
      return;
    }

    fetchCustomSource();
  }, [searchParams]);

  const handleCloseDrawer = () => {
    deleteSignalement();
    navigate("/");
  };

  return (
    <MapContext.Provider value={{ map: mapRef.current }}>
      <Layout>
        <Header customSource={customSource} />
        <div className="main-wrapper">
          <Map
            ref={mapRef}
            style={{
              zIndex: 0,
              position: "absolute",
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
            initialViewState={{
              longitude: 2,
              latitude: 47,
              zoom: 5.5,
            }}
            mapStyle="https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json"
          >
            {!signalement?.changesRequested?.positions &&
              adresse?.lat &&
              adresse?.lon && (
                <Marker
                  label={getExistingLocationLabel(adresse)}
                  coordinates={[adresse.lon, adresse.lat]}
                  color={getSignalementPositionColor(adresse.positionType)}
                />
              )}
            {signalement?.changesRequested?.positions && (
              <SignalementMap
                isEditParcellesMode={isEditParcellesMode}
                signalement={signalement}
                onEditSignalement={onEditSignalement}
              />
            )}
          </Map>
          <AdresseSearch ref={searchRef} />
          <Drawer ref={drawerRef} onClose={handleCloseDrawer}>
            {navigation.state === "loading" && (
              <div className="loader-wrapper">
                <Loader />
              </div>
            )}
            {children}
          </Drawer>
        </div>
      </Layout>
    </MapContext.Provider>
  );
}
