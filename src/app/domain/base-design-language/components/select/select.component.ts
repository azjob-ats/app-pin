import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface Option { id: string; label: string; }

/** Select — fiel ao baseui/select (controle + dropdown de opções). CVA. */
@Component({
  selector: 'bui-select',
  exportAs: 'buiSelect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button type="button" class="bui-select__control" [attr.data-open]="open() ? '' : null" [disabled]="disabled()" (click)="toggle()">
      <span class="bui-select__value" [class.bui-select__value--ph]="!selected()">{{ selected()?.label || placeholder() }}</span>
      <svg class="bui-select__arrow" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12.7071 15.2929L17.1464 10.8536C17.4614 10.5386 17.2383 10 16.7929 10L7.20711 10C6.76165 10 6.53857 10.5386 6.85355 10.8536L11.2929 15.2929C11.6834 15.6834 12.3166 15.6834 12.7071 15.2929Z" fill="currentColor" />
      </svg>
    </button>
    @if (open()) {
      <div class="bui-select__scrim" (click)="open.set(false)"></div>
      <ul class="bui-select__menu" role="listbox">
        @for (o of options(); track o.id) {
          <li class="bui-select__opt" role="option" [class.bui-select__opt--sel]="o.id === value()" (click)="pick(o)">{{ o.label }}</li>
        }
      </ul>
    }
  `,
  styleUrl: './select.component.scss',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Select), multi: true }],
  host: { class: 'bui-select-host', '[class]': 'hostClasses()' },
})
export class Select implements ControlValueAccessor {
  readonly options = input<Option[]>([]);
  readonly placeholder = input<string>('Select…');
  readonly disabled = input(false);
  readonly size = input<'mini' | 'compact' | 'default' | 'large'>('default');
  readonly error = input(false);
  readonly positive = input(false);

  protected readonly hostClasses = computed(() =>
    ['bui-select-host', `bui-select--${this.size()}`, this.error() ? 'bui-select--error' : '', this.positive() ? 'bui-select--positive' : '']
      .filter(Boolean).join(' '),
  );

  readonly value = signal<string>('');
  protected readonly open = signal(false);
  protected readonly selected = computed(() => this.options().find((o) => o.id === this.value()));

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(v: string | null): void { this.value.set(v ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(): void { /* via input */ }

  protected toggle(): void { this.open.update((v) => !v); }
  protected pick(o: Option): void { this.value.set(o.id); this.onChange(o.id); this.onTouched(); this.open.set(false); }
}

@Component({
  selector: 'bui-s-select', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Select],
  template: `
    <bui-select [options]="opts" placeholder="Select a color" />
    <br />
    <bui-select [options]="opts" placeholder="Select a color" [disabled]="true" />
  `,
})
export class SelectScenario {
  protected readonly opts = OPTS;
}

const OPTS: Option[] = [
  { id: 'AliceBlue', label: 'AliceBlue' }, { id: 'AntiqueWhite', label: 'AntiqueWhite' },
  { id: 'Aqua', label: 'Aqua' }, { id: 'Aquamarine', label: 'Aquamarine' },
  { id: 'Azure', label: 'Azure' }, { id: 'Beige', label: 'Beige' },
];

// select-sizes.scenario.tsx — mini/compact/default/large.
@Component({
  selector: 'bui-s-select-sizes', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Select],
  template: `
    <bui-select [options]="opts" placeholder="Select a color" size="mini" /><br />
    <bui-select [options]="opts" placeholder="Select a color" size="compact" /><br />
    <bui-select [options]="opts" placeholder="Select a color" size="default" /><br />
    <bui-select [options]="opts" placeholder="Select a color" size="large" />
  `,
})
export class SelectSizesScenario { protected readonly opts = OPTS; }

// select-states.scenario.tsx — default / disabled / error / positive.
@Component({
  selector: 'bui-s-select-states', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Select],
  template: `
    <bui-select [options]="opts" placeholder="Select a color" /><br />
    <bui-select [options]="opts" placeholder="Select a color" [disabled]="true" /><br />
    <bui-select [options]="opts" placeholder="Select a color" [error]="true" /><br />
    <bui-select [options]="opts" placeholder="Select a color" [positive]="true" />
  `,
})
export class SelectStatesScenario { protected readonly opts = OPTS; }
