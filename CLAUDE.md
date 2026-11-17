# CLAUDE.md

Front public signalements.adresse.data.gouv.fr : permet aux usagers de signaler une erreur ou de proposer une correction d'adresse (backend : api-signalement), et aux sources/agents connectés via ProConnect de consulter et gérer leurs signalements.

## Commandes

```bash
yarn                 # install (yarn uniquement) ; postinstall copie les assets DSFR
cp .env.sample .env
yarn dev             # react-scripts start
yarn build           # build/ (CRA)
yarn start           # sert build/ avec server.js (Express statique)
yarn lint
yarn test            # react-scripts test (jest)
yarn generate:openapi:signalement   # régénère src/api/signalement (api-signalement doit tourner en local)
```

## Architecture

Create React App (react-scripts, TypeScript), react-router (routes déclarées dans `src/index.tsx`), DSFR (`@codegouvfr/react-dsfr`) + styled-components, carte maplibre-gl / react-map-gl, visionneuse Panoramax.

- `src/pages/` : une page par route (`SignalementPage`, `CreateAdressePage`, `AlertPage`, `ReportPage`, `SourcePage`, `SourceSettingsPage`, `StatsPage`, `ProconnectCallbackPage`…).
- `src/contexts/` : état global (`signalement`, `source`, `map`, `layout`, `panoramax`).
- `src/composants/` : composants par domaine (`signalement/`, `adresse/`, `map/`, `report/`, `authentification/`…).
- `src/api/` : clients externes — `signalement/` est **généré (ne pas éditer)**, plus `ban-plateforme/`, `api-depot/`, `api-adresse/`, `api-geo/`.
- `src/config/map/` : styles et couches de la carte.

## Points d'attention

- Variables d'env préfixées `REACT_APP_` (injectées au build).
- Le login/logout ProConnect passe par l'API (`${OpenAPI.BASE}/proconnect/...`) : api-signalement doit tourner pour tester l'authentification.
- Tests quasi inexistants (`src/utils/*.test.ts`) : valider avec `yarn lint` + `tsc --noEmit` et un test manuel.
