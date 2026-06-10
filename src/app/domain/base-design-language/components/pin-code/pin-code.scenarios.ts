import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BuiStatefulPinCode } from './pin-code.component';

// pin-code--pin-code
@Component({
  selector: 'bui-pc-code-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulPinCode],
  template: `<div style="padding:16px"><bui-stateful-pin-code /></div>`,
})
export class PinCodeScenario {}

// pin-code--mask
@Component({
  selector: 'bui-pc-code-mask-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulPinCode],
  template: `
    <div style="padding:16px">
      <bui-stateful-pin-code mask="*" (valuesChange)="vals.set($event)" />
      <p data-testid="pinCodeValue">password:{{ vals().join(' ') }} </p>
    </div>
  `,
})
export class PinCodeMaskScenario {
  vals = signal<string[]>(['', '', '', '']);
}

// pin-code--sizes
@Component({
  selector: 'bui-pc-code-sizes-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulPinCode],
  template: `
    <div style="padding:16px;display:flex;flex-direction:column;gap:16px">
      <bui-stateful-pin-code size="compact" />
      <bui-stateful-pin-code />
      <bui-stateful-pin-code size="large" />
    </div>
  `,
})
export class PinCodeSizesScenario {}

// pin-code--states
@Component({
  selector: 'bui-pc-code-states-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulPinCode],
  template: `
    <div style="padding:16px;display:flex;flex-direction:column;gap:16px">
      <bui-stateful-pin-code disabled />
      <bui-stateful-pin-code error />
      <bui-stateful-pin-code positive />
    </div>
  `,
})
export class PinCodeStatesScenario {}

// pin-code--overrides
@Component({
  selector: 'bui-pc-code-overrides-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulPinCode],
  template: `
    <div style="padding:16px;background-color:orange;display:inline-flex">
      <bui-stateful-pin-code style="--bw-border-opaque:turquoise; --bw-background-secondary:pink" />
    </div>
  `,
})
export class PinCodeOverridesScenario {}
