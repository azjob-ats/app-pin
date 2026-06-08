import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { BuiInput, BuiInputAfter, BuiInputBefore, BuiInputEnd, BuiInputStart } from './input.component';
import { BuiSearch } from '../icon/icon.component';
import { Button } from '../button/button.component';

/** Scenarios portadas de `src/input/__tests__/*.scenario.tsx`. */
const BEFORE = 'display:flex;align-items:center;padding-left:12px';

// input.scenario.tsx — compact, value "uber", start "@", end ".com".
@Component({
  selector: 'bui-s-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiInput, BuiInputStart, BuiInputEnd],
  template: `<bui-input size="compact" value="uber" ariaLabel="stateful input example" [autoFocus]="true">
    <span buiInputStart>&#64;</span><span buiInputEnd>.com</span>
  </bui-input>`,
})
export class InputScenario {}

// input-sizes.scenario.tsx — mini/compact/default/large, endEnhancer ".com".
@Component({
  selector: 'bui-s-input-sizes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiInput, BuiInputEnd],
  template: `
    <bui-input size="mini" value="Mini"><span buiInputEnd>.com</span></bui-input><br />
    <bui-input size="compact" value="Compact"><span buiInputEnd>.com</span></bui-input><br />
    <bui-input value="Default"><span buiInputEnd>.com</span></bui-input><br />
    <bui-input size="large" value="Large"><span buiInputEnd>.com</span></bui-input>
  `,
})
export class InputSizesScenario {}

// input-states.scenario.tsx — Default/Active/Positive/Error/Disabled/ReadOnly (Search before + "00").
@Component({
  selector: 'bui-s-input-states',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiInput, BuiInputBefore, BuiInputEnd, BuiSearch],
  template: `
    <bui-input value="Default"><span buiInputBefore style="${BEFORE}"><bui-search size="18px" /></span><span buiInputEnd>00</span></bui-input><br />
    <bui-input value="Active" [autoFocus]="true"><span buiInputBefore style="${BEFORE}"><bui-search size="18px" /></span><span buiInputEnd>00</span></bui-input><br />
    <bui-input value="Positive" [positive]="true"><span buiInputBefore style="${BEFORE}"><bui-search size="18px" /></span><span buiInputEnd>00</span></bui-input><br />
    <bui-input value="Error" [error]="true"><span buiInputBefore style="${BEFORE}"><bui-search size="18px" /></span><span buiInputEnd>00</span></bui-input><br />
    <bui-input value="Disabled" [disabled]="true"><span buiInputBefore style="${BEFORE}"><bui-search size="18px" /></span><span buiInputEnd>00</span></bui-input><br />
    <bui-input value="Read Only" [readOnly]="true"><span buiInputBefore style="${BEFORE}"><bui-search size="18px" /></span><span buiInputEnd>00</span></bui-input>
  `,
})
export class InputStatesScenario {}

// input-before-after.scenario.tsx — Before com Search + placeholder.
@Component({
  selector: 'bui-s-input-before-after',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiInput, BuiInputBefore, BuiInputAfter, BuiSearch],
  template: `
    <bui-input placeholder="Input with a Before component">
      <span buiInputBefore style="${BEFORE}"><bui-search size="16px" /></span>
    </bui-input>
    <br />
    <bui-input placeholder="Input with an After component">
      <span buiInputAfter style="display:flex;align-items:center;padding-right:12px"><bui-search size="16px" /></span>
    </bui-input>
  `,
})
export class InputBeforeAfterScenario {}

// input-clearable.scenario.tsx — clearable com valor (ícone ✕).
@Component({
  selector: 'bui-s-input-clearable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiInput],
  template: `
    <bui-input [clearable]="true" value="Some" size="compact" />
    <br />
    <bui-input [clearable]="true" value="Thing" />
  `,
})
export class InputClearableScenario {}

// input-password.scenario.tsx — type=password com toggle Hide/Show.
@Component({
  selector: 'bui-s-input-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiInput],
  template: `
    <bui-input size="mini" type="password" value="1234" />
    <br />
    <bui-input size="compact" type="password" value="1234" />
    <br />
    <bui-input type="password" value="1234" />
  `,
})
export class InputPasswordScenario {}

// input-mask.scenario.tsx — MaskedInput "9999/99/99" (value 20000101 → 2000/01/01).
@Component({
  selector: 'bui-s-input-mask',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiInput],
  template: `<bui-input mask="9999/99/99" value="20000101" [autoFocus]="true" ariaLabel="date" />`,
})
export class InputMaskScenario {}

// input-number.scenario.tsx — type=number, value 10, min 0, max 100.
@Component({
  selector: 'bui-s-input-number',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiInput],
  template: `<bui-input type="number" value="10" [min]="0" [max]="100" ariaLabel="number" />`,
})
export class InputNumberScenario {}

// input-with-button.scenario.tsx — input + Button (compact/default).
@Component({
  selector: 'bui-s-input-with-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiInput, Button],
  template: `
    <div style="display:flex;margin-bottom:8px">
      <bui-input value="Move the world" size="compact" style="margin-right:8px;width:100%" />
      <bui-button size="compact">Move</bui-button>
    </div>
    <div style="display:flex;margin-bottom:8px">
      <bui-input value="Move the world" style="margin-right:8px;width:100%" />
      <bui-button>Move</bui-button>
    </div>
  `,
})
export class InputWithButtonScenario {}
