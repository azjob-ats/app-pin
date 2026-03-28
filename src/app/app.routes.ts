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
        data: { title: 'Entrar', description: 'Entre na sua conta RealWe e descubra conteúdo profissional autêntico.' },
      },
      {
        path: ROUTES.AUTH.REGISTER,
        loadComponent: () =>
          import('./domain/auth/pages/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
        data: { title: 'Criar conta', description: 'Crie sua conta na RealWe e comece a compartilhar conteúdo profissional autêntico.' },
      },
      {
        path: ROUTES.AUTH.FORGOT_PASSWORD,
        loadComponent: () =>
          import('./domain/auth/pages/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent,
          ),
        data: { title: 'Esqueci minha senha' },
      },
      {
        path: ROUTES.AUTH.RESET_PASSWORD,
        loadComponent: () =>
          import('./domain/auth/pages/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent,
          ),
        data: { title: 'Redefinir senha' },
      },
      {
        path: ROUTES.AUTH.VERIFY_EMAIL,
        loadComponent: () =>
          import('./domain/auth/pages/verify-email/verify-email.component').then(
            (m) => m.VerifyEmailComponent,
          ),
        data: { title: 'Verificar e-mail' },
      },
      {
        path: ROUTES.AUTH.VERIFY_CODE,
        loadComponent: () =>
          import('./domain/auth/pages/verify-code/verify-code.component').then(
            (m) => m.VerifyCodeComponent,
          ),
        data: { title: 'Verificar código' },
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
        data: {
          title: 'Início',
          description: 'Descubra conteúdo profissional autêntico criado por colaboradores de empresas reais.',
        },
      },
      {
        path: ROUTES.EXPLORE.ROOT,
        loadComponent: () =>
          import('./domain/explore/pages/explore/explore.component').then(
            (m) => m.ExploreComponent,
          ),
        data: {
          title: 'Explorar',
          description: 'Explore conteúdo por categorias: Vagas, Produtos, Treinamentos, Experiências e muito mais.',
        },
      },
      {
        path: `${ROUTES.EXPLORE.ROOT}/:category`,
        loadComponent: () =>
          import('./domain/explore/pages/explore/explore.component').then(
            (m) => m.ExploreComponent,
          ),
        data: {
          title: 'Explorar',
          description: 'Explore conteúdo por categorias: Vagas, Produtos, Treinamentos, Experiências e muito mais.',
        },
      },
      {
        path: ROUTES.SEARCH.ROOT,
        loadComponent: () =>
          import('./domain/search/pages/search/search.component').then((m) => m.SearchComponent),
        data: {
          title: 'Pesquisar',
          description: 'Pesquise conteúdo profissional, criadores e empresas na RealWe.',
        },
      },
      {
        path: ROUTES.CREATE.ROOT,
        loadComponent: () =>
          import('./domain/create/pages/create/create.component').then((m) => m.CreateComponent),
        data: { title: 'Criar' },
      },
      {
        path: ROUTES.NOTIFICATIONS.ROOT,
        loadComponent: () =>
          import('./domain/notifications/pages/notifications/notifications.component').then(
            (m) => m.NotificationsComponent,
          ),
        data: { title: 'Notificações' },
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
