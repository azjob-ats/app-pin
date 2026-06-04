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

/** Slider — fiel ao baseui/slider (track + porção preenchida + thumb). CVA numérico (valor único). */
@Component({
  selector: 'bui-slider',
  exportAs: 'buiSlider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-slider">
      <input
        class="bui-slider__range"
        type="range"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [value]="value()"
        [disabled]="disabled()"
        [style.--bui-pct.%]="pct()"
        (input)="onInput($event)"
      />
      <span class="bui-slider__value">{{ value() }}</span>
    </div>
  `,
  styleUrl: './slider.component.scss',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Slider), multi: true }],
})
export class Slider implements ControlValueAccessor {
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly step = input<number>(1);
  readonly disabled = input(false);

  protected readonly value = signal(0);
  protected readonly pct = computed(() => {
    const range = this.max() - this.min() || 1;
    return ((this.value() - this.min()) / range) * 100;
  });

  private onChange: (v: number) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(v: number | null): void { this.value.set(v ?? this.min()); }
  registerOnChange(fn: (v: number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(): void { /* via input */ }
  protected onInput(e: Event): void {
    const v = Number((e.target as HTMLInputElement).value);
    this.value.set(v); this.onChange(v); this.onTouched();
  }
}

@Component({
  selector: 'bui-s-slider', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Slider],
  template: `<div style="display:flex; flex-direction:column; gap:24px; width:320px;">
    <bui-slider /><bui-slider [disabled]="true" />
  </div>`,
})
export class SliderScenario {}
