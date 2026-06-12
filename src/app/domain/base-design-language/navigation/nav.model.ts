/**
 * Modelo de navegação do site de docs. Espelha `documentation-site/routes.jsx`
 * do Base Web (hierarquia/categorias/ids idênticos). Fonte única p/ rotas, sidebar e busca.
 */
export type BwNavStatus = 'ready' | 'soon' | 'na';

export interface BwNavItem {
  label: string;
  /** Caminho relativo à raiz do DS (`/bw`). '' = home. Ex.: 'components/button'. */
  path: string;
  status: BwNavStatus;
  keywords?: string[];
}

export interface BwNavGroup {
  label: string;
  items: BwNavItem[];
}

export interface BwNavCategory {
  label: string;
  icon?: string;
  groups: BwNavGroup[];
}
