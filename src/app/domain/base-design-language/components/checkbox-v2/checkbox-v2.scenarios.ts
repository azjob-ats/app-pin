import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, signal } from '@angular/core';
import { CheckboxV2 } from './checkbox-v2.component';
import { BwTypography } from '../typography/typography.directive';
import { BuiHeading, BuiHeadingLevel } from '../heading/heading.component';

/** Scenarios portadas de `src/checkbox-v2/__tests__/*.scenario.tsx`. */
const COL = 'display:flex;flex-direction:column;gap:8px;align-items:flex-start';

// checkbox-v2.scenario.tsx — stateful + texto longo + grupo de frutas (ul/li role=group).
@Component({
  selector: 'bui-s-checkbox-v2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CheckboxV2, BwTypography],
  template: `<div>
    <label buiCheckboxV2>click me</label>
    <div style="width:200px">
      <label buiCheckboxV2>
        This is a long text. This is a long text. This is a long text. This is a long text. This is a
        long text.
      </label>
    </div>
    <div buiTypo="HeadingSmall" style="margin-bottom:var(--bw-sizing-scale500)">Checkboxes Group</div>
    <p buiTypo="ParagraphMedium">
      Note: checkbox itself does not implement group behavior. Developers need to take care of
      Accessibility for checkboxes group. Below is an example with ul and li.
    </p>
    <p buiTypo="ParagraphSmall" id="checkbox-group-label">
      Checkboxes group - choose your favorite fruit:
    </p>
    <ul style="padding:0" aria-labelledby="checkbox-group-label" role="group">
      <li style="list-style:none"><label buiCheckboxV2>Apple</label></li>
      <li style="list-style:none"><label buiCheckboxV2>Banana</label></li>
      <li style="list-style:none"><label buiCheckboxV2>Orange</label></li>
    </ul>
  </div>`,
})
export class CheckboxV2Scenario {}

// checkbox-v2-states.scenario.tsx — 9 estados estáticos.
@Component({
  selector: 'bui-s-checkbox-v2-states',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CheckboxV2],
  template: `<div style="${COL}">
    <label buiCheckboxV2>Checkbox</label>
    <label buiCheckboxV2 [checked]="true">Checkbox checked</label>
    <label buiCheckboxV2 isIndeterminate>Checkbox isIndeterminate</label>
    <label buiCheckboxV2 disabled>Checkbox disabled</label>
    <label buiCheckboxV2 disabled [checked]="true">Checkbox disabled checked</label>
    <label buiCheckboxV2 disabled isIndeterminate>Checkbox disabled isIndeterminate</label>
    <label buiCheckboxV2 error>Checkbox error</label>
    <label buiCheckboxV2 error [checked]="true">Checkbox error checked</label>
    <label buiCheckboxV2 error isIndeterminate>Checkbox error isIndeterminate</label>
  </div>`,
})
export class CheckboxV2StatesScenario {}

// checkbox-v2-placement.scenario.tsx — left / right (flex row).
@Component({
  selector: 'bui-s-checkbox-v2-placement',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CheckboxV2],
  template: `<div style="display:flex">
    <label buiCheckboxV2 labelPlacement="left">Label on the left</label>
    <label buiCheckboxV2 labelPlacement="right">Label on the right</label>
  </div>`,
})
export class CheckboxV2PlacementScenario {}

// checkbox-v2-indeterminate.scenario.tsx — pai indeterminado + 2 filhos.
@Component({
  selector: 'bui-s-checkbox-v2-indeterminate',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CheckboxV2],
  template: `<div>
    <label
      buiCheckboxV2
      id="parent-checkbox"
      ariaControls="child1-checkbox child2-checkbox"
      [checked]="all()"
      [isIndeterminate]="indeterminate()"
      (checkedChange)="setAll($event)"
    >
      Indeterminate checkbox if not all subcheckboxes are checked
    </label>
    <div style="padding:var(--bw-sizing-scale400);display:flex;flex-direction:column;align-items:flex-start">
      <label buiCheckboxV2 id="child1-checkbox" [checked]="c0()" (checkedChange)="c0.set($event)">
        First subcheckbox
      </label>
      <label buiCheckboxV2 id="child2-checkbox" [checked]="c1()" (checkedChange)="c1.set($event)">
        Second subcheckbox
      </label>
    </div>
  </div>`,
})
export class CheckboxV2IndeterminateScenario {
  protected readonly c0 = signal(true);
  protected readonly c1 = signal(false);
  protected readonly all = computed(() => this.c0() && this.c1());
  protected readonly indeterminate = computed(() => (this.c0() || this.c1()) && !this.all());
  protected setAll(v: boolean): void {
    this.c0.set(v);
    this.c1.set(v);
  }
}

// checkbox-v2-auto-focus.scenario.tsx — stateful autoFocus.
@Component({
  selector: 'bui-s-checkbox-v2-auto-focus',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CheckboxV2],
  template: `<label buiCheckboxV2 autoFocus>click me(auto focus)</label>`,
})
export class CheckboxV2AutoFocusScenario {}

// checkbox-v2-unlabeled.scenario.tsx — stateful aria-label, sem children.
@Component({
  selector: 'bui-s-checkbox-v2-unlabeled',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CheckboxV2],
  template: `<label buiCheckboxV2 ariaLabel="buy milk"></label>`,
})
export class CheckboxV2UnlabeledScenario {}

// checkbox-v2-react-hook-form.scenario.tsx — estrutura visual (form behavior é React).
@Component({
  selector: 'bui-s-checkbox-v2-react-hook-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CheckboxV2, BuiHeading, BuiHeadingLevel],
  template: `<bui-heading-level>
    <bui-heading [styleLevel]="4">React-hook-form</bui-heading>
    <bui-heading-level>
      <bui-heading [styleLevel]="6">Using StatefulCheckbox</bui-heading>
      <form (submit)="$event.preventDefault()">
        <label buiCheckboxV2 [checked]="true">Baseweb StatefulCheckbox</label>
        <label>
          <input type="checkbox" checked />
          Native Checkbox
        </label>
        <div><button type="submit">Submit</button></div>
      </form>
      <bui-heading [styleLevel]="6">Using Checkbox with react-hook-form Controller</bui-heading>
      <form (submit)="$event.preventDefault()">
        <label buiCheckboxV2 [checked]="true">Baseweb Checkbox</label>
        <label>
          <input type="checkbox" checked />
          Native Checkbox
        </label>
        <div><button type="submit">Submit</button></div>
      </form>
    </bui-heading-level>
  </bui-heading-level>`,
})
export class CheckboxV2ReactHookFormScenario {}
