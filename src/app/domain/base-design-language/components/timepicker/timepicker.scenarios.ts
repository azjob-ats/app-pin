import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, signal } from '@angular/core';
import { BuiTimePicker } from './timepicker.component';

const MIDNIGHT = new Date(2019, 3, 19, 0, 0, 0, 0);
const OFF_STEP = new Date(2019, 3, 19, 1, 11, 0, 0);

function minT(h: number, min: number): Date {
  const d = new Date(MIDNIGHT); d.setHours(h, min, 0, 0); return d;
}

// time-picker.scenario.tsx — 12h/24h/creatable/min/max variants in 130px width.
@Component({
  selector: 'bui-s-timepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTimePicker],
  template: `
    <div style="width:130px">
      <div>12 hour format
        <bui-time-picker format="12" [step]="900" [nullable]="true" ariaLabel="12-hour time" (changed)="t12.set($event)" />
        <p>hour: {{ t12() ? t12()!.getHours() : 'null' }}</p>
        <p>minute: {{ t12() ? t12()!.getMinutes() : 'null' }}</p>
      </div>
      <div>24 hour format
        <bui-time-picker format="24" [step]="1800" [value]="midnight" ariaLabel="24-hour time" (changed)="t24.set($event)" />
        <p>hour: {{ t24() ? t24()!.getHours() : 'null' }}</p>
        <p>minute: {{ t24() ? t24()!.getMinutes() : 'null' }}</p>
      </div>
      <div>12 hour format creatable
        <bui-time-picker format="12" [step]="900" [value]="offStep" creatable size="compact" ariaLabel="12-hour creatable" (changed)="t12c.set($event)" />
        <p>hour: {{ t12c() ? t12c()!.getHours() : 'null' }}</p>
        <p>minute: {{ t12c() ? t12c()!.getMinutes() : 'null' }}</p>
      </div>
      <div>24 hour format creatable
        <bui-time-picker format="24" [step]="900" [value]="offStep" creatable size="large" ariaLabel="24-hour creatable" (changed)="t24c.set($event)" />
        <p>hour: {{ t24c() ? t24c()!.getHours() : 'null' }}</p>
        <p>minute: {{ t24c() ? t24c()!.getMinutes() : 'null' }}</p>
      </div>
      <div>Without a value
        <bui-time-picker [nullable]="true" placeholder="XX:YY" ariaLabel="nullable time" (changed)="tNull.set($event)" />
        <p>hour: {{ tNull() ? tNull()!.getHours() : 'null' }}</p>
        <p>minute: {{ tNull() ? tNull()!.getMinutes() : 'null' }}</p>
      </div>
      <div>With min time
        <bui-time-picker format="24" [step]="1800" [value]="midnight" [minTime]="minTime" ariaLabel="min-time" (changed)="tMin.set($event)" />
        <p>hour: {{ tMin() ? tMin()!.getHours() : 'null' }}</p>
      </div>
      <div>With max time
        <bui-time-picker format="24" [step]="1800" [value]="midnight" [maxTime]="maxTime" ariaLabel="max-time" (changed)="tMax.set($event)" />
        <p>hour: {{ tMax() ? tMax()!.getHours() : 'null' }}</p>
      </div>
      <div>With min &amp; max time
        <bui-time-picker format="24" [step]="1800" [value]="midnight" [minTime]="minTime" [maxTime]="maxTime" ariaLabel="min-max-time" (changed)="tMM.set($event)" />
        <p>hour: {{ tMM() ? tMM()!.getHours() : 'null' }}</p>
      </div>
    </div>
  `,
})
export class TimepickerScenario {
  protected readonly midnight = MIDNIGHT;
  protected readonly offStep = OFF_STEP;
  protected readonly minTime = minT(9, 30);
  protected readonly maxTime = minT(18, 30);

  protected readonly t12 = signal<Date | null>(null);
  protected readonly t24 = signal<Date | null>(MIDNIGHT);
  protected readonly t12c = signal<Date | null>(OFF_STEP);
  protected readonly t24c = signal<Date | null>(OFF_STEP);
  protected readonly tNull = signal<Date | null>(null);
  protected readonly tMin = signal<Date | null>(MIDNIGHT);
  protected readonly tMax = signal<Date | null>(MIDNIGHT);
  protected readonly tMM = signal<Date | null>(MIDNIGHT);
}

// time-picker-min-max-diff-day.scenario.tsx — min/max on different days.
@Component({
  selector: 'bui-s-timepicker-min-max-diff-day',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTimePicker],
  template: `
    <div>
      <div id="default" style="margin-bottom:8px">default
        <bui-time-picker
          [minTime]="min4_8" [maxTime]="max8_18" [value]="val6_11"
          ariaLabel="default" (changed)="v1.set($event)" />
      </div>
      <div id="max-after-current" style="margin-bottom:8px">max-after-current
        <bui-time-picker
          [minTime]="min6_8" [maxTime]="max8_18" [value]="val6_11"
          ariaLabel="max-after-current" (changed)="v2.set($event)" />
      </div>
      <div id="min-before-current" style="margin-bottom:8px">min-before-current
        <bui-time-picker
          [minTime]="min4_8" [maxTime]="max6_18" [value]="val6_11"
          ariaLabel="min-before-current" (changed)="v3.set($event)" />
      </div>
      <div id="ignore-min-max-date" style="margin-bottom:8px">ignore-min-max-date
        <bui-time-picker ignoreMinMaxDateComponent
          [minTime]="min4_8" [maxTime]="max8_18" [value]="val6_11"
          ariaLabel="ignore-min-max-date" (changed)="v4.set($event)" />
      </div>
      <div id="max-time-lands-on-step" style="margin-bottom:8px">max-time-lands-on-step
        <bui-time-picker ignoreMinMaxDateComponent
          [minTime]="min4_800" [maxTime]="max8_1000" [value]="val6_902"
          ariaLabel="max-time-lands-on-step" (changed)="v5.set($event)" />
      </div>
      <div id="test" style="margin-bottom:8px">test
        <bui-time-picker ignoreMinMaxDateComponent
          [minTime]="min4_800" [maxTime]="max8_1000" [value]="val6_900"
          ariaLabel="test" (changed)="v6.set($event)" />
      </div>
    </div>
  `,
})
export class TimepickerMinMaxDiffDayScenario {
  protected readonly min4_8 = new Date('December 4, 2021 8:02:00');
  protected readonly max8_18 = new Date('December 8, 2021 18:02:00');
  protected readonly val6_11 = new Date('December 6, 2021 11:02:00');
  protected readonly min6_8 = new Date('December 6, 2021 8:02:00');
  protected readonly max6_18 = new Date('December 6, 2021 18:02:00');
  protected readonly min4_800 = new Date('December 4, 2021 8:00:00');
  protected readonly max8_1000 = new Date('December 8, 2021 10:00:00');
  protected readonly val6_902 = new Date('December 6, 2021 9:02:00');
  protected readonly val6_900 = new Date('December 6, 2021 9:00:00');

  protected readonly v1 = signal<Date | null>(null);
  protected readonly v2 = signal<Date | null>(null);
  protected readonly v3 = signal<Date | null>(null);
  protected readonly v4 = signal<Date | null>(null);
  protected readonly v5 = signal<Date | null>(null);
  protected readonly v6 = signal<Date | null>(null);
}
