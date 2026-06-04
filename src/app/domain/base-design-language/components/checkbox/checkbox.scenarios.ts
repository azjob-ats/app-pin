import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from './checkbox.component';

/** Scenarios do Checkbox (portadas de src/checkbox/__tests__). */
const COL = `display:flex; flex-direction:column; gap:12px; align-items:flex-start;`;

@Component({
  selector: 'bui-s-checkbox', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Checkbox, FormsModule],
  template: `<bui-checkbox [(ngModel)]="checked">Hello</bui-checkbox>`,
})
export class CheckboxScenario { protected checked = signal(true); }

@Component({
  selector: 'bui-s-checkbox-states', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Checkbox, FormsModule],
  template: `<div style="${COL}">
    <bui-checkbox [ngModel]="false">Unchecked</bui-checkbox>
    <bui-checkbox [ngModel]="true">Checked</bui-checkbox>
    <bui-checkbox [ngModel]="false" [isIndeterminate]="true">Indeterminate</bui-checkbox>
    <bui-checkbox [ngModel]="false" [error]="true">Error</bui-checkbox>
    <bui-checkbox [ngModel]="true" [error]="true">Error checked</bui-checkbox>
    <bui-checkbox [ngModel]="false" [disabled]="true">Disabled</bui-checkbox>
    <bui-checkbox [ngModel]="true" [disabled]="true">Disabled checked</bui-checkbox>
  </div>`,
})
export class StatesScenario {}

@Component({
  selector: 'bui-s-checkbox-indeterminate', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Checkbox, FormsModule],
  template: `<div style="${COL}">
    <bui-checkbox [ngModel]="false" [isIndeterminate]="true">Indeterminate</bui-checkbox>
    <bui-checkbox [ngModel]="false" [isIndeterminate]="true" [disabled]="true">Indeterminate disabled</bui-checkbox>
  </div>`,
})
export class IndeterminateScenario {}

@Component({
  selector: 'bui-s-checkbox-placement', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Checkbox, FormsModule],
  template: `<div style="display:flex; gap:32px; flex-wrap:wrap; align-items:flex-start;">
    <bui-checkbox [ngModel]="true" labelPlacement="top">top</bui-checkbox>
    <bui-checkbox [ngModel]="true" labelPlacement="right">right</bui-checkbox>
    <bui-checkbox [ngModel]="true" labelPlacement="bottom">bottom</bui-checkbox>
    <bui-checkbox [ngModel]="true" labelPlacement="left">left</bui-checkbox>
  </div>`,
})
export class PlacementScenario {}

@Component({
  selector: 'bui-s-checkbox-toggle', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Checkbox, FormsModule],
  template: `<div style="${COL}">
    <bui-checkbox [ngModel]="false" checkmarkType="toggle">Off</bui-checkbox>
    <bui-checkbox [ngModel]="true" checkmarkType="toggle">On</bui-checkbox>
    <bui-checkbox [ngModel]="true" checkmarkType="toggle" [disabled]="true">Disabled</bui-checkbox>
  </div>`,
})
export class ToggleScenario {}

@Component({
  selector: 'bui-s-checkbox-unlabeled', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Checkbox, FormsModule],
  template: `<div style="display:flex; gap:12px; align-items:center;">
    <bui-checkbox [ngModel]="false" aria-label="Option 1" />
    <bui-checkbox [ngModel]="true" aria-label="Option 2" />
  </div>`,
})
export class UnlabeledScenario {}
