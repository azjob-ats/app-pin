import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'styleguide',
    loadComponent: () => import('./domain/styleguide/pages/styleguide-page/styleguide-page.component').then(m => m.StyleguidePageComponent),
  },
  { path: '**', redirectTo: '/home' },
];
