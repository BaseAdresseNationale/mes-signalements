# Mes Signalements

"Mes Signalements" est un outil en ligne qui vous permet de contribuer à l'adressage des communes.

Il est disponible en ligne à l'adresse [signalements.adresse.data.gouv.fr](https://signalements.adresse.data.gouv.fr).

## Pré-requis

- [Node.js](https://nodejs.org) 22
- [yarn](https://www.yarnpkg.com)

## Utilisation

### Installation

Installation des dépendances Node.js

```
$ yarn
```

Créer les variables d'environnement

```bash
cp .env.sample .env
```

On pourra ensuite éditer les variables d'environnement dans le fichier `.env` si nécessaire.

### Développement

Lancer le serveur de développement :

```
$ yarn dev
```

### Production

Créer une version de production :

```
$ yarn build
```

Démarrer le serveur (port 3000 par défaut) :

```
$ yarn start
```

### Linter

Rapport du linter (eslint) :

```
$ yarn lint
```

## Configuration

Cette application utilise des variables d'environnement pour sa configuration.
Elles peuvent être définies classiquement ou en créant un fichier `.env` sur la base du modèle `.env.sample`.

| Nom de la variable                    | Description                                |
| ------------------------------------- | ------------------------------------------ |
| `PUBLIC_URL`                          | URL                                        |
| `REACT_APP_API_SIGNALEMENT_URL`       | URL de base de l’API Géo                   |
| `REACT_APP_API_SIGNALEMENT_SOURCE_ID` | URL de base du site adresse.data.gouv.fr   |
| `REACT_APP_BAN_PLATEFORME_URL`        | URL de base de BAN plateforme              |
| `REACT_APP_API_ADRESSE_URL`           | URL de base de l'API Adresse               |
| `REACT_APP_API_DEPOT_URL`             | URL de base de l'API Dépôt                 |
| `REACT_APP_FRIENDLY_CAPTCHA_SITE_KEY` | Paramétrage "Site key" de Friendly Captcha |
| `REACT_APP_SENTRY_DSN`                | URL de Sentry                              |
| `PORT`                                | Port de l'application                      |

Toutes ces variables ont des valeurs par défaut que vous trouverez dans le fichier `.env.sample`.

## Gouvernance

ANCT

## Licence

MIT
