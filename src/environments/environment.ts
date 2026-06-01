import { StorageStrategy } from '@shared/enums/storage.enum';

export const environment = {
  URL_LOGO_ICON: 'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1775245595/oie_transparent_2_jhx0jk.png',
  URL_LOGO_ICON_TEXT: 'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1775245621/realweicontext_transparent_ho13mx.png',
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
    CONTENT_CATEGORY: {
      LIST: '/api/content-category',
    },
    RELEVANT_RESEARCH: {
      LIST: '/api/relevant-research',
    },
    SEARCH: {
      CATALOGS: '/api/search/catalogs',
      FILTER_ATTRIBUTES: '/api/search/filter-attributes',
    },
    MENU: {
      SECTIONS: '/api/menu',
      SECTION_ITEMS: '/api/menu/:id',
    },
    LEARN_MORE: {
      CONFIG: '/api/v1/learn-more/:pinId',
      SUBMIT: '/api/v1/learn-more/:pinId/submit',
    },
    POST: {
      LIST: '/api/post',
      DETAIL: '/api/post/:username/:titleLink',
    },
    COLLECTION_BUNDLE: {
      LIST: '/api/collection-bundle',
      DETAIL: '/api/collection-bundle/:collectionNameKey',
    },
    SHOP_WINDOW: {
      LIST: '/api/shop-window',
    },
    WINNING_SLOTS: {
      LIST: '/api/winning-slots',
    },
    CHANNEL: {
      DETAIL: '/api/channel/:profileName',
      GALLERY: '/api/channel/:profileName/gallery',
      COLLECTION: '/api/channel/:profileName/collection',
    },
    CREATOR_PORTFOLIO: {
      DETAIL: '/api/v1/creator-portfolio/:handle',
    },
    INSCRIPTIONS: {
      LIST: '/api/v1/me/inscriptions',
      CANCEL: '/api/v1/me/inscriptions/:id/cancel',
    },
    METRICS: {
      OVERVIEW: '/api/v1/me/metrics',
    },
    SPONSORED_CAMPAIGNS: {
      LIST: '/api/v1/sponsored-campaigns/campaigns',
      DETAIL: '/api/v1/sponsored-campaigns/campaigns/:id',
      CREATE: '/api/v1/sponsored-campaigns/campaigns',
      CANCEL: '/api/v1/sponsored-campaigns/campaigns/:id/cancel',
      PRICING_CALENDAR: '/api/v1/sponsored-campaigns/pricing-calendar',
      ELIGIBLE_VIDEOS: '/api/v1/sponsored-campaigns/eligible-videos',
      PROJECTION: '/api/v1/sponsored-campaigns/projection',
    },
    EMPRESA: {
      ORGANIZATIONS_LIST: '/api/v1/empresa/organizations',
      ORGANIZATION_DETAIL: '/api/v1/empresa/organizations/:slug',
      ORGANIZATION_CREATE: '/api/v1/empresa/organizations',
      ORGANIZATION_UPDATE: '/api/v1/empresa/organizations/:slug',
      ORGANIZATION_FAVORITE: '/api/v1/empresa/organizations/:slug/favorite',
      DEPARTMENTS_LIST: '/api/v1/empresa/organizations/:slug/departments',
      DEPARTMENT_DETAIL: '/api/v1/empresa/organizations/:slug/departments/:deptSlug',
      DEPARTMENT_CREATE: '/api/v1/empresa/organizations/:slug/departments',
      DEPARTMENT_UPDATE: '/api/v1/empresa/organizations/:slug/departments/:deptSlug',
      DEPARTMENT_FAVORITE: '/api/v1/empresa/organizations/:slug/departments/:deptSlug/favorite',
      PRODUCTS_LIST: '/api/v1/empresa/organizations/:slug/products',
      PRODUCT_DETAIL: '/api/v1/empresa/organizations/:slug/products/:id',
      PRODUCT_CREATE: '/api/v1/empresa/organizations/:slug/products',
      PRODUCT_UPDATE: '/api/v1/empresa/organizations/:slug/products/:id',
      PRODUCT_MOVE: '/api/v1/empresa/organizations/:slug/products/:id/move',
      SUBMISSIONS_LIST: '/api/v1/empresa/organizations/:slug/submissions',
      SUBMISSION_DETAIL: '/api/v1/empresa/organizations/:slug/submissions/:id',
      SUBMISSION_CREATE: '/api/v1/empresa/organizations/:slug/products/:id/submissions',
      SUBMISSION_MOVE: '/api/v1/empresa/organizations/:slug/submissions/:id/move',
      SUBMISSION_NOTE: '/api/v1/empresa/organizations/:slug/submissions/:id/notes',
      SUBMISSION_ASSIGN: '/api/v1/empresa/organizations/:slug/submissions/:id/assign',
      MEMBERS_LIST: '/api/v1/empresa/organizations/:slug/members',
      MEMBER_INVITE: '/api/v1/empresa/organizations/:slug/members/invite',
      MEMBER_UPDATE: '/api/v1/empresa/organizations/:slug/members/:id',
      ROLES_LIST: '/api/v1/empresa/organizations/:slug/roles',
      ROLE_CREATE: '/api/v1/empresa/organizations/:slug/roles',
      ROLE_UPDATE: '/api/v1/empresa/organizations/:slug/roles/:id',
      GROUPS_LIST: '/api/v1/empresa/organizations/:slug/groups',
      GROUP_CREATE: '/api/v1/empresa/organizations/:slug/groups',
      GROUP_UPDATE: '/api/v1/empresa/organizations/:slug/groups/:id',
      GROUP_ADD_MEMBERS: '/api/v1/empresa/organizations/:slug/groups/:id/members',
      CREATORS_LIST: '/api/v1/empresa/organizations/:slug/creators',
      CREATOR_PRODUCTS: '/api/v1/empresa/organizations/:slug/creators/:creatorId/products',
      CREATOR_GROUPS_LIST: '/api/v1/empresa/organizations/:slug/creator-groups',
      CREATOR_GROUP_CREATE: '/api/v1/empresa/organizations/:slug/creator-groups',
      CREATOR_GROUP_UPDATE: '/api/v1/empresa/organizations/:slug/creator-groups/:id',
      CREATOR_GROUP_ADD_CREATORS: '/api/v1/empresa/organizations/:slug/creator-groups/:id/creators',
    },
    RESUME: {
      DRAFT: '/api/v1/me/resume',
      SAVE_TRACK: '/api/v1/me/resume/:trackId',
      PUBLISH: '/api/v1/me/resume/publish',
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
    SEARCH: {
      ROOT: 'search',
    },
    CREATE: {
      ROOT: 'create',
    },
    NOTIFICATIONS: {
      ROOT: 'notifications',
    },
    PROFILE: {
      ROOT: ':username',
    },
    COLLECTION: {
      ROOT: ':username/collection/:collectionNameKey',
    },
    POST: {
      ROOT: ':username/watch/:titleLink',
    },
    SHOWCASE: {
      ROOT: ':username/showcase/:titleLink',
    },
    ABOUT_REALWE: {
      ROOT: 'about-realwe',
      APP_VERSION: 'about-realwe/app-version',
    },
    TERMS_AND_POLICIES: {
      ROOT: 'terms-and-policies',
    },
    HIRE_SUPPORT: {
      ROOT: 'hire-support',
    },
    HELP_CENTER: {
      ROOT: 'help-center',
    },
    SEND_FEEDBACK: {
      ROOT: 'send-feedback',
    },
    NOTIFICATION_SETTINGS: {
      ROOT: 'notification-settings',
    },
    CONNECTED_DEVICES: {
      ROOT: 'connected-devices',
    },
    CONSENT_MANAGEMENT: {
      ROOT: 'consent-management',
    },
    DEACTIVATE_ACCOUNT: {
      ROOT: 'deactivate-account',
    },
    DOWNLOAD_DATA: {
      ROOT: 'download-data',
    },
    ACTIVITY_VISIBILITY: {
      ROOT: 'activity-visibility',
    },
    CLEAR_HISTORY: {
      ROOT: 'clear-history',
    },
    DELETE_ACCOUNT: {
      ROOT: 'delete-account',
    },
    ACCOUNT_INFO: {
      ROOT: 'account-info',
    },
    CHANGE_PASSWORD: {
      ROOT: 'change-password',
    },
    CREATOR_PORTFOLIO: {
      ROOT: 'creator/:handle',
      PATH: 'creator',
    },
    INSCRIPTIONS: {
      ROOT: 'inscriptions',
    },
    METRICS: {
      ROOT: 'metrics',
    },
    SPONSORED_CAMPAIGNS: {
      ROOT: 'sponsored-campaigns',
      NEW: 'sponsored-campaigns/new',
      DETAIL: 'sponsored-campaigns/:id',
      SUCCESS: 'sponsored-campaigns/success/:id',
      DETAIL_PATH: 'sponsored-campaigns',
      SUCCESS_PATH: 'sponsored-campaigns/success',
    },
    EMPRESA: {
      ROOT: 'empresa',
      LIST: 'empresa',
      NEW: 'empresa/nova',
      DEPARTMENTS: 'empresa/:slug',
      DEPARTMENT_NEW: 'empresa/:slug/novo-departamento',
      DEPARTMENT_PATH: 'empresa',
      PANEL: 'empresa/:slug/:deptSlug',
      PANEL_PATH: 'empresa',
      PRODUCTS: 'empresa/:slug/:deptSlug/produtos',
      PRODUCT_NEW: 'empresa/:slug/:deptSlug/produtos/novo',
      PRODUCT_DETAIL: 'empresa/:slug/:deptSlug/produtos/:productId',
      TRIAGE: 'empresa/:slug/:deptSlug/triagens',
      TRIAGE_DETAIL: 'empresa/:slug/:deptSlug/triagens/:submissionId',
      PEOPLE: 'empresa/:slug/:deptSlug/pessoas',
      CREATORS: 'empresa/:slug/:deptSlug/creators',
      PAGE: 'empresa/:slug/:deptSlug/pagina',
      METRICS: 'empresa/:slug/:deptSlug/metricas',
    },
    RESUME: {
      COMPLETE: 'resume/complete',
      COMPLETE_TRACK: 'resume/complete/:trackId',
      PREVIEW: 'resume/preview',
    },
  },
};
