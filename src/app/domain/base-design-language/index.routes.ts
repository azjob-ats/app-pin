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
    ],
  },
];
