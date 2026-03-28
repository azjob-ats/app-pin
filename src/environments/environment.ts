import { StorageStrategy } from '@shared/enums/storage.enum';

export const environment = {
  API_BASE_URL: import.meta.env.NG_APP_BASE_URL,
  APP_NAME: import.meta.env.NG_APP_NAME,
  PAY_LOAD_STORAGE: {
    systemLanguage: {
      encryptionKey: import.meta.env.NG_APP_SYSTEM_LANGUAGE_ENCRYPTION_KEY,
      tableName: import.meta.env.NG_APP_SYSTEM_LANGUAGE_TABLE_NAME,
      storageStrategy: StorageStrategy.LOCAL_STORAGE,
    },
    token: {
      encryptionKey: '',
      tableName: 'token',
      storageStrategy: StorageStrategy.LOCAL_STORAGE,
    },
    user: {
      encryptionKey: '',
      tableName: 'user',
      storageStrategy: StorageStrategy.LOCAL_STORAGE,
    },
  },
  API: {
    AUTH: {
      SIGNIN_WITH_EMAIL_AND_PASSWORD: '/api/v1/auth/sign-in-with-email-and-password',
      SIGNUP_WITH_EMAIL_AND_PASSWORD: '/api/v1/auth/sign-up-with-email-and-password',
    },
    INPUT_MENU_STEP_SECTION: {
      SECTION: '/api/v1/public/input-menu-section',
    },
    PINS: {
      LIST: '/api/pins',
      FEED: '/api/pins/feed',
      DETAIL: '/api/pins/:id',
      RELATED: '/api/pins/:id/related',
      COMMENTS: '/api/pins/:id/comments',
      SAVE: '/api/pins/:id/save',
    },
    USERS: {
      LIST: '/api/users',
      ME: '/api/users/me',
      DETAIL: '/api/users/:id',
      PINS: '/api/users/:id/pins',
      BOARDS: '/api/users/:id/boards',
      FOLLOW: '/api/users/:id/follow',
    },
    BOARDS: {
      LIST: '/api/boards',
      DETAIL: '/api/boards/:id',
      PINS: '/api/boards/:id/pins',
    },
    NOTIFICATIONS: {
      LIST: '/api/notifications',
      READ: '/api/notifications/:id/read',
      READ_ALL: '/api/notifications/read-all',
    },
  },
  ROUTES: {
    AUTH: {
      ROOT: 'auth',
      LOGIN: 'login',
      REGISTER: 'register',
      FORGOT_PASSWORD: 'forgot-password',
      RESET_PASSWORD: 'reset-password',
      VERIFY_EMAIL: 'verify-email',
      VERIFY_CODE: 'verify-code',
      SIGN_IN: '/auth/login',
      SIGN_UP: '/auth/register',
      CONFIRM_EMAIL: '/auth/verify-email',
      FORGOT: '/auth/forgot-password',
      LOGOUT: '/auth/logout',
    },
    STYLEGUIDE: {
      ROOT: 'styleguide',
    },
    HOME: {
      ROOT: 'home',
    },
    EXPLORE: {
      ROOT: 'explore',
    },
    SEARCH: {
      ROOT: 'search',
    },
    CREATE: {
      ROOT: 'create',
    },
    NOTIFICATIONS: {
      ROOT: 'notifications',
    },
    PIN: {
      ROOT: 'pin',
    },
    PROFILE: {
      ROOT: ':username',
    },
    BOARD: {
      ROOT: ':username/boards/:boardId',
    },
  },
};
