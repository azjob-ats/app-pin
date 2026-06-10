import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BuiRadioV2, BuiRadioGroupV2 } from './radio-v2.component';
import { BwTypography } from '../typography/typography.directive';
import { Select } from '../select/select.component';

/** Scenarios portadas de `src/radio-v2/__tests__/*.scenario.tsx`. */
const FC_LABEL = 'font:var(--bw-font-LabelSmall);color:var(--bw-content-primary);margin-bottom:var(--bw-sizing-scale300)';

// radio.scenario.tsx — FormControl (aprox.) × StatefulRadioGroup + RadioGroup.
@Component({
  selector: 'bui-s-radio-v2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiRadioV2, BuiRadioGroupV2],
  template: `<div>
    <div style="${FC_LABEL}">Stateful Radio Group</div>
    <bui-radio-group-v2 name="stateful" value="2">
      <bui-radio-v2 value="1">First</bui-radio-v2>
      <bui-radio-v2
        value="2"
        description="This is a radio description, it gives a little more in-yo-face context about what this is."
      >
        Second
      </bui-radio-v2>
      <bui-radio-v2 value="3">Third</bui-radio-v2>
    </bui-radio-group-v2>
    <div style="${FC_LABEL};margin-top:var(--bw-sizing-scale600)">Stateless Radio Group</div>
    <bui-radio-group-v2 name="stateless" value="1">
      <bui-radio-v2 value="1">First</bui-radio-v2>
      <bui-radio-v2
        value="2"
        description="This is a radio description, it gives a little more in-yo-face context about what this is."
      >
        Second
      </bui-radio-v2>
      <bui-radio-v2 value="3">Third</bui-radio-v2>
    </bui-radio-group-v2>
  </div>`,
})
export class RadioV2Scenario {}

// radio-align.scenario.tsx — vertical (default) + horizontal.
@Component({
  selector: 'bui-s-radio-v2-align',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiRadioV2, BuiRadioGroupV2, BwTypography],
  template: `<div>
    <div buiTypo="HeadingSmall">Vertical Alignment (Default)</div>
    <bui-radio-group-v2 align="vertical" value="2" ariaLabel="vertical alignment" name="rav">
      <bui-radio-v2 value="1"><span buiTypo="LabelMedium">First</span></bui-radio-v2>
      <bui-radio-v2 value="2"><span buiTypo="LabelMedium">Second</span></bui-radio-v2>
      <bui-radio-v2 value="3"><span buiTypo="LabelMedium">Third</span></bui-radio-v2>
    </bui-radio-group-v2>
    <div buiTypo="HeadingSmall" style="margin-top:var(--bw-sizing-scale800)">Horizontal Alignment</div>
    <bui-radio-group-v2 align="horizontal" value="2" ariaLabel="horizontal alignment" name="rah">
      <bui-radio-v2 value="1"><span buiTypo="LabelMedium">First</span></bui-radio-v2>
      <bui-radio-v2 value="2"><span buiTypo="LabelMedium">Second</span></bui-radio-v2>
      <bui-radio-v2 value="3"><span buiTypo="LabelMedium">Third</span></bui-radio-v2>
    </bui-radio-group-v2>
  </div>`,
})
export class RadioV2AlignScenario {}

// radio-label-placement.scenario.tsx — top/right/bottom/left.
@Component({
  selector: 'bui-s-radio-v2-label-placement',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiRadioV2, BuiRadioGroupV2, BwTypography],
  template: `<div>
    <div buiTypo="HeadingSmall">Label Placement: Top</div>
    <bui-radio-group-v2 labelPlacement="top" align="horizontal" value="2" ariaLabel="top" name="rpt">
      <bui-radio-v2 value="1" description="This is a description for the first radio"><span buiTypo="LabelMedium">First</span></bui-radio-v2>
      <bui-radio-v2 value="2" description="This is a description for the second radio. This is a description for the second radio. This is a description for the second radio. This is a description for the second radio."><span buiTypo="LabelMedium">Second</span></bui-radio-v2>
      <bui-radio-v2 value="3" description="This is a description for the third radio"><span buiTypo="LabelMedium">Third</span></bui-radio-v2>
    </bui-radio-group-v2>
    <div buiTypo="HeadingSmall" style="margin-top:var(--bw-sizing-scale800)">Label Placement: Right (Default)</div>
    <bui-radio-group-v2 labelPlacement="right" value="2" ariaLabel="right" name="rpr">
      <bui-radio-v2 value="1" description="This is a description for the first radio"><span buiTypo="LabelMedium">First</span></bui-radio-v2>
      <bui-radio-v2 value="2" description="This is a description for the second radio."><span buiTypo="LabelMedium">Second</span></bui-radio-v2>
      <bui-radio-v2 value="3" description="This is a description for the third radio"><span buiTypo="LabelMedium">Third</span></bui-radio-v2>
    </bui-radio-group-v2>
    <div buiTypo="HeadingSmall" style="margin-top:var(--bw-sizing-scale800)">Label Placement: Bottom</div>
    <bui-radio-group-v2 labelPlacement="bottom" align="horizontal" value="2" ariaLabel="bottom" name="rpb">
      <bui-radio-v2 value="1" description="This is a description for the first radio"><span buiTypo="LabelMedium">First</span></bui-radio-v2>
      <bui-radio-v2 value="2" description="This is a description for the second radio. This is a description for the second radio."><span buiTypo="LabelMedium">Second</span></bui-radio-v2>
      <bui-radio-v2 value="3" description="This is a description for the third radio"><span buiTypo="LabelMedium">Third</span></bui-radio-v2>
    </bui-radio-group-v2>
    <div buiTypo="HeadingSmall" style="margin-top:var(--bw-sizing-scale800)">Label Placement: Left</div>
    <bui-radio-group-v2 labelPlacement="left" value="2" ariaLabel="left" name="rpl">
      <bui-radio-v2 value="1" description="This is a description for the first radio"><span buiTypo="LabelMedium">First</span></bui-radio-v2>
      <bui-radio-v2 value="2" description="This is a description for the second radio"><span buiTypo="LabelMedium">Second</span></bui-radio-v2>
      <bui-radio-v2 value="3" description="This is a description for the third radio"><span buiTypo="LabelMedium">Third</span></bui-radio-v2>
    </bui-radio-group-v2>
  </div>`,
})
export class RadioV2LabelPlacementScenario {}

// radio-interactive-label.scenario.tsx — FormControl (aprox.) + radio com Select.
@Component({
  selector: 'bui-s-radio-v2-interactive-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiRadioV2, BuiRadioGroupV2, Select],
  template: `<div style="max-width:320px">
    <div style="${FC_LABEL}">Test-label</div>
    <bui-radio-group-v2 name="number" align="vertical">
      <bui-radio-v2 value="1">One</bui-radio-v2>
      <bui-radio-v2 value="2" description="This is a radio description">Two</bui-radio-v2>
      <bui-radio-v2 value="3">Three</bui-radio-v2>
      <bui-radio-v2
        value="4"
        description="Label contains interactive element. Clicking on the label should not select the radio."
        containsInteractiveElement
      >
        <bui-select placeholder="Select color" />
      </bui-radio-v2>
    </bui-radio-group-v2>
  </div>`,
})
export class RadioV2InteractiveLabelScenario {}

// radio-states.scenario.tsx — grade de estados (table-grid aprox.) com radios standalone.
@Component({
  selector: 'bui-s-radio-v2-states',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiRadioV2, BwTypography],
  template: `<div>
    <div buiTypo="HeadingMedium">Radio illustrations - States</div>
    <div buiTypo="LabelMedium">
      Note: This story is not suitable for accessibility testing. The standalone radios have to be
      handled by a baseui RadioGroup or product team with their own logic on isFocused,
      isFocusVisible, checked, tabIndex, etc.
    </div>
    <div role="grid" class="rv2-grid">
      <div class="rv2-h"><span buiTypo="LabelMedium">State</span></div>
      <div class="rv2-h"><span buiTypo="LabelMedium">Unchecked</span></div>
      <div class="rv2-h"><span buiTypo="LabelMedium">Checked</span></div>
      @for (row of rows; track row.label) {
        <div class="rv2-c"><span buiTypo="LabelMedium">{{ row.label }}</span></div>
        <div class="rv2-c">
          <bui-radio-v2 [checked]="false" [disabled]="row.disabled" [error]="row.error" [description]="row.desc" [align]="row.align">{{ row.text }}</bui-radio-v2>
        </div>
        <div class="rv2-c">
          <bui-radio-v2 [checked]="true" [disabled]="row.disabled" [error]="row.error" [description]="row.desc" [align]="row.align">{{ row.text }}</bui-radio-v2>
        </div>
      }
    </div>
  </div>`,
  styles: [
    `.rv2-grid { display: grid; grid-template-columns: 200px 1fr 1fr; border-top: 1px solid var(--bw-border-opaque, #e2e2e2); }
     .rv2-h, .rv2-c { padding: var(--bw-sizing-scale300); border-bottom: 1px solid var(--bw-border-opaque, #e2e2e2); display: flex; align-items: center; }`,
  ],
})
export class RadioV2StatesScenario {
  protected readonly rows: {
    label: string;
    text: string;
    disabled: boolean;
    error: boolean;
    desc: string | undefined;
    align: 'vertical' | 'horizontal';
  }[] = [
    { label: 'Standalone', text: '', disabled: false, error: false, desc: undefined, align: 'vertical' },
    { label: 'Default', text: 'Option', disabled: false, error: false, desc: undefined, align: 'vertical' },
    { label: 'Disabled', text: 'Option', disabled: true, error: false, desc: undefined, align: 'vertical' },
    { label: 'Error', text: 'Option', disabled: false, error: true, desc: undefined, align: 'vertical' },
    { label: 'Disabled + Error', text: 'Option', disabled: true, error: true, desc: undefined, align: 'vertical' },
    { label: 'With Label', text: 'Radio Label', disabled: false, error: false, desc: undefined, align: 'vertical' },
    { label: 'With Label + Description', text: 'Radio Label', disabled: false, error: false, desc: 'This is a description text', align: 'vertical' },
    {
      label: 'With Long Label + Description',
      text: 'Radio Label with a very long text to illustrate wrapping and layout behavior',
      disabled: false,
      error: false,
      desc: 'This is a description text',
      align: 'vertical',
    },
    {
      label: 'With Long Label + Long Description(set as horizontal alignment)',
      text: 'Radio Label with a very long text to illustrate wrapping and layout behavior',
      disabled: false,
      error: false,
      desc: 'This is a description text with a very long text to illustrate wrapping and layout behavior and it is designed to span more than 3 lines in order to test the truncation style applied to the description in this specific scenario',
      align: 'horizontal',
    },
  ];
}
