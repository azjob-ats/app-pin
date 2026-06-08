import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Switch } from './switch.component';

/** Scenarios portadas de `src/switch/__tests__/*.scenario.tsx`. */
const WRAP = 'display:flex;flex-direction:column;gap:8px;align-items:flex-start';
const LONG = 'This is a long text. This is a long text. This is a long text. This is a long text. This is a long text.';

// switch.scenario.tsx — stateful "click me" + texto longo em 200px.
@Component({
  selector: 'bui-s-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Switch],
  template: `<div style="${WRAP}">
    <label buiSwitch>click me</label>
    <div style="width:200px"><label buiSwitch>${LONG}</label></div>
  </div>`,
})
export class SwitchScenario {}

// switch-auto-focus.scenario.tsx — stateful autoFocus.
@Component({
  selector: 'bui-s-switch-auto-focus',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Switch],
  template: `<div style="${WRAP}"><label buiSwitch autoFocus>click me(auto focus)</label></div>`,
})
export class SwitchAutoFocusScenario {}

// switch-disabled.scenario.tsx — disabled + enabled.
@Component({
  selector: 'bui-s-switch-disabled',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Switch],
  template: `<div style="${WRAP}">
    <label buiSwitch disabled>Disabled Switch</label>
    <label buiSwitch>Enabled Switch</label>
  </div>`,
})
export class SwitchDisabledScenario {}

// switch-placement.scenario.tsx — label à esquerda / à direita.
@Component({
  selector: 'bui-s-switch-placement',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Switch],
  template: `<div style="${WRAP}">
    <label buiSwitch labelPlacement="left">Label on the left</label>
    <label buiSwitch labelPlacement="right">Label on the right</label>
  </div>`,
})
export class SwitchPlacementScenario {}

// switch-sizes.scenario.tsx — default/small × unchecked, checked, checked+showIcon.
@Component({
  selector: 'bui-s-switch-sizes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Switch],
  template: `<div style="${WRAP}">
    <label buiSwitch size="default">default</label>
    <label buiSwitch size="small">small</label>
    <label buiSwitch size="default" [checked]="true">default</label>
    <label buiSwitch size="small" [checked]="true">small</label>
    <label buiSwitch size="default" [checked]="true" showIcon>default</label>
    <label buiSwitch size="small" [checked]="true" showIcon>small</label>
  </div>`,
})
export class SwitchSizesScenario {}

// switch-states.scenario.tsx — unchecked, checked, checked+icon, disabled, disabled+checked.
@Component({
  selector: 'bui-s-switch-states',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Switch],
  template: `<div style="${WRAP}">
    <label buiSwitch>Switch</label>
    <label buiSwitch [checked]="true">Switch checked</label>
    <label buiSwitch [checked]="true" showIcon>Switch checked(show checkmark icon)</label>
    <label buiSwitch disabled>Switch disabled</label>
    <label buiSwitch disabled [checked]="true">Switch disabled checked</label>
  </div>`,
})
export class SwitchStatesScenario {}

// switch-unlabeled.scenario.tsx — stateful aria-label, sem children.
@Component({
  selector: 'bui-s-switch-unlabeled',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Switch],
  template: `<div style="${WRAP}"><label buiSwitch ariaLabel="Enable notifications"></label></div>`,
})
export class SwitchUnlabeledScenario {}
