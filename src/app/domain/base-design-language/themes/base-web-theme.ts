import { BwTheme } from './theme.model';

/**
 * Objeto de tema Base Web (var-based). Cada valor referencia uma CSS custom property
 * definida em `tokens/base-web-tokens.scss`. A troca light/dark é feita por
 * `[data-bw-theme]` no `.bw-root` (as vars mudam), então um único objeto serve aos
 * dois temas — preservando o shape/keys do `Theme` do Base Web (paridade de API).
 */
const v = (token: string): string => `var(--bw-${token})`;

export const baseWebTheme: BwTheme = {
  name: 'base-web',
  direction: 'auto',
  colors: {
    primary: v('primary'), primaryA: v('primary-a'), primaryB: v('primary-b'),
    accent: v('accent'), negative: v('negative'), warning: v('warning'), positive: v('positive'),
    white: v('white'), black: v('black'),
    backgroundPrimary: v('background-primary'), backgroundSecondary: v('background-secondary'),
    backgroundTertiary: v('background-tertiary'), backgroundInversePrimary: v('background-inverse-primary'),
    backgroundStateDisabled: v('background-state-disabled'), backgroundOverlay: v('background-overlay'),
    backgroundAccent: v('background-accent'), backgroundNegative: v('background-negative'),
    backgroundWarning: v('background-warning'), backgroundPositive: v('background-positive'),
    backgroundAccentLight: v('background-accent-light'), backgroundNegativeLight: v('background-negative-light'),
    backgroundWarningLight: v('background-warning-light'), backgroundPositiveLight: v('background-positive-light'),
    contentPrimary: v('content-primary'), contentSecondary: v('content-secondary'), contentTertiary: v('content-tertiary'),
    contentInversePrimary: v('content-inverse-primary'), contentStateDisabled: v('content-state-disabled'),
    contentOnColor: v('content-on-color'), contentAccent: v('content-accent'),
    contentNegative: v('content-negative'), contentWarning: v('content-warning'), contentPositive: v('content-positive'),
    borderOpaque: v('border-opaque'), borderTransparent: v('border-transparent'), borderSelected: v('border-selected'),
    borderStateDisabled: v('border-state-disabled'), borderAccent: v('border-accent'),
    borderNegative: v('border-negative'), borderWarning: v('border-warning'), borderPositive: v('border-positive'),
  },
  typography: Object.fromEntries(
    ['ParagraphXSmall', 'ParagraphSmall', 'ParagraphMedium', 'ParagraphLarge',
     'LabelXSmall', 'LabelSmall', 'LabelMedium', 'LabelLarge',
     'HeadingXSmall', 'HeadingSmall', 'HeadingMedium', 'HeadingLarge', 'HeadingXLarge', 'HeadingXXLarge',
     'DisplayXSmall', 'DisplaySmall', 'DisplayMedium', 'DisplayLarge',
    ].map((k) => [k, v(`font-${k}`)]),
  ),
  sizing: Object.fromEntries(
    ['scale0', 'scale100', 'scale200', 'scale300', 'scale400', 'scale500', 'scale550', 'scale600',
     'scale650', 'scale700', 'scale750', 'scale800', 'scale850', 'scale900', 'scale950', 'scale1000',
     'scale1200', 'scale1400', 'scale1600', 'scale2400', 'scale3200', 'scale4800',
    ].map((k) => [k, v(`sizing-${k}`)]),
  ),
  borders: {
    radius100: v('radius-100'), radius200: v('radius-200'), radius300: v('radius-300'),
    radius400: v('radius-400'), radius500: v('radius-500'),
    buttonBorderRadius: v('button-border-radius'), inputBorderRadius: v('input-border-radius'),
    popoverBorderRadius: v('popover-border-radius'), tagBorderRadius: v('tag-border-radius'),
  },
  lighting: {
    shadow400: v('shadow-400'), shadow500: v('shadow-500'), shadow600: v('shadow-600'), shadow700: v('shadow-700'),
  },
  animation: {
    timing100: v('timing-100'), timing200: v('timing-200'), timing300: v('timing-300'), timing400: v('timing-400'),
    easeOut: v('ease-out'), easeIn: v('ease-in'), easeInOut: v('ease-in-out'), linear: v('ease-linear'),
  },
  breakpoints: { small: 320, medium: 600, large: 1136 },
  zIndex: { modal: 2000 },
};

/** Light e Dark referenciam o mesmo objeto (as vars trocam por [data-bw-theme]). */
export const LightTheme = baseWebTheme;
export const DarkTheme = baseWebTheme;
