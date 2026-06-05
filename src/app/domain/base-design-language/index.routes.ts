import { Type } from '@angular/core';
import { Routes } from '@angular/router';
import { BW_NAV_ITEMS } from './documentation/navigation/nav.data';

type Loader = () => Promise<Type<unknown>>;

const placeholder: Loader = () =>
  import('./pages/placeholder/bw-placeholder.component').then((m) => m.BwPlaceholderComponent);

/** Páginas já implementadas (status 'ready'). */
const READY: Record<string, Loader> = {
  '': () => import('./pages/home/bw-home.component').then((m) => m.BwHomeComponent),
  'components/accordion': () =>
    import('./pages/components/accordion/accordion.page.component').then((m) => m.BwAccordionPageComponent),
};

const navRoutes: Routes = BW_NAV_ITEMS.map((item) => ({
  path: item.path,
  data: { navPath: item.path, title: item.label },
  loadComponent: READY[item.path] ?? placeholder,
}));

/** Rotas do laboratório Base Web (Angular), montadas em `/bw`. */
export const BASE_DESIGN_LANGUAGE_ROUTES: Routes = [
  {
    // Ladle (explorer de stories) — fora da casca de docs
    path: 'ladle',
    loadComponent: () =>
      import('./layouts/ladle-shell/bw-ladle-shell.component').then((m) => m.BwLadleShellComponent),
    data: { title: 'Components — Ladle' },
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/docs-shell/bw-docs-shell.component').then((m) => m.BwDocsShellComponent),
    children: navRoutes,
  },
];
