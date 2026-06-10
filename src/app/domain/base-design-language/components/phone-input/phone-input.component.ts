import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { BuiInput, BuiInputBefore } from '../input/input.component';
import { COUNTRIES, Country, CountriesMap } from './countries';
import type { SelectSize } from '../select/select.component';

const OFFSET = 127397;
function iso2Flag(iso: string): string {
  return Array.from(iso.toUpperCase()).map((c) => String.fromCodePoint(c.charCodeAt(0) + OFFSET)).join('');
}

const SIZE_WIDTH: Record<SelectSize, string> = {
  mini: '50px', compact: '60px', default: '70px', large: '80px',
};
const SIZE_FLAG: Record<SelectSize, string> = {
  mini: '1.2rem', compact: '1.4rem', default: '1.6rem', large: '1.8rem',
};

/**
 * BuiCountrySelect — dropdown compacto de países (flag + chevron) via CDK overlay.
 * Abre uma lista pesquisável com flag, nome do país e código discagem.
 */
@Component({
  selector: 'bui-country-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [OverlayModule],
  styleUrl: './phone-input.component.scss',
  template: `
    <div
      class="bui-cs__root"
      [class.bui-cs--error]="error()"
      [class.bui-cs--positive]="positive()"
      [class.bui-cs--disabled]="disabled()"
      [style.width]="width()"
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
    >
      <button
        class="bui-cs__trigger"
        type="button"
        [disabled]="disabled()"
        [attr.aria-label]="'Select country, currently ' + country().label"
        [attr.aria-expanded]="open()"
        aria-haspopup="listbox"
        (click)="toggleOpen()"
      >
        <span class="bui-cs__flag" [style.font-size]="flagSize()">{{ flag() }}</span>
        <span class="bui-cs__chevron" aria-hidden="true">▾</span>
      </button>
    </div>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayHasBackdrop]="true"
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
      cdkConnectedOverlayPanelClass="bw-root"
      (backdropClick)="open.set(false)"
      (overlayOutsideClick)="open.set(false)"
    >
      <div class="bui-cs__dropdown" [style.max-height]="maxDropdownHeight()" [style.max-width]="maxDropdownWidth()" role="listbox" [attr.aria-label]="'Select country, currently ' + country().label">
        <div class="bui-cs__search">
          <input
            class="bui-cs__search-input"
            type="search"
            placeholder="Search countries..."
            aria-label="Search countries"
            [value]="query()"
            (input)="query.set($any($event.target).value)"
          />
        </div>
        <ul class="bui-cs__list">
          @for (c of filtered(); track c.id) {
            <li
              class="bui-cs__item"
              [class.bui-cs__item--selected]="c.id === country().id"
              role="option"
              [attr.aria-selected]="c.id === country().id"
              (click)="selectCountry(c)"
              (keydown.enter)="selectCountry(c)"
              (keydown.space)="selectCountry(c)"
            >
              <span class="bui-cs__item-flag" aria-hidden="true">{{ isoFlag(c.id) }}</span>
              <span class="bui-cs__item-name">{{ c.label }}</span>
              <span class="bui-cs__item-dialcode">{{ c.dialCode }}</span>
            </li>
          }
          @if (!filtered().length) {
            <li class="bui-cs__empty" role="option" aria-selected="false">No results</li>
          }
        </ul>
      </div>
    </ng-template>
  `,
})
export class BuiCountrySelect {
  readonly country = input<Country>({ label: 'United States', id: 'US', dialCode: '+1' });
  readonly countries = input<CountriesMap>(COUNTRIES as unknown as CountriesMap);
  readonly size = input<SelectSize>('default');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly positive = input(false, { transform: booleanAttribute });
  readonly maxDropdownHeight = input('400px');
  readonly maxDropdownWidth = input('400px');
  readonly countryChange = output<Country>();

  protected readonly open = signal(false);
  protected readonly query = signal('');

  protected readonly flag = computed(() => iso2Flag(this.country().id));
  protected readonly width = computed(() => SIZE_WIDTH[this.size()]);
  protected readonly flagSize = computed(() => SIZE_FLAG[this.size()]);

  protected readonly filtered = computed(() => {
    const q = this.query().toLowerCase();
    const all = Object.values(this.countries()) as Country[];
    return q ? all.filter((c) => c.label.toLowerCase().includes(q) || c.dialCode.includes(q)) : all;
  });

  protected readonly positions = [
    { originX: 'start' as const, originY: 'bottom' as const, overlayX: 'start' as const, overlayY: 'top' as const, offsetY: 4 },
    { originX: 'start' as const, originY: 'top' as const, overlayX: 'start' as const, overlayY: 'bottom' as const, offsetY: -4 },
  ];

  protected isoFlag(iso: string): string { return iso2Flag(iso); }

  protected toggleOpen(): void { if (!this.disabled()) this.open.update((o) => !o); }

  protected selectCountry(c: Country): void {
    this.countryChange.emit(c);
    this.open.set(false);
    this.query.set('');
  }
}

/**
 * BuiPhoneInputLite — clone de `PhoneInputLite`. Aceita `countries` dict arbitrário.
 * Estrutura: `[BuiCountrySelect] [BuiInput com dialCode no Before]`.
 */
@Component({
  selector: 'bui-phone-input-lite',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiCountrySelect, BuiInput, BuiInputBefore],
  styleUrl: './phone-input.component.scss',
  template: `
    <div class="bui-phone__root" data-baseweb="phone-input" [attr.dir]="dir()">
      <bui-country-select
        [country]="country()"
        [countries]="countries()"
        [size]="size()"
        [disabled]="disabled()"
        [error]="error()"
        [positive]="positive()"
        [maxDropdownHeight]="maxDropdownHeight()"
        (countryChange)="onCountryChange($event)"
      />
      <bui-input
        class="bui-phone__input"
        type="tel"
        inputMode="tel"
        [value]="text()"
        [size]="size()"
        [disabled]="disabled()"
        [error]="error()"
        [positive]="positive()"
        [placeholder]="placeholder()"
        [clearable]="clearable()"
        [ariaLabel]="ariaLabel()"
        (valueChange)="textChange.emit($event)"
      >
        <span buiInputBefore class="bui-phone__dialcode">{{ country().dialCode }}</span>
      </bui-input>
    </div>
  `,
})
export class BuiPhoneInputLite {
  readonly country = input<Country>({ label: 'United States', id: 'US', dialCode: '+1' });
  readonly countries = input<CountriesMap>(COUNTRIES as unknown as CountriesMap);
  readonly text = input('');
  readonly size = input<SelectSize>('default');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly positive = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly placeholder = input('');
  readonly ariaLabel = input('Please enter a phone number without the country dial code.');
  readonly maxDropdownHeight = input('400px');
  readonly dir = input('');

  readonly countryChange = output<Country>();
  readonly textChange = output<string>();

  protected onCountryChange(c: Country): void { this.countryChange.emit(c); }
}

/**
 * BuiPhoneInput — clone de `PhoneInput`. Usa `BuiPhoneInputLite` com COUNTRIES completo.
 */
@Component({
  selector: 'bui-phone-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPhoneInputLite],
  template: `
    <bui-phone-input-lite
      [country]="country()"
      [text]="text()"
      [size]="size()"
      [disabled]="disabled()"
      [error]="error()"
      [positive]="positive()"
      [clearable]="clearable()"
      [placeholder]="placeholder()"
      [ariaLabel]="ariaLabel()"
      [maxDropdownHeight]="maxDropdownHeight()"
      [dir]="dir()"
      (countryChange)="countryChange.emit($event)"
      (textChange)="textChange.emit($event)"
    />
  `,
})
export class BuiPhoneInput {
  readonly country = input<Country>({ label: 'United States', id: 'US', dialCode: '+1' });
  readonly text = input('');
  readonly size = input<SelectSize>('default');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly positive = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly placeholder = input('');
  readonly ariaLabel = input('Please enter a phone number without the country dial code.');
  readonly maxDropdownHeight = input('400px');
  readonly dir = input('');

  readonly countryChange = output<Country>();
  readonly textChange = output<string>();
}

/**
 * BuiStatefulPhoneInput — gerencia estado internamente (country + text).
 */
@Component({
  selector: 'bui-stateful-phone-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiPhoneInput],
  template: `
    <bui-phone-input
      [country]="country()"
      [text]="text()"
      [size]="size()"
      [disabled]="disabled()"
      [error]="error()"
      [positive]="positive()"
      [clearable]="clearable()"
      [placeholder]="placeholder()"
      [ariaLabel]="ariaLabel()"
      [maxDropdownHeight]="maxDropdownHeight()"
      [dir]="dir()"
      (countryChange)="onCountryChange($event)"
      (textChange)="text.set($event)"
    />
  `,
})
export class BuiStatefulPhoneInput {
  readonly size = input<SelectSize>('default');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly positive = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly placeholder = input('');
  readonly ariaLabel = input('Please enter a phone number without the country dial code.');
  readonly maxDropdownHeight = input('400px');
  readonly dir = input('');

  readonly onCountryChangeEmit = output<Country>({ alias: 'onCountryChange' });
  readonly onTextChangeEmit = output<string>({ alias: 'onTextChange' });

  protected readonly country = signal<Country>({ label: 'United States', id: 'US', dialCode: '+1' });
  protected readonly text = signal('');

  protected onCountryChange(c: Country): void {
    this.country.set(c);
    this.onCountryChangeEmit.emit(c);
  }
}
