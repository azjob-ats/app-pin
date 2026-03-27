declare interface Env {
  readonly NODE_ENV: string;
  [key: string]: unknown;
  readonly NG_APP_NAME: string;
  readonly NG_APP_SYSTEM_LANGUAGE_ENCRYPTION_KEY: string;
  readonly NG_APP_SYSTEM_LANGUAGE_TABLE_NAME: string;
  readonly NG_APP_BASE_URL: string;
}

declare interface ImportMeta {
  readonly env: Env;
}

declare const _NGX_ENV_: Env;
