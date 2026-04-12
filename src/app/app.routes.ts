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
        path: ROUTES.CHANGE_PASSWORD.ROOT,
        loadComponent: () =>
          import('./domain/change-password/pages/change-password/change-password.component').then(
            (m) => m.ChangePasswordComponent,
          ),
        data: {
          title: 'Alterar senha',
          description: 'Crie uma senha forte e exclusiva para manter sua conta segura.',
        },
      },
      {
        path: ROUTES.ACCOUNT_INFO.ROOT,
        loadComponent: () =>
          import('./domain/account-info/pages/account-info/account-info.component').then(
            (m) => m.AccountInfoComponent,
          ),
        data: {
          title: 'Informações da conta',
          description: 'Atualize as informações da sua conta na plataforma RealWe.',
        },
      },
      {
        path: ROUTES.DELETE_ACCOUNT.ROOT,
        loadComponent: () =>
          import('./domain/delete-account/pages/delete-account/delete-account.component').then(
            (m) => m.DeleteAccountComponent,
          ),
        data: {
          title: 'Encerrar conta',
          description: 'Remova sua conta permanentemente da plataforma RealWe.',
        },
      },
      {
        path: ROUTES.CLEAR_HISTORY.ROOT,
        loadComponent: () =>
          import('./domain/clear-history/pages/clear-history/clear-history.component').then(
            (m) => m.ClearHistoryComponent,
          ),
        data: {
          title: 'Limpar histórico',
          description: 'Apague registros de visualizações, candidaturas ou buscas feitas na plataforma.',
        },
      },
      {
        path: ROUTES.ACTIVITY_VISIBILITY.ROOT,
        loadComponent: () =>
          import('./domain/activity-visibility/pages/activity-visibility/activity-visibility.component').then(
            (m) => m.ActivityVisibilityComponent,
          ),
        data: {
          title: 'Visibilidade de atividades',
          description: 'Gerencie quem pode ver suas ações, candidaturas e interações na plataforma.',
        },
      },
      {
        path: ROUTES.DOWNLOAD_DATA.ROOT,
        loadComponent: () =>
          import('./domain/download-data/pages/download-data/download-data.component').then(
            (m) => m.DownloadDataComponent,
          ),
        data: {
          title: 'Baixar seus dados',
          description: 'Solicite um arquivo com todas as informações armazenadas sobre sua conta.',
        },
      },
      {
        path: ROUTES.DEACTIVATE_ACCOUNT.ROOT,
        loadComponent: () =>
          import('./domain/deactivate-account/pages/deactivate-account/deactivate-account.component').then(
            (m) => m.DeactivateAccountComponent,
          ),
        data: {
          title: 'Desativar conta',
          description: 'Desative temporariamente sua conta na plataforma RealWe.',
        },
      },
      {
        path: ROUTES.CONSENT_MANAGEMENT.ROOT,
        loadComponent: () =>
          import('./domain/consent-management/pages/consent-management/consent-management.component').then(
            (m) => m.ConsentManagementComponent,
          ),
        data: {
          title: 'Gerenciar consentimento',
          description: 'Controle suas preferências sobre coleta e uso de dados pela plataforma RealWe.',
        },
      },
      {
        path: ROUTES.CONNECTED_DEVICES.ROOT,
        loadComponent: () =>
          import('./domain/connected-devices/pages/connected-devices/connected-devices.component').then(
            (m) => m.ConnectedDevicesComponent,
          ),
        data: {
          title: 'Dispositivos conectados',
          description: 'Veja e gerencie todos os dispositivos que acessaram sua conta.',
        },
      },
      {
        path: ROUTES.NOTIFICATION_SETTINGS.ROOT,
        loadComponent: () =>
          import('./domain/notification-settings/pages/notification-settings/notification-settings.component').then(
            (m) => m.NotificationSettingsComponent,
          ),
        data: {
          title: 'Notificações',
          description: 'Gerencie suas preferências de notificações por e-mail e push.',
        },
      },
      {
        path: ROUTES.SEND_FEEDBACK.ROOT,
        loadComponent: () =>
          import('./domain/send-feedback/pages/send-feedback/send-feedback.component').then(
            (m) => m.SendFeedbackComponent,
          ),
        data: {
          title: 'Enviar Feedback',
          description: 'Compartilhe suas ideias, sugestões ou reporte problemas à equipe RealWe.',
        },
      },
      {
        path: ROUTES.HELP_CENTER.ROOT,
        loadComponent: () =>
          import('./domain/help-center/pages/help-center/help-center.component').then(
            (m) => m.HelpCenterComponent,
          ),
        data: {
          title: 'Central de Ajuda',
          description: 'Encontre respostas rápidas sobre como usar a plataforma RealWe.',
        },
      },
      {
        path: ROUTES.HIRE_SUPPORT.ROOT,
        loadComponent: () =>
          import('./domain/hire-support/pages/hire-support/hire-support.component').then(
            (m) => m.HireSupportComponent,
          ),
        data: {
          title: 'Contratar Suporte',
          description: 'Abra um chamado ou inicie um chat ao vivo para resolver dúvidas ou reportar incidentes.',
        },
      },
      {
        path: ROUTES.TERMS_AND_POLICIES.ROOT,
        loadComponent: () =>
          import('./domain/terms-and-policies/pages/terms-and-policies/terms-and-policies.component').then(
            (m) => m.TermsAndPoliciesComponent,
          ),
        data: {
          title: 'Termos e Políticas',
          description: 'Termos de Uso, Política de Privacidade e diretrizes da plataforma RealWe.',
        },
      },
      {
        path: ROUTES.ABOUT_REALWE.ROOT,
        loadComponent: () =>
          import('./domain/about-realwe/pages/about-realwe/about-realwe.component').then(
            (m) => m.AboutRealweComponent,
          ),
        data: {
          title: 'Sobre o RealWe',
          description: 'Saiba mais sobre a empresa, equipe e história por trás do RealWe.',
        },
      },
      {
        path: ROUTES.ABOUT_REALWE.APP_VERSION,
        loadComponent: () =>
          import('./domain/about-realwe/pages/app-version/app-version.component').then(
            (m) => m.AppVersionComponent,
          ),
        data: {
          title: 'Sobre o App',
          description: 'Versão atual, data da última atualização e informações de Copyright.',
        },
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
      {
        path: ROUTES.COLLECTION.ROOT,
        loadComponent: () =>
          import('./domain/collection/pages/collection/collection.component').then(
            (m) => m.CollectionPageComponent,
          ),
        data: { title: 'Collection', description: 'Explore esta coleção de conteúdos' },
      },
      {
        path: `${ROUTES.POST.ROOT}/:id`,
        loadComponent: () =>
          import('./domain/post/pages/post/post.component').then((m) => m.PostPageComponent),
        data: { title: 'Post', description: 'Assista e engaje com este conteúdo.' },
      },
    ],
  },
  { path: '**', redirectTo: `/${ROUTES.HOME.ROOT}` },
];
