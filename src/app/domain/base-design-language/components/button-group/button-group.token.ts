import { InjectionToken, Signal } from '@angular/core';

export interface BuiButtonGroupConfig {
  kind: Signal<string>;
  size: Signal<string>;
  shape: Signal<string>;
  disabled: Signal<boolean>;
  effectiveSelected: Signal<number | number[] | undefined>;
  registerChild: () => number;
  onChildClick: (index: number) => void;
}

export const BUI_BTN_GRP = new InjectionToken<BuiButtonGroupConfig>('BUI_BTN_GRP');
