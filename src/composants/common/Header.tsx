import { Source } from "../../api/signalement";

interface HeaderProps {
  customSource?: Source;
}

export function Header({ customSource }: HeaderProps) {
  return (
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
                <a href="/" title="Accueil - Mes Signalements - DINUM)">
                  <p className="fr-header__service-title">Mes Signalements</p>
                </a>
                <p className="fr-header__service-tagline">
                  Signaler un problème dans la Base Adresse Nationale
                </p>
              </div>
            </div>
            <div className="fr-header__tools">
              {customSource && customSource.nom}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
