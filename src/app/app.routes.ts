import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'styleguide',
    loadComponent: () => import('./domain/styleguide/pages/styleguide/styleguide.component').then(m => m.StyleguideComponent),
  },
  {
    path: 'auth',
    loadComponent: () => import('./domain/auth/pages/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./domain/auth/pages/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./domain/auth/pages/register/register.component').then(m => m.RegisterComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./domain/auth/pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./domain/auth/pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./domain/auth/pages/verify-email/verify-email.component').then(m => m.VerifyEmailComponent),
      },
      {
        path: 'verify-code',
        loadComponent: () => import('./domain/auth/pages/verify-code/verify-code.component').then(m => m.VerifyCodeComponent),
      },
    ],
  },
  {
    path: '',
    loadComponent: () => import('./domain/shell/pages/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./domain/home/pages/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'explore',
        loadComponent: () => import('./domain/explore/pages/explore/explore.component').then(m => m.ExploreComponent),
      },
      {
        path: 'explore/:category',
        loadComponent: () => import('./domain/explore/pages/explore/explore.component').then(m => m.ExploreComponent),
      },
      {
        path: 'search',
        loadComponent: () => import('./domain/search/pages/search/search.component').then(m => m.SearchComponent),
      },
      {
        path: 'create',
        loadComponent: () => import('./domain/create/pages/create/create.component').then(m => m.CreateComponent),
      },
      {
        path: 'notifications',
        loadComponent: () => import('./domain/notifications/pages/notifications/notifications.component').then(m => m.NotificationsComponent),
      },
      {
        path: 'pin/:id',
        loadComponent: () => import('./domain/pin/pages/pin/pin.component').then(m => m.PinComponent),
      },
      {
        path: ':username',
        loadComponent: () => import('./domain/profile/pages/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: ':username/boards/:boardId',
        loadComponent: () => import('./domain/board/pages/board/board.component').then(m => m.BoardComponent),
      },
    ],
  },
  { path: '**', redirectTo: '/home' },
];


