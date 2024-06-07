import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { MapLayout } from "./layouts/MapLayout";
import { lookup } from "./api/ban-plateforme";
import { AdressePage } from "./pages/AdressePage";
import { OpenAPI } from "./api/signalement";

import "@gouvfr/dsfr/dist/dsfr.min.css";
import "@gouvfr/dsfr/dist/utility/utility.min.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { SignalementContextProvider } from "./contexts/signalement.context";

const API_SIGNALEMENT_URL = process.env.REACT_APP_API_SIGNALEMENT_URL;

if (!API_SIGNALEMENT_URL) {
  throw new Error("REACT_APP_API_SIGNALEMENT_URL is not defined");
}

const API_SIGNALEMENNT_SOURCE_TOKEN =
  process.env.REACT_APP_API_SIGNALEMENT_SOURCE_TOKEN;

if (!API_SIGNALEMENNT_SOURCE_TOKEN) {
  throw new Error("REACT_APP_API_SIGNALEMENT_SOURCE_TOKEN is not defined");
}

Object.assign(OpenAPI, {
  BASE: API_SIGNALEMENT_URL,
  TOKEN: API_SIGNALEMENNT_SOURCE_TOKEN,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <MapLayout />,
  },
  {
    path: "/:code",
    element: (
      <MapLayout>
        <AdressePage />
      </MapLayout>
    ),
    loader: async ({ params }) => {
      if (!params.code) {
        return {
          adresse: null,
        };
      }
      const adresse = await lookup(params.code);

      return {
        adresse,
      };
    },
    errorElement: <div>Une erreur est survenue</div>,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <SignalementContextProvider>
      <RouterProvider router={router} />
    </SignalementContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
