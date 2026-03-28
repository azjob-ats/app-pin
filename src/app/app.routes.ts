import { Routes } from '@angular/router';
import { environment } from 'src/environments/environment';

const { ROUTES } = environment;

export const routes: Routes = [
  {
    path: ROUTES.STYLEGUIDE.ROOT,
    loadComponent: () =>
      import('./domain/styleguide/pages/styleguide/styleguide.component').then(
        (m) => m.StyleguideComponent,
      ),
  },
  {
    path: `${ROUTES.STYLEGUIDE.ROOT}/:section`,
    loadComponent: () =>
      import('./domain/styleguide/pages/styleguide/styleguide.component').then(
        (m) => m.StyleguideComponent,
      ),
  },
  {
    path: ROUTES.AUTH.ROOT,
    loadComponent: () =>
      import('./domain/auth/pages/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent,
      ),
    children: [
      {
        path: ROUTES.AUTH.LOGIN,
        loadComponent: () =>
          import('./domain/auth/pages/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: ROUTES.AUTH.REGISTER,
        loadComponent: () =>
          import('./domain/auth/pages/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
      },
      {
        path: ROUTES.AUTH.FORGOT_PASSWORD,
        loadComponent: () =>
          import('./domain/auth/pages/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent,
          ),
      },
      {
        path: ROUTES.AUTH.RESET_PASSWORD,
        loadComponent: () =>
          import('./domain/auth/pages/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent,
          ),
      },
      {
        path: ROUTES.AUTH.VERIFY_EMAIL,
        loadComponent: () =>
          import('./domain/auth/pages/verify-email/verify-email.component').then(
            (m) => m.VerifyEmailComponent,
          ),
      },
      {
        path: ROUTES.AUTH.VERIFY_CODE,
        loadComponent: () =>
          import('./domain/auth/pages/verify-code/verify-code.component').then(
            (m) => m.VerifyCodeComponent,
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./domain/shell/pages/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: '',
        redirectTo: ROUTES.HOME.ROOT,
        pathMatch: 'full',
      },
      {
        path: ROUTES.HOME.ROOT,
        loadComponent: () =>
          import('./domain/home/pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: ROUTES.EXPLORE.ROOT,
        loadComponent: () =>
          import('./domain/explore/pages/explore/explore.component').then(
            (m) => m.ExploreComponent,
          ),
      },
      {
        path: `${ROUTES.EXPLORE.ROOT}/:category`,
        loadComponent: () =>
          import('./domain/explore/pages/explore/explore.component').then(
            (m) => m.ExploreComponent,
          ),
      },
      {
        path: ROUTES.SEARCH.ROOT,
        loadComponent: () =>
          import('./domain/search/pages/search/search.component').then((m) => m.SearchComponent),
      },
      {
        path: ROUTES.CREATE.ROOT,
        loadComponent: () =>
          import('./domain/create/pages/create/create.component').then((m) => m.CreateComponent),
      },
      {
        path: ROUTES.NOTIFICATIONS.ROOT,
        loadComponent: () =>
          import('./domain/notifications/pages/notifications/notifications.component').then(
            (m) => m.NotificationsComponent,
          ),
      },
      {
        path: `${ROUTES.PIN.ROOT}/:id`,
        loadComponent: () =>
          import('./domain/pin/pages/pin/pin.component').then((m) => m.PinComponent),
      },
      {
        path: ROUTES.PROFILE.ROOT,
        loadComponent: () =>
          import('./domain/profile/pages/profile/profile.component').then(
            (m) => m.ProfileComponent,
          ),
      },
      {
        path: ROUTES.BOARD.ROOT,
        loadComponent: () =>
          import('./domain/board/pages/board/board.component').then((m) => m.BoardComponent),
      },
    ],
  },
  { path: '**', redirectTo: `/${ROUTES.HOME.ROOT}` },
];
