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

@Component({
  selector: 'bui-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './slider.component.scss',
  template: `
    <div class="bui-slider__root" data-baseweb="slider">
      <div
        class="bui-slider__track"
        [class.bui-slider__track--disabled]="disabled()"
      >
        <div
          class="bui-slider__inner-track"
          [style.background]="trackGradient()"
        >
          <!-- marks -->
          @if (marks() && step() > 1) {
            @for (mark of markPositions(); track $index) {
              <div
                class="bui-slider__mark"
                [style.left.%]="mark"
              ></div>
            }
          }
        </div>

        <!-- thumb(s) -->
        @for (v of value(); track $index; let i = $index) {
          @if (persistentThumb() || focusedThumb() === i || hoveredThumb() === i) {
            <div
              class="bui-slider__thumb-value"
              [class.bui-slider__thumb-value--disabled]="disabled()"
              [style.left.%]="thumbPercent(i)"
              [style.transform]="'translateX(-50%)'"
            >
              {{ valueToLabel()(v) }}
            </div>
          }
          <div
            class="bui-slider__thumb"
            [class.bui-slider__thumb--focused]="focusedThumb() === i"
            [class.bui-slider__thumb--disabled]="disabled()"
            [style.left.%]="thumbPercent(i)"
          >
            <div class="bui-slider__inner-thumb"></div>
          </div>
        }

        <!-- Native range inputs (accessibility + interaction) -->
        @for (v of value(); track $index; let i = $index) {
          <input
            type="range"
            class="bui-slider__native-input"
            [min]="min()"
            [max]="max()"
            [step]="step()"
            [value]="v"
            [disabled]="disabled()"
            [attr.aria-label]="ariaLabel() || ('Value ' + (i + 1))"
            [attr.aria-valuemin]="min()"
            [attr.aria-valuemax]="max()"
            [attr.aria-valuenow]="v"
            [attr.aria-valuetext]="valueToLabel()(v)"
            [style.z-index]="value().length === 2 ? (i === 0 && v >= (min() + max()) / 2 ? 5 : 4) : null"
            (input)="onInput($event, i)"
            (focus)="focusedThumb.set(i)"
            (blur)="focusedThumb.set(-1)"
            (mouseenter)="hoveredThumb.set(i)"
            (mouseleave)="hoveredThumb.set(-1)"
          />
        }
      </div>

      <!-- Tick bar: min and max labels -->
      @if (marks()) {
        <div class="bui-slider__tick-bar">
          <span class="bui-slider__tick">{{ valueToLabel()(min()) }}</span>
          <span class="bui-slider__tick">{{ valueToLabel()(max()) }}</span>
        </div>
      }
    </div>
  `,
})
export class BuiSlider {
  readonly value = input.required<number[]>();
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly marks = input(false, { transform: booleanAttribute });
  readonly persistentThumb = input(false, { transform: booleanAttribute });
  readonly valueToLabel = input<(v: number) => string | number>((v) => v);
  readonly ariaLabel = input<string>('');

  readonly sliderChange = output<{ value: number[] }>();
  readonly sliderFinalChange = output<{ value: number[] }>();

  protected readonly focusedThumb = signal(-1);
  protected readonly hoveredThumb = signal(-1);

  protected readonly thumbPercent = (index: number): number => {
    const v = this.value()[index] ?? this.min();
    return ((v - this.min()) / (this.max() - this.min())) * 100;
  };

  protected readonly trackGradient = computed(() => {
    const vs = this.value();
    const min = this.min();
    const max = this.max();
    const range = max - min;
    const disabled = this.disabled();

    // In baseweb light theme:
    //   filled  = contentPrimary (#000) or backgroundStateDisabled (#f3f3f3) when disabled
    //   unfilled = borderOpaque  (#f3f3f3) or backgroundStateDisabled (#f3f3f3) when disabled
    const filled = disabled
      ? 'var(--bw-background-state-disabled)'
      : 'var(--bw-content-primary)';
    const unfilled = disabled
      ? 'var(--bw-background-state-disabled)'
      : 'var(--bw-border-opaque)';

    if (vs.length === 1) {
      const pct = ((vs[0] - min) / range) * 100;
      return `linear-gradient(to right, ${filled} 0%, ${filled} ${pct}%, ${unfilled} ${pct}%, ${unfilled} 100%)`;
    } else {
      const pct0 = ((vs[0] - min) / range) * 100;
      const pct1 = ((vs[1] - min) / range) * 100;
      return `linear-gradient(to right, ${unfilled} 0%, ${unfilled} ${pct0}%, ${filled} ${pct0}%, ${filled} ${pct1}%, ${unfilled} ${pct1}%, ${unfilled} 100%)`;
    }
  });

  protected readonly markPositions = computed((): number[] => {
    const positions: number[] = [];
    const min = this.min();
    const max = this.max();
    const step = this.step();
    const range = max - min;
    for (let v = min; v <= max; v += step) {
      positions.push(((v - min) / range) * 100);
    }
    return positions;
  });

  protected onInput(e: Event, index: number): void {
    const input = e.target as HTMLInputElement;
    const newValue = Number(input.value);
    const currentValues = [...this.value()];

    if (this.value().length === 2) {
      if (index === 0 && newValue > currentValues[1]) return;
      if (index === 1 && newValue < currentValues[0]) return;
    }

    currentValues[index] = newValue;
    this.sliderChange.emit({ value: currentValues });
  }
}

// BuiStatefulSlider
@Component({
  selector: 'bui-stateful-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiSlider],
  template: `
    <bui-slider
      [value]="values()"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [disabled]="disabled()"
      [marks]="marks()"
      [persistentThumb]="persistentThumb()"
      [valueToLabel]="valueToLabel()"
      [ariaLabel]="ariaLabel()"
      (sliderChange)="values.set($event.value)"
    />
  `,
})
export class BuiStatefulSlider {
  readonly initialState = input<{ value: number[] }>({ value: [0] });
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly marks = input(false, { transform: booleanAttribute });
  readonly persistentThumb = input(false, { transform: booleanAttribute });
  readonly valueToLabel = input<(v: number) => string | number>((v) => v);
  readonly ariaLabel = input<string>('');

  readonly values = signal([0]);

  ngOnInit(): void {
    this.values.set(this.initialState().value);
  }
}
