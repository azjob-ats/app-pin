import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '../button/button.component';
import { BuiButtonGroup } from './button-group.component';

// button-group--checkbox
@Component({
  selector: 'bui-bg-checkbox-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiButtonGroup, Button],
  template: `
    <bui-button-group mode="checkbox" [initialState]="{ selected: [0, 1] }">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
  `,
})
export class BgCheckboxScenario {}

// button-group--radio
@Component({
  selector: 'bui-bg-radio-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiButtonGroup, Button],
  template: `
    <bui-button-group mode="radio" [initialState]="{ selected: 0 }">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
  `,
})
export class BgRadioScenario {}

// button-group--kinds
@Component({
  selector: 'bui-bg-kinds-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiButtonGroup, Button],
  template: `
    <h2 style="font:700 28px/36px var(--bw-font-family);margin:0 0 16px">Kind variants</h2>
    <h5 style="font:700 20px/28px var(--bw-font-family);margin:0 0 8px">Kind: default(secondary)</h5>
    <bui-button-group mode="radio">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
    <h5 style="font:700 20px/28px var(--bw-font-family);margin:16px 0 8px">Kind: tertiary</h5>
    <bui-button-group mode="radio" kind="tertiary">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
    <h5 style="font:700 20px/28px var(--bw-font-family);margin:16px 0 8px">Kind: outline</h5>
    <bui-button-group mode="radio" kind="outline">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
  `,
})
export class BgKindsScenario {}

// button-group--sizes
@Component({
  selector: 'bui-bg-sizes-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiButtonGroup, Button],
  template: `
    <bui-button-group mode="radio" size="compact">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
    <bui-button-group mode="radio" size="default" style="margin-top:8px;display:flex">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
    <bui-button-group mode="radio" size="large" style="margin-top:8px;display:flex">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
  `,
})
export class BgSizesScenario {}

// button-group--selected (controlled via selected prop)
@Component({
  selector: 'bui-bg-selected-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiButtonGroup, Button],
  template: `
    <bui-button-group kind="primary" [selected]="0">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
    <bui-button-group kind="secondary" [selected]="0" style="margin-top:8px;display:flex">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
    <bui-button-group kind="tertiary" [selected]="0" style="margin-top:8px;display:flex">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
  `,
})
export class BgSelectedScenario {}

// button-group--disabled
@Component({
  selector: 'bui-bg-disabled-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiButtonGroup, Button],
  template: `
    <bui-button-group kind="primary" [disabled]="true">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
    <bui-button-group kind="secondary" [disabled]="true" style="margin-top:8px;display:flex">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
    <bui-button-group kind="tertiary" [disabled]="true" style="margin-top:8px;display:flex">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
  `,
})
export class BgDisabledScenario {}

// button-group--pill
@Component({
  selector: 'bui-bg-pill-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiButtonGroup, Button],
  template: `
    <bui-button-group shape="pill" mode="radio" [initialState]="{ selected: 0 }">
      <bui-button>Some label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Some longer label</bui-button>
    </bui-button-group>
  `,
})
export class BgPillScenario {}

// button-group--wrap
@Component({
  selector: 'bui-bg-wrap-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiButtonGroup, Button],
  template: `
    <h2 style="font:700 28px/36px var(--bw-font-family);margin:0 0 16px">Wrap variants</h2>
    <h5 style="font:700 20px/28px var(--bw-font-family);margin:0 0 8px">Wrap not passed</h5>
    <bui-button-group mode="radio" [initialState]="{ selected: 0 }">
      @for (i of ten; track i) { <bui-button>Label</bui-button> }
    </bui-button-group>
    <h5 style="font:700 20px/28px var(--bw-font-family);margin:16px 0 8px">Wrap: false</h5>
    <bui-button-group mode="radio" [initialState]="{ selected: 0 }" [wrap]="false">
      @for (i of ten; track i) { <bui-button>Label</bui-button> }
    </bui-button-group>
    <h5 style="font:700 20px/28px var(--bw-font-family);margin:16px 0 8px">Wrap: false(constrained container width 300px)</h5>
    <div style="width:300px">
      <bui-button-group mode="radio" [initialState]="{ selected: 0 }" [wrap]="false">
        @for (i of ten; track i) { <bui-button>Label</bui-button> }
      </bui-button-group>
    </div>
    <h5 style="font:700 20px/28px var(--bw-font-family);margin:16px 0 8px">Wrap: true</h5>
    <bui-button-group mode="radio" [initialState]="{ selected: 0 }" [wrap]="true">
      @for (i of ten; track i) { <bui-button>Label</bui-button> }
    </bui-button-group>
    <h5 style="font:700 20px/28px var(--bw-font-family);margin:16px 0 8px">Wrap: true(xSmall button group has larger vertical gap)</h5>
    <bui-button-group mode="radio" [initialState]="{ selected: 0 }" [wrap]="true" size="xSmall">
      @for (i of twenty; track i) { <bui-button>Label</bui-button> }
    </bui-button-group>
    <h5 style="font:700 20px/28px var(--bw-font-family);margin:16px 0 8px">Wrap: true(constrained container width 300px)</h5>
    <div style="width:300px">
      <bui-button-group mode="radio" [initialState]="{ selected: 0 }" [wrap]="true">
        @for (i of ten; track i) { <bui-button>Label</bui-button> }
      </bui-button-group>
    </div>
  `,
})
export class BgWrapScenario {
  ten = Array.from({ length: 10 }, (_, i) => i);
  twenty = Array.from({ length: 20 }, (_, i) => i);
}

// button-group--padding (overrides bgcolor = React API → approximated without bg)
@Component({
  selector: 'bui-bg-padding-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiButtonGroup, Button],
  template: `
    <h2 style="font:700 28px/36px var(--bw-font-family);margin:0 0 16px">Padding variants</h2>
    <h5 style="font:700 20px/28px var(--bw-font-family);margin:0 0 8px">Padding: default</h5>
    <bui-button-group mode="radio" [initialState]="{ selected: 0 }" padding="default">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
    <h5 style="font:700 20px/28px var(--bw-font-family);margin:16px 0 8px">Padding: none</h5>
    <bui-button-group mode="radio" [initialState]="{ selected: 0 }" padding="none">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
    <h5 style="font:700 20px/28px var(--bw-font-family);margin:16px 0 8px">Padding: custom</h5>
    <bui-button-group mode="radio" [initialState]="{ selected: 0 }" padding="custom"
      style="--bui-bg-pad-custom: 40px">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
  `,
})
export class BgPaddingScenario {}

// button-group--a11y
@Component({
  selector: 'bui-bg-a11y-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiButtonGroup, Button],
  template: `
    <h2 style="font:700 28px/36px var(--bw-font-family);margin:0 0 16px">Button group A11y</h2>
    <h5 style="font:700 20px/28px var(--bw-font-family);margin:0 0 8px">Actionable button group</h5>
    <bui-button-group>
      <bui-button>Label1</bui-button>
      <bui-button>Label2</bui-button>
      <bui-button>Label3</bui-button>
    </bui-button-group>
    <h5 style="font:700 20px/28px var(--bw-font-family);margin:16px 0 8px">Checkbox button group</h5>
    <bui-button-group mode="checkbox" [initialState]="{ selected: [1] }">
      <bui-button>Checkbox1</bui-button>
      <bui-button>Checkbox2</bui-button>
      <bui-button>Checkbox3</bui-button>
    </bui-button-group>
    <h5 style="font:700 20px/28px var(--bw-font-family);margin:16px 0 8px">Radio button group</h5>
    <bui-button-group mode="radio" [initialState]="{ selected: [1] }">
      <bui-button>Radio1</bui-button>
      <bui-button>Radio2</bui-button>
      <bui-button>Radio3</bui-button>
    </bui-button-group>
  `,
})
export class BgA11yScenario {}

// button-group--selected-disabled
@Component({
  selector: 'bui-bg-selected-disabled-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiButtonGroup, Button],
  template: `
    @for (combo of combos; track combo.kind) {
      <bui-button-group [kind]="combo.kind" [selected]="0" [disabled]="true"
        [style.marginTop]="'8px'" [style.display]="'flex'">
        <bui-button>Label</bui-button>
        <bui-button>Label</bui-button>
        <bui-button>Label</bui-button>
      </bui-button-group>
    }
    @for (combo of combos; track combo.kind + '1') {
      <bui-button-group [kind]="combo.kind" [selected]="1" [disabled]="true"
        [style.marginTop]="'8px'" [style.display]="'flex'">
        <bui-button>Label</bui-button>
        <bui-button>Label</bui-button>
        <bui-button>Label</bui-button>
      </bui-button-group>
    }
  `,
})
export class BgSelectedDisabledScenario {
  combos = [{ kind: 'primary' as const }, { kind: 'secondary' as const }, { kind: 'tertiary' as const }];
}

// button-group--overrides (React style overrides → approximated without bg)
@Component({
  selector: 'bui-bg-overrides-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiButtonGroup, Button],
  template: `
    <bui-button-group mode="checkbox" [initialState]="{ selected: [0, 1] }">
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
      <bui-button>Label</bui-button>
    </bui-button-group>
  `,
})
export class BgOverridesScenario {}
