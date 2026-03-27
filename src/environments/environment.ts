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
  },
  ROUTES: {
    AUTH: {
      ROOT: 'auth',
      SIGN_IN: '/auth/sign-in',
      SIGN_UP: '/auth/sign-up',
      CONFIRM_EMAIL: '/auth/confirm-email',
      RESET_PASSWORD: '/auth/reset-password',
      FORGOT: '/auth/forgot-password',
      LOGOUT: '/auth/logout',
    },
  },
};
