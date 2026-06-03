/**
 * Button — conceitos de API pública preservados do Base Web (constants.ts).
 * Nomes/valores idênticos; em Angular expostos como union types + const maps.
 */
export const KIND = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  dangerPrimary: 'dangerPrimary',
  dangerSecondary: 'dangerSecondary',
  dangerTertiary: 'dangerTertiary',
  // Button Group exclusive (BUTTON_GROUP_EXCLUSIVE_KINDS no Base Web)
  outline: 'outline',
} as const;
export type Kind = (typeof KIND)[keyof typeof KIND];

export const SIZE = {
  mini: 'mini',
  compact: 'compact',
  default: 'default',
  large: 'large',
  // aliases novos do Base Web
  xSmall: 'xSmall',
  small: 'small',
  medium: 'medium',
} as const;
export type Size = (typeof SIZE)[keyof typeof SIZE];

export const SHAPE = {
  default: 'default',
  rectangular: 'rectangular',
  rounded: 'rounded',
  pill: 'pill',
  round: 'round',
  circle: 'circle',
  square: 'square',
} as const;
export type Shape = (typeof SHAPE)[keyof typeof SHAPE];
