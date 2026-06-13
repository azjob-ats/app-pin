import { Routes } from '@angular/router';

/** Rotas do laboratório Base Web (Angular), montadas em `/bw`. */
export const BASE_DESIGN_LANGUAGE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/docs-shell/bw-docs-shell.component').then((m) => m.BwDocsShellComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/bw-home.component').then((m) => m.BwHomeComponent),
        data: { title: 'Home' },
      },
      {
        path: 'components',
        loadComponent: () =>
          import('./pages/components/bw-components-page.component').then(
            (m) => m.BwComponentsPageComponent,
          ),
        data: { title: 'Components' },
      },
      // ── Design System › Styles ──────────────────────────────────────────────
      { path: 'design-system/styles/design-tokens',  loadComponent: () => import('./pages/design-system/styles/bw-design-tokens-page.component').then((m) => m.BwDesignTokensPageComponent),   data: { title: 'Design Tokens' } },
      {
        path: 'design-system/:group/:page',
        loadComponent: () =>
          import('./pages/design-system/bw-design-system-page.component').then(
            (m) => m.BwDesignSystemPageComponent,
          ),
      },
    ],
  },
];
