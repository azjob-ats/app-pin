import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BuiRadio, BuiRadioGroup } from './radio.component';
import { Select } from '../select/select.component';

/** Scenarios portadas de `src/radio/__tests__/*.scenario.tsx`. */
const FC_LABEL = 'font:var(--bw-font-LabelSmall);color:var(--bw-content-primary);margin-bottom:var(--bw-sizing-scale300)';

// radio.scenario.tsx — FormControl (aprox.) + StatefulRadioGroup value="2".
@Component({
  selector: 'bui-s-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiRadio, BuiRadioGroup],
  template: `<div>
    <div style="${FC_LABEL}">Test-label</div>
    <bui-radio-group value="2" ariaLabel="choose item">
      <bui-radio value="1">First</bui-radio>
      <bui-radio
        value="2"
        description="This is a radio description, it gives a little more in-yo-face context about what this is."
      >
        Second
      </bui-radio>
      <bui-radio value="3">Third</bui-radio>
    </bui-radio-group>
  </div>`,
})
export class RadioScenario {}

// radio-states.scenario.tsx — default / disabled / error.
@Component({
  selector: 'bui-s-radio-states',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiRadio, BuiRadioGroup],
  template: `<div>
    <bui-radio-group name="example1" value="1">
      <bui-radio value="1">Uber</bui-radio>
      <bui-radio value="2">Taxi</bui-radio>
    </bui-radio-group>
    <bui-radio-group name="example2" value="1" disabled>
      <bui-radio value="1">Uber</bui-radio>
      <bui-radio value="2">Taxi</bui-radio>
    </bui-radio-group>
    <bui-radio-group name="example3" value="1" error>
      <bui-radio value="1">Uber</bui-radio>
      <bui-radio value="2">Taxi</bui-radio>
    </bui-radio-group>
  </div>`,
})
export class RadioStatesScenario {}

// radio-select.scenario.tsx — FormControl (aprox.) + radio com Select interativo.
@Component({
  selector: 'bui-s-radio-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiRadio, BuiRadioGroup, Select],
  template: `<div style="max-width:320px">
    <div style="${FC_LABEL}">Test-label</div>
    <bui-radio-group name="number" align="vertical">
      <bui-radio value="1">One</bui-radio>
      <bui-radio value="2" description="This is a radio description">Two</bui-radio>
      <bui-radio value="3">Three</bui-radio>
      <bui-radio
        value="4"
        description="This one has a Select that only works with keyboard"
        containsInteractiveElement
      >
        <bui-select placeholder="Select color" />
      </bui-radio>
    </bui-radio-group>
  </div>`,
})
export class RadioSelectScenario {}
