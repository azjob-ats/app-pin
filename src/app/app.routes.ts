import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./domain/home/pages/home-page/home-page.component').then(m => m.HomePageComponent),
      },
      {
        path: 'explore',
        loadComponent: () => import('./domain/explore/pages/explore-page/explore-page.component').then(m => m.ExplorePageComponent),
      },
      {
        path: 'explore/:category',
        loadComponent: () => import('./domain/explore/pages/explore-page/explore-page.component').then(m => m.ExplorePageComponent),
      },
      {
        path: 'search',
        loadComponent: () => import('./domain/search/pages/search-page/search-page.component').then(m => m.SearchPageComponent),
      },
      {
        path: 'create',
        loadComponent: () => import('./domain/create/pages/create-page/create-page.component').then(m => m.CreatePageComponent),
      },
      {
        path: 'notifications',
        loadComponent: () => import('./domain/notifications/pages/notifications-page/notifications-page.component').then(m => m.NotificationsPageComponent),
      },
      {
        path: 'pin/:id',
        loadComponent: () => import('./domain/pin/pages/pin-page/pin-page.component').then(m => m.PinPageComponent),
      },
      {
        path: ':username',
        loadComponent: () => import('./domain/profile/pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent),
      },
      {
        path: ':username/boards/:boardId',
        loadComponent: () => import('./domain/board/pages/board-page/board-page.component').then(m => m.BoardPageComponent),
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () => import('./shared/components/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./domain/auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./domain/auth/pages/register-page/register-page.component').then(m => m.RegisterPageComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./domain/auth/pages/forgot-password-page/forgot-password-page.component').then(m => m.ForgotPasswordPageComponent),
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./domain/auth/pages/reset-password-page/reset-password-page.component').then(m => m.ResetPasswordPageComponent),
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./domain/auth/pages/verify-email-page/verify-email-page.component').then(m => m.VerifyEmailPageComponent),
      },
      {
        path: 'verify-code',
        loadComponent: () => import('./domain/auth/pages/verify-code-page/verify-code-page.component').then(m => m.VerifyCodePageComponent),
      },
    ],
  },
  { path: '**', redirectTo: '/home' },
];
