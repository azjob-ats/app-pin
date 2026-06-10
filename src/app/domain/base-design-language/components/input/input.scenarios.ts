import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BuiInput, BuiInputAfter, BuiInputBefore, BuiInputEnd, BuiInputStart } from './input.component';
import { BuiSearch } from '../icon/icon.component';
import { Button } from '../button/button.component';
import { Select } from '../select/select.component';

const COLOR_OPTS = [
  { id: 'AliceBlue', label: 'AliceBlue' }, { id: 'AntiqueWhite', label: 'AntiqueWhite' }, { id: 'Aqua', label: 'Aqua' },
];

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

// input-disabled-matches-select.scenario.tsx — Select disabled + Input disabled (mesmo estilo).
@Component({
  selector: 'bui-s-input-disabled-matches-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiInput, Select, FormsModule],
  template: `
    <div>
      <bui-select [options]="opts" [ngModel]="'AliceBlue'" [disabled]="true" placeholder="Select a color" />
      <bui-input value="Hello" placeholder="Controlled Input" [disabled]="true" ariaLabel="controlled" />
    </div>
  `,
})
export class InputDisabledMatchesSelectScenario {
  protected readonly opts = COLOR_OPTS;
}

// input-selector.scenario.tsx — input adjoined a um select (start/end). FormControl (🚫)
// aproximado por label/caption inline.
@Component({
  selector: 'bui-s-input-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiInput, Select],
  template: `
    <div style="padding:24px;width:500px">
      <div style="margin-bottom:16px">
        <div style="font:var(--bw-font-LabelSmall);margin-bottom:8px">input with start select</div>
        <div style="display:flex">
          <div style="width:200px;padding-right:8px"><bui-select [options]="opts" placeholder="Select" /></div>
          <bui-input placeholder="" ariaLabel="start input" style="flex:1" />
        </div>
        <div style="font:var(--bw-font-ParagraphSmall);color:var(--bw-content-tertiary);margin-top:8px">caption</div>
      </div>
      <div>
        <div style="font:var(--bw-font-LabelSmall);margin-bottom:8px">input with end select</div>
        <div style="display:flex">
          <bui-input placeholder="" ariaLabel="end input" style="flex:1" />
          <div style="width:200px;padding-left:8px"><bui-select [options]="opts" placeholder="Select" /></div>
        </div>
        <div style="font:var(--bw-font-ParagraphSmall);color:var(--bw-content-tertiary);margin-top:8px">caption</div>
      </div>
    </div>
  `,
})
export class InputSelectorScenario {
  protected readonly opts = COLOR_OPTS;
}

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

// input-clearable-icon-overrides.scenario.tsx — clearable input (icon override approximation)
@Component({
  selector: 'bui-s-input-clearable-icon-overrides',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiInput],
  template: `<bui-input [value]="val()" (valueChange)="val.set($event)" clearable ariaLabel="Search" />`,
})
export class InputClearableIconOverridesScenario {
  protected readonly val = signal('Some');
}

// input-clearable-noescape.scenario.tsx — clearable but Escape does NOT clear.
@Component({
  selector: 'bui-s-input-clearable-noescape',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiInput],
  template: `<bui-input [value]="val()" (valueChange)="val.set($event)" clearable [clearOnEscape]="false" ariaLabel="Search" />`,
})
export class InputClearableNoescapeScenario {
  protected readonly val = signal('Thing');
}

// input-form-control-states.scenario.tsx — positive/error states with labels (FormControl approximation).
@Component({
  selector: 'bui-s-input-form-control-states',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiInput],
  template: `
    <div style="margin-bottom:16px">
      <label style="display:block;font:var(--bw-font-LabelSmall);margin-bottom:4px">Positive</label>
      <bui-input positive ariaLabel="Positive input" />
      <span style="display:block;font:var(--bw-font-ParagraphXSmall);color:var(--bw-colors-positive400);margin-top:4px">Success!</span>
      <span style="display:block;font:var(--bw-font-ParagraphXSmall);color:var(--bw-content-secondary);margin-top:2px">caption</span>
    </div>
    <br />
    <div>
      <label style="display:block;font:var(--bw-font-LabelSmall);margin-bottom:4px">Error</label>
      <bui-input error ariaLabel="Error input" />
      <span style="display:block;font:var(--bw-font-ParagraphXSmall);color:var(--bw-colors-negative400);margin-top:4px">Error!</span>
      <span style="display:block;font:var(--bw-font-ParagraphXSmall);color:var(--bw-content-secondary);margin-top:2px">caption</span>
    </div>
  `,
})
export class InputFormControlStatesScenario {}

// input-password-icon-overrides.scenario.tsx — password input (icon override approximation).
@Component({
  selector: 'bui-s-input-password-icon-overrides',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiInput],
  template: `
    <bui-input type="password" value="hunter2" clearable ariaLabel="Password" />
    <br />
    <bui-input type="password" size="compact" ariaLabel="Password compact" />
  `,
})
export class InputPasswordIconOverridesScenario {}
