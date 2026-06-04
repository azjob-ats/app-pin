import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

let radioName = 0;

/** RadioGroup — fiel ao baseui/radio (CVA, ALIGN vertical/horizontal). */
@Component({
  selector: 'bui-radio-group',
  exportAs: 'buiRadioGroup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  styles: `
    bui-radio-group { display:flex; gap:var(--bw-sizing-scale400); }
    bui-radio-group[data-align="vertical"] { flex-direction:column; }
    bui-radio-group[data-align="horizontal"] { flex-direction:row; flex-wrap:wrap; gap:var(--bw-sizing-scale700); }
  `,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RadioGroup), multi: true }],
  host: { role: 'radiogroup', '[attr.data-align]': 'align()' },
})
export class RadioGroup implements ControlValueAccessor {
  readonly align = input<'vertical' | 'horizontal'>('vertical');
  readonly name = `bui-radio-${radioName++}`;
  readonly value = signal<unknown>(null);
  readonly disabled = signal(false);

  private onChange: (v: unknown) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(v: unknown): void { this.value.set(v); }
  registerOnChange(fn: (v: unknown) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled.set(d); }
  select(v: unknown): void { this.value.set(v); this.onChange(v); this.onTouched(); }
}

/** Radio — opção; círculo 20px, borda 3px (tick*), ponto interno quando selecionado. */
@Component({
  selector: 'bui-radio',
  exportAs: 'buiRadio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <label class="bui-radio" [attr.data-disabled]="isDisabled() ? '' : null">
      <input type="radio" class="bui-radio__input" [name]="group.name" [checked]="checked()" [disabled]="isDisabled()" (change)="group.select(value())" />
      <span class="bui-radio__outer" aria-hidden="true"><span class="bui-radio__inner"></span></span>
      <span class="bui-radio__label"><ng-content /></span>
    </label>
  `,
  styleUrl: './radio.component.scss',
})
export class Radio {
  readonly value = input.required<unknown>();
  readonly disabled = input(false);
  protected readonly group = inject(RadioGroup);
  protected readonly checked = computed(() => this.group.value() === this.value());
  protected readonly isDisabled = computed(() => this.disabled() || this.group.disabled());
}

@Component({
  selector: 'bui-s-radio', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [RadioGroup, Radio, FormsModule],
  template: `<div style="display:flex; flex-direction:column; gap:24px;">
    <bui-radio-group [ngModel]="'a'">
      <bui-radio value="a">First</bui-radio>
      <bui-radio value="b">Second</bui-radio>
      <bui-radio value="c">Third</bui-radio>
      <bui-radio value="d" [disabled]="true">Disabled</bui-radio>
    </bui-radio-group>
    <bui-radio-group [ngModel]="'x'" align="horizontal">
      <bui-radio value="x">One</bui-radio>
      <bui-radio value="y">Two</bui-radio>
    </bui-radio-group>
  </div>`,
})
export class RadioScenario {}
