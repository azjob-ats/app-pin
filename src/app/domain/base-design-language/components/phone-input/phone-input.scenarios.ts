import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {
  BuiPhoneInput,
  BuiPhoneInputLite,
  BuiStatefulPhoneInput,
} from './phone-input.component';
import { Country, CountriesMap } from './countries';

const LITE_COUNTRIES: CountriesMap = {
  AF: { label: 'Afghanistan (‫افغانستان‬‎)', id: 'AF', dialCode: '+93' },
  AL: { label: 'Albania (Shqipëri)', id: 'AL', dialCode: '+355' },
  DZ: { label: 'Algeria (‫الجزائر‬‎)', id: 'DZ', dialCode: '+213' },
  AS: { label: 'American Samoa', id: 'AS', dialCode: '+1684' },
  AD: { label: 'Andorra', id: 'AD', dialCode: '+376' },
  AO: { label: 'Angola', id: 'AO', dialCode: '+244' },
  AI: { label: 'Anguilla', id: 'AI', dialCode: '+1264' },
};

const AF_COUNTRY: Country = { label: 'Afghanistan (‫افغانستان‬‎)', id: 'AF', dialCode: '+93' };

// phone-input.scenario.tsx — Uncontrolled + Controlled + Sizes + States.
@Component({
  selector: 'bui-s-phone-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulPhoneInput, BuiPhoneInput],
  template: `
    <p>Uncontrolled (Stateful)</p>
    <bui-stateful-phone-input />

    <p>Controlled (Stateless)</p>
    <bui-phone-input />

    <p>Sizes</p>
    <bui-stateful-phone-input size="mini" /><br />
    <bui-stateful-phone-input size="compact" /><br />
    <bui-stateful-phone-input /><br />
    <bui-stateful-phone-input size="large" />

    <p>States</p>
    <bui-stateful-phone-input positive /><br />
    <bui-stateful-phone-input error /><br />
  `,
})
export class PhoneInputScenario {}

// phone-input-lite.scenario.tsx — StatefulPhoneInput + PhoneInputLite with custom countries.
@Component({
  selector: 'bui-s-phone-input-lite',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulPhoneInput, BuiPhoneInputLite],
  template: `
    <bui-stateful-phone-input />
    <br />
    <p>Phone input lite</p>
    <bui-phone-input-lite [country]="af" [countries]="liteCountries" />
  `,
})
export class PhoneInputLiteScenario {
  protected readonly af = AF_COUNTRY;
  protected readonly liteCountries = LITE_COUNTRIES;
}

// phone-input-dropdown.scenario.tsx — StatefulPhoneInput (standard).
@Component({
  selector: 'bui-s-phone-input-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulPhoneInput],
  template: `<bui-stateful-phone-input />`,
})
export class PhoneInputDropdownScenario {}

// phone-input-rtl.scenario.tsx — RTL direction wrapper.
@Component({
  selector: 'bui-s-phone-input-rtl',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulPhoneInput],
  template: `
    <div dir="rtl">
      <p>Uncontrolled (Stateful)</p>
      <bui-stateful-phone-input dir="rtl" />

      <p>Sizes</p>
      <bui-stateful-phone-input size="mini" dir="rtl" /><br />
      <bui-stateful-phone-input size="compact" dir="rtl" /><br />
      <bui-stateful-phone-input dir="rtl" /><br />
      <bui-stateful-phone-input size="large" dir="rtl" />

      <p>States</p>
      <bui-stateful-phone-input positive dir="rtl" /><br />
      <bui-stateful-phone-input error dir="rtl" /><br />
    </div>
  `,
})
export class PhoneInputRtlScenario {}

// phone-input-overrides.scenario.tsx — approximate with colored wrappers.
@Component({
  selector: 'bui-s-phone-input-overrides',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulPhoneInput],
  template: `
    <div style="--bw-background-secondary:pink;--bw-background-primary:pink">
      <bui-stateful-phone-input />
    </div>
  `,
})
export class PhoneInputOverridesScenario {}

// country-select-dropdown.scenario.tsx — sizes + states (compact, default, large, positive, error).
@Component({
  selector: 'bui-s-country-select-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulPhoneInput],
  template: `
    <bui-stateful-phone-input size="compact" /><br />
    <bui-stateful-phone-input /><br />
    <bui-stateful-phone-input size="large" /><br />
    <bui-stateful-phone-input positive /><br />
    <bui-stateful-phone-input error />
  `,
})
export class CountrySelectDropdownScenario {}

// country-select-small-dropdown.scenario.tsx — maxDropdownHeight="100px".
@Component({
  selector: 'bui-s-country-select-small-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiStatefulPhoneInput],
  template: `<bui-stateful-phone-input maxDropdownHeight="100px" />`,
})
export class CountrySelectSmallDropdownScenario {}
