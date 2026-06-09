import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, signal } from '@angular/core';
import { Checkbox } from './checkbox.component';
import { BuiHeading, BuiHeadingLevel } from '../heading/heading.component';
import { Select } from '../select/select.component';

/** Scenarios portadas de `src/checkbox/__tests__/*.scenario.tsx`. */
const COL = 'display:flex;flex-direction:column;align-items:flex-start';

// checkbox.scenario.tsx — StatefulCheckbox "click me".
@Component({
  selector: 'bui-s-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Checkbox],
  template: `<label buiCheckbox>click me</label>`,
})
export class CheckboxScenario {}

// checkbox-states.scenario.tsx — 9 estados estáticos.
@Component({
  selector: 'bui-s-checkbox-states',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Checkbox],
  template: `<div style="${COL}">
    <label buiCheckbox>Checkbox</label>
    <label buiCheckbox [checked]="true">Checkbox checked</label>
    <label buiCheckbox isIndeterminate>Checkbox isIndeterminate</label>
    <label buiCheckbox disabled>Checkbox disabled</label>
    <label buiCheckbox disabled [checked]="true">Checkbox disabled checked</label>
    <label buiCheckbox disabled isIndeterminate>Checkbox disabled isIndeterminate</label>
    <label buiCheckbox error>Checkbox error</label>
    <label buiCheckbox error [checked]="true">Checkbox error checked</label>
    <label buiCheckbox error isIndeterminate>Checkbox error isIndeterminate</label>
  </div>`,
})
export class CheckboxStatesScenario {}

// checkbox-placement.scenario.tsx — top / left / right / bottom.
@Component({
  selector: 'bui-s-checkbox-placement',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Checkbox],
  template: `<div>
    <label buiCheckbox labelPlacement="top">Label on the top</label>
    <div style="display:flex;justify-content:center;margin:8px 0 8px 12px">
      <label buiCheckbox labelPlacement="left">Label on the left</label>
      <label buiCheckbox labelPlacement="right">Label on the right</label>
    </div>
    <label buiCheckbox labelPlacement="bottom">Label on the bottom</label>
  </div>`,
})
export class CheckboxPlacementScenario {}

// checkbox-indeterminate.scenario.tsx — pai indeterminado + 2 filhos.
@Component({
  selector: 'bui-s-checkbox-indeterminate',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Checkbox],
  template: `<div>
    <label
      buiCheckbox
      [checked]="all()"
      [isIndeterminate]="indeterminate()"
      (checkedChange)="setAll($event)"
    >
      Indeterminate checkbox if not all subcheckboxes are checked
    </label>
    <div style="padding:var(--bw-sizing-scale400)">
      <label buiCheckbox [checked]="c0()" (checkedChange)="c0.set($event)">First subcheckbox</label>
      <label buiCheckbox [checked]="c1()" (checkedChange)="c1.set($event)">Second subcheckbox</label>
    </div>
  </div>`,
})
export class CheckboxIndeterminateScenario {
  protected readonly c0 = signal(true);
  protected readonly c1 = signal(false);
  protected readonly all = computed(() => this.c0() && this.c1());
  protected readonly indeterminate = computed(() => (this.c0() || this.c1()) && !this.all());
  protected setAll(v: boolean): void {
    this.c0.set(v);
    this.c1.set(v);
  }
}

// checkbox-toggle.scenario.tsx — variantes toggle em coluna 200px.
@Component({
  selector: 'bui-s-checkbox-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Checkbox],
  template: `<div style="width:200px;display:flex;flex-direction:column;gap:12px">
    <label buiCheckbox checkmarkType="toggle">default unchecked</label>
    <label buiCheckbox checkmarkType="toggle" [checked]="true">default checked</label>
    <label buiCheckbox checkmarkType="toggle" disabled>disabled unchecked</label>
    <label buiCheckbox checkmarkType="toggle" [checked]="true" disabled>disabled checked</label>
    <label buiCheckbox checkmarkType="toggle" error>error unchecked</label>
    <label buiCheckbox checkmarkType="toggle" [checked]="true" error>error checked</label>
    <label buiCheckbox checkmarkType="toggle" [checked]="true">
      long label that should wrap to multiple lines to test how the toggle aligns with the text
    </label>
    <label buiCheckbox checkmarkType="toggle">stateful toggle</label>
    <label buiCheckbox checkmarkType="toggle" error>stateful error toggle</label>
  </div>`,
})
export class CheckboxToggleScenario {}

// checkbox-unlabeled.scenario.tsx — StatefulCheckbox só com title.
@Component({
  selector: 'bui-s-checkbox-unlabeled',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Checkbox],
  template: `<label buiCheckbox title="buy milk"></label>`,
})
export class CheckboxUnlabeledScenario {}

// checkbox-select.scenario.tsx — FormControl (aprox.) + checkbox c/ Select interativo.
@Component({
  selector: 'bui-s-checkbox-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Checkbox, Select],
  template: `<div style="max-width:320px">
    <div style="font:var(--bw-font-LabelSmall);color:var(--bw-content-primary);margin-bottom:var(--bw-sizing-scale300)">
      Test-label
    </div>
    <label buiCheckbox containsInteractiveElement>
      <bui-select placeholder="Select color" />
    </label>
  </div>`,
})
export class CheckboxSelectScenario {}

// checkbox-react-hook-form.scenario.tsx — estrutura visual (form behavior é React).
@Component({
  selector: 'bui-s-checkbox-react-hook-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Checkbox, BuiHeading, BuiHeadingLevel],
  template: `<bui-heading-level>
    <bui-heading [styleLevel]="4">React-hook-form</bui-heading>
    <bui-heading-level>
      <bui-heading [styleLevel]="6">Using StatefulCheckbox</bui-heading>
      <form (submit)="$event.preventDefault()">
        <label buiCheckbox [checked]="true">Baseweb StatefulCheckbox</label>
        <label>
          <input type="checkbox" checked />
          Native Checkbox
        </label>
        <div><button type="submit">Submit</button></div>
      </form>
      <bui-heading [styleLevel]="6">Using Checkbox with react-hook-form Controller</bui-heading>
      <form (submit)="$event.preventDefault()">
        <label buiCheckbox [checked]="true">Baseweb Checkbox</label>
        <label>
          <input type="checkbox" checked />
          Native Checkbox
        </label>
        <div><button type="submit">Submit</button></div>
      </form>
    </bui-heading-level>
  </bui-heading-level>`,
})
export class CheckboxReactHookFormScenario {}
