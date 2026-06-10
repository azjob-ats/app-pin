import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { BuiTimezonePicker, TimezoneOption } from './timezonepicker.component';

const DAYLIGHT = new Date(2019, 3, 1);
const STANDARD = new Date(2019, 2, 1);

// timezone-picker.scenario.tsx — daylight, standard, controlled.
@Component({
  selector: 'bui-s-timezone-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTimezonePicker],
  template: `
    <div style="width:400px">
      <div data-e2e="daylight" style="margin-bottom:16px">
        daylight savings time:
        <bui-timezone-picker [date]="daylight" />
      </div>
      <div data-e2e="standard" style="margin-bottom:16px">
        standard time:
        <bui-timezone-picker [date]="standard" />
      </div>
      <div data-e2e="controlled">
        controlled
        <br />
        <button (click)="setLA()">Set LA</button>
        <br />
        <bui-timezone-picker [date]="daylight" [value]="controlled()" (changed)="controlled.set($event?.id ?? null)" />
      </div>
    </div>
  `,
})
export class TimezonepickerScenario {
  protected readonly daylight = DAYLIGHT;
  protected readonly standard = STANDARD;
  protected readonly controlled = signal<string | null>('Asia/Tokyo');

  protected setLA(): void { this.controlled.set('America/Los_Angeles'); }
}

// timezone-picker--abbreviations.scenario.tsx — includeAbbreviations.
@Component({
  selector: 'bui-s-timezone-picker-abbreviations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTimezonePicker],
  template: `
    <div style="width:400px">
      <div data-e2e="daylight" style="margin-bottom:16px">
        daylight savings time:
        <bui-timezone-picker [date]="daylight" includeAbbreviations />
      </div>
      <div data-e2e="standard" style="margin-bottom:16px">
        standard time:
        <bui-timezone-picker [date]="standard" includeAbbreviations />
      </div>
      <div data-e2e="controlled">
        controlled
        <br />
        <button (click)="setLA()">Set LA</button>
        <br />
        <bui-timezone-picker [date]="daylight" includeAbbreviations [value]="controlled()" (changed)="controlled.set($event?.id ?? null)" />
      </div>
    </div>
  `,
})
export class TimezonepickerAbbreviationsScenario {
  protected readonly daylight = DAYLIGHT;
  protected readonly standard = STANDARD;
  protected readonly controlled = signal<string | null>('Asia/Tokyo');

  protected setLA(): void { this.controlled.set('America/Los_Angeles'); }
}

// timezone-picker-additional-timezones.scenario.tsx — additionalTimezones.
@Component({
  selector: 'bui-s-timezone-picker-additional',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTimezonePicker],
  template: `
    <div style="width:400px">
      <bui-timezone-picker [date]="standard" [additionalTimezones]="additional" />
    </div>
  `,
})
export class TimezonepickerAdditionalScenario {
  protected readonly standard = STANDARD;
  protected readonly additional: TimezoneOption[] = [{ id: 'UTC', label: '(GMT +0) UTC', offset: 0 }];
}
