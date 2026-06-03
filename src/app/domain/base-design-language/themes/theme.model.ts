/**
 * Theme — shape espelhando o objeto `Theme` do Base Web (paridade de API pública).
 * Os VALORES vivem em `tokens/base-web-tokens.scss` (CSS custom properties); aqui
 * cada chave aponta para `var(--bw-*)`, e a troca light/dark acontece via
 * `[data-bw-theme]` no `.bw-root`. (Decisão D3.)
 */
export type BwThemeMode = 'light' | 'dark';

export interface BwColors {
  // foundation
  primary: string; primaryA: string; primaryB: string;
  accent: string; negative: string; warning: string; positive: string;
  white: string; black: string;
  // semantic — background
  backgroundPrimary: string; backgroundSecondary: string; backgroundTertiary: string;
  backgroundInversePrimary: string; backgroundStateDisabled: string; backgroundOverlay: string;
  backgroundAccent: string; backgroundNegative: string; backgroundWarning: string; backgroundPositive: string;
  backgroundAccentLight: string; backgroundNegativeLight: string; backgroundWarningLight: string; backgroundPositiveLight: string;
  // semantic — content
  contentPrimary: string; contentSecondary: string; contentTertiary: string;
  contentInversePrimary: string; contentStateDisabled: string; contentOnColor: string;
  contentAccent: string; contentNegative: string; contentWarning: string; contentPositive: string;
  // semantic — border
  borderOpaque: string; borderTransparent: string; borderSelected: string; borderStateDisabled: string;
  borderAccent: string; borderNegative: string; borderWarning: string; borderPositive: string;
}

export interface BwTheme {
  name: string;
  direction: 'auto' | 'ltr' | 'rtl';
  colors: BwColors;
  typography: Record<string, string>;
  sizing: Record<string, string>;
  borders: Record<string, string>;
  lighting: Record<string, string>;
  animation: Record<string, string>;
  breakpoints: Record<'small' | 'medium' | 'large', number>;
  zIndex: { modal: number };
}
