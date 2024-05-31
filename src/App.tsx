import styled from "styled-components";
import "@gouvfr/dsfr/dist/dsfr.min.css";
import "@gouvfr/dsfr/dist/utility/utility.min.css";
import Map from "react-map-gl/maplibre";

const Layout = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;

  > div {
    position: relative;
    width: 100%;
    height: 100%;
  }
`;

const StyledMap = styled(Map)`
  width: 100%;
  height: 100%;
  z-index: 0;
  position: absolute;
`;

const StyledContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  background: white;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

function App() {
  return (
    <Layout>
      <header role="banner" className="fr-header">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className="fr-header__body-row">
              <div className="fr-header__brand fr-enlarge-link">
                <div className="fr-header__brand-top">
                  <div className="fr-header__logo">
                    <p className="fr-logo" />
                  </div>
                </div>
                <div className="fr-header__service">
                  <a href="/" title="Accueil - mes-signalements - DINUM)">
                    <p className="fr-header__service-title">Mes-signalements</p>
                  </a>
                  <p className="fr-header__service-tagline">
                    Signaler un problème dans la Base Adresse Nationnale
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div>
        <StyledMap
          initialViewState={{
            longitude: 2,
            latitude: 47,
            zoom: 5.5,
          }}
          mapStyle="https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json"
        />
        <StyledContainer>
          <div className="fr-search-bar" id="header-search" role="search">
            <input
              className="fr-input"
              type="search"
              id="autocomplete-search"
              name="autocomplete-search"
              style={{ width: 400 }}
              placeholder="20 avenue de Ségur, Paris"
            />
            <button className="fr-btn" title="Rechercher">
              Rechercher
            </button>
          </div>
        </StyledContainer>
      </div>
    </Layout>
  );
}

export default App;
