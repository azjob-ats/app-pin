import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BuiSlider, BuiStatefulSlider } from './slider.component';
import { Option, Select } from '../select/select.component';

// slider--slider
@Component({
  selector: 'bui-slider-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulSlider],
  template: `<div style="max-width:500px;margin:64px"><bui-stateful-slider /></div>`,
})
export class SliderScenario {}

// slider--slider-range
@Component({
  selector: 'bui-slider-range-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulSlider],
  template: `<div style="max-width:500px;margin:64px"><bui-stateful-slider [initialState]="{ value: [25, 60] }" /></div>`,
})
export class SliderRangeScenario {}

// slider--slider-step
@Component({
  selector: 'bui-slider-step-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulSlider],
  template: `<div style="max-width:500px;margin:64px"><bui-stateful-slider [initialState]="{ value: [0] }" [step]="5" [min]="-300" [max]="300" /></div>`,
})
export class SliderStepScenario {}

// slider--slider-marks
@Component({
  selector: 'bui-slider-marks-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulSlider],
  template: `<div style="max-width:500px;margin:64px"><bui-stateful-slider [initialState]="{ value: [20] }" [step]="10" [min]="0" [max]="100" marks /></div>`,
})
export class SliderMarksScenario {}

// slider--slider-disabled
@Component({
  selector: 'bui-slider-disabled-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulSlider],
  template: `<div style="max-width:500px;margin:64px"><bui-stateful-slider [initialState]="{ value: [50] }" disabled /></div>`,
})
export class SliderDisabledScenario {}

// slider--slider-rtl
@Component({
  selector: 'bui-slider-rtl-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulSlider],
  template: `
    <div dir="rtl" style="max-width:500px;margin:64px">
      <bui-stateful-slider />
    </div>
  `,
})
export class SliderRtlScenario {}

function timeLabel(value: number): string {
  const hour = Math.floor((value > 52 ? value - 48 : value) / 4);
  const minute = ((value % 4) * 15).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const meridiem = value > 95 / 2 ? 'PM' : 'AM';
  return `${hour === 0 ? '12' : hour}:${minute}  ${meridiem}`;
}

// slider--slider-always-show-label
@Component({
  selector: 'bui-slider-always-show-label-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiSlider, BuiStatefulSlider],
  template: `
    <div>
      <div style="margin:64px">
        <bui-slider
          persistentThumb
          [value]="rangeValue()"
          [max]="95"
          [min]="0"
          [valueToLabel]="timeLabel"
          (sliderChange)="rangeValue.set($event.value)"
        />
      </div>
      <div style="margin:64px">
        <bui-stateful-slider [initialState]="{ value: [50] }" disabled persistentThumb />
      </div>
      <div style="margin:64px">
        <bui-stateful-slider [initialState]="{ value: [20] }" [step]="10" [min]="0" [max]="100" marks persistentThumb />
      </div>
      <div style="margin:64px">
        <bui-stateful-slider [initialState]="{ value: [25, 60] }" persistentThumb />
      </div>
      <div style="margin:64px">
        <bui-stateful-slider [initialState]="{ value: [0] }" [step]="5" [min]="-300" [max]="300" persistentThumb />
      </div>
    </div>
  `,
})
export class SliderAlwaysShowLabelScenario {
  readonly rangeValue = signal([10, 70]);
  readonly timeLabel = timeLabel;
}

// slider--slider-custom-label
@Component({
  selector: 'bui-slider-custom-label-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiSlider],
  template: `
    <div style="margin:64px">
      <bui-slider
        [value]="rangeValue()"
        [max]="95"
        [min]="0"
        [valueToLabel]="timeLabel"
        (sliderChange)="rangeValue.set($event.value)"
      />
    </div>
  `,
})
export class SliderCustomLabelScenario {
  readonly rangeValue = signal([10, 75]);
  readonly timeLabel = timeLabel;
}

// slider--slider-select-dropdown
@Component({
  selector: 'bui-slider-select-dropdown-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiSlider, Select],
  template: `
    <div style="padding:16px">
      <bui-select
        [options]="selectOptions"
        [value]="selectValue()"
        placeholder="Select color"
        ariaLabel="Color"
        [startOpen]="true"
        (changed)="selectValue.set($event)"
      />
      <div style="max-width:500px;margin-top:16px">
        <bui-slider
          [value]="sliderValue()"
          (sliderChange)="sliderValue.set($event.value)"
        />
      </div>
    </div>
  `,
})
export class SliderSelectDropdownScenario {
  readonly sliderValue = signal([25, 75]);
  readonly selectValue = signal<Option[]>([]);

  readonly selectOptions = [
    { label: 'AliceBlue', id: '#F0F8FF' },
    { label: 'AntiqueWhite', id: '#FAEBD7' },
    { label: 'Aqua', id: '#00FFFF' },
    { label: 'Aquamarine', id: '#7FFFD4' },
    { label: 'Azure', id: '#F0FFFF' },
    { label: 'Beige', id: '#F5F5DC' },
  ];
}
