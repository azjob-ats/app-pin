/** Checkbox — conceitos de API pública do baseui/checkbox. */
export const STYLE_TYPE = { default: 'default', toggle: 'toggle' } as const;
export type StyleType = (typeof STYLE_TYPE)[keyof typeof STYLE_TYPE];

export const LABEL_PLACEMENT = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
} as const;
export type LabelPlacement = (typeof LABEL_PLACEMENT)[keyof typeof LABEL_PLACEMENT];
