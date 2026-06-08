import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  input,
  numberAttribute,
  signal,
  viewChild,
} from '@angular/core';

export type PbSize = 'small' | 'medium' | 'large';
export type PbIntent = 'default' | 'positive' | 'warning' | 'negative' | 'brand';

/** Cor do progresso por intent (espelha getProgressColor). Sem intent → backgroundAccent. */
const INTENT_COLOR: Record<PbIntent, string> = {
  default: 'var(--bw-content-accent)',
  positive: 'var(--bw-content-positive)',
  warning: 'var(--bw-content-warning)',
  negative: 'var(--bw-content-negative)',
  brand: 'var(--bw-blue-600)', // brandBorderAccessible = brandDefault600 = #276EF1
};

/**
 * ProgressBar (linear) — clone fiel do `baseui/progress-bar`. Barra determinada
 * (`value`), segmentada (`steps>1`) ou indeterminada (`infinite`). `size` controla a
 * espessura (2/4/8px), `intent` a cor, `showLabel` exibe o rótulo. Cor do progresso
 * sobrescrevível via `--bui-pb-progress` (usado na story negative).
 */
@Component({
  selector: 'bui-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './progress-bar.component.scss',
  template: `
    <div class="bui-pb__container">
      @if (infinite()) {
        <div class="bui-pb__infinite bui-pb__infinite--left"></div>
        <div class="bui-pb__infinite bui-pb__infinite--right"></div>
      } @else {
        @for (i of stepsArray(); track $index) {
          <div class="bui-pb__bar">
            <div class="bui-pb__progress" [style.transform]="progressTransform($index)" [class.bui-pb__progress--inprogress]="stepState($index) === 'inProgress'"></div>
          </div>
        }
      }
    </div>
    @if (showLabel()) {
      <div class="bui-pb__label">{{ label() }}</div>
    }
  `,
  host: {
    'data-baseweb': 'progress-bar',
    role: 'progressbar',
    class: 'bui-pb',
    'aria-live': 'polite',
    '[class]': '"bui-pb--" + size()',
    '[attr.aria-label]': 'ariaLabelResolved()',
    '[attr.aria-valuenow]': 'infinite() ? null : value()',
    '[attr.aria-valuemin]': 'infinite() ? null : minValue()',
    '[attr.aria-valuemax]': 'infinite() ? null : maxClamped()',
    '[attr.aria-busy]': 'infinite() ? true : null',
    '[style.--bui-pb-intent]': 'intentColor()',
  },
})
export class ProgressBar {
  readonly value = input(0, { transform: numberAttribute });
  readonly size = input<PbSize>('medium');
  readonly steps = input(1, { transform: numberAttribute });
  readonly successValue = input(100, { transform: numberAttribute });
  readonly minValue = input(0, { transform: numberAttribute });
  readonly maxValue = input(100, { transform: numberAttribute });
  readonly showLabel = input(false, { transform: booleanAttribute });
  readonly infinite = input(false, { transform: booleanAttribute });
  readonly intent = input<PbIntent>();
  readonly ariaLabel = input<string>();

  /** maxValue só vale se o usuário mudou de 100; senão usa successValue. */
  protected readonly maxClamped = computed(() => (this.maxValue() !== 100 ? this.maxValue() : this.successValue()));
  protected readonly intentColor = computed(() => (this.intent() ? INTENT_COLOR[this.intent()!] : 'var(--bw-background-accent)'));
  protected readonly stepsArray = computed(() => Array(this.steps()).fill(undefined));

  private readonly pct = computed(() => {
    const max = this.maxClamped();
    return ((this.value() - this.minValue()) * 100) / (max - this.minValue());
  });

  protected readonly label = computed(() => {
    const v = this.value();
    const max = this.maxClamped();
    const min = this.minValue();
    return `${Math.round(((v - min) / (max - min)) * 100)}% Complete`;
  });

  protected readonly ariaLabelResolved = computed(() => {
    if (this.ariaLabel() || this.infinite()) return 'Loading';
    if (this.steps() > 1) return `Step ${Math.ceil(((this.value() - this.minValue()) / (this.maxClamped() - this.minValue())) * this.steps())} of ${this.steps()}`;
    return this.label();
  });

  /** Estado do passo `i` (default/awaits/inProgress/completed). */
  protected stepState(i: number): string {
    if (this.steps() <= 1) return 'default';
    const stepValue = 100 / this.steps();
    const completedSteps = Math.floor(this.pct() / stepValue);
    if (i < completedSteps) return 'completed';
    if (i === completedSteps) return 'inProgress';
    return 'awaits';
  }

  /** transform translateX da barra de progresso `i`. */
  protected progressTransform(i: number): string {
    if (this.steps() <= 1) return `translateX(-${100 - this.pct()}%)`;
    const s = this.stepState(i);
    if (s === 'completed') return 'translateX(0%)';
    if (s === 'inProgress') return 'translateX(0%)'; // animação assume (keyframes)
    return 'translateX(-102%)';
  }
}

/** Geometria por tamanho do ProgressBarRounded (paths/medidas do original). */
const ROUNDED = {
  small: { d: 'M32 1H51.6271C57.9082 1 63 6.37258 63 13C63 19.6274 57.9082 25 51.6271 25H12.3729C6.09181 25 1 19.6274 1 13C1 6.37258 6.09181 1 12.3729 1H32.0195', width: 64, height: 26, strokeWidth: 2, font: 'LabelSmall' },
  medium: { d: 'M39 2H60.5833C69.0977 2 76 9.16344 76 18C76 26.8366 69.0977 34 60.5833 34H17.4167C8.90228 34 2 26.8366 2 18C2 9.16344 8.90228 2 17.4167 2H39.0195', width: 78, height: 36, strokeWidth: 4, font: 'LabelMedium' },
  large: { d: 'M47.5 4H71.5529C82.2933 4 91 12.9543 91 24C91 35.0457 82.2933 44 71.5529 44H23.4471C12.7067 44 4 35.0457 4 24C4 12.9543 12.7067 4 23.4471 4H47.5195', width: 95, height: 48, strokeWidth: 8, font: 'LabelLarge' },
} as const;

/**
 * ProgressBarRounded — clone fiel do `ProgressBarRounded`. Anel "pílula" em SVG: trilho
 * de fundo (`backgroundTertiary`) + trilho de progresso (`borderAccent`) desenhado via
 * `stroke-dasharray`/`stroke-dashoffset` a partir de `getTotalLength()`. `progress` 0–1,
 * `size` define o path/medidas, `animate` faz a transição via requestAnimationFrame.
 */
@Component({
  selector: 'bui-progress-bar-rounded',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './progress-bar.component.scss',
  template: `
    <svg class="bui-pbr__svg" [attr.viewBox]="'0 0 ' + geo().width + ' ' + geo().height" xmlns="http://www.w3.org/2000/svg">
      <path class="bui-pbr__track" [attr.d]="geo().d" [style.stroke-width.px]="geo().strokeWidth" />
      <path
        #fg
        class="bui-pbr__fg"
        [attr.d]="geo().d"
        [style.stroke-width.px]="geo().strokeWidth"
        [style.visibility]="visible() ? 'visible' : 'hidden'"
        [style.stroke-dasharray]="pathLength()"
        [style.stroke-dashoffset]="pathLength() * (1 - pathProgress())"
      />
    </svg>
    <div class="bui-pbr__text">{{ percentage() }}</div>
  `,
  host: {
    'data-baseweb': 'progressbar-rounded',
    role: 'progressbar',
    class: 'bui-pbr',
    'aria-live': 'polite',
    'aria-valuemin': '0',
    'aria-valuemax': '1',
    '[class]': '"bui-pbr--" + size() + (inline() ? " bui-pbr--inline" : "")',
    '[attr.aria-label]': 'ariaLabelResolved()',
    '[attr.aria-valuenow]': 'progress()',
    '[style.--bui-pbr-w-def]': 'geo().width + "px"',
    '[style.--bui-pbr-h-def]': 'geo().height + "px"',
  },
})
export class ProgressBarRounded {
  readonly progress = input(0, { transform: numberAttribute });
  readonly size = input<PbSize>('medium');
  readonly animate = input(true, { transform: booleanAttribute });
  readonly inline = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();

  private readonly fg = viewChild.required<ElementRef<SVGPathElement>>('fg');
  protected readonly pathLength = signal(0);
  protected readonly pathProgress = signal(0);
  protected readonly visible = signal(false);

  protected readonly geo = computed(() => ROUNDED[this.size()]);
  protected readonly percentage = computed(() => `${roundTo(Math.min(this.progress() * 100, 100))}%`);
  protected readonly ariaLabelResolved = computed(() => this.ariaLabel() || `${this.percentage()} complete`);

  private rafId = 0;

  constructor() {
    afterNextRender(() => {
      const el = this.fg().nativeElement;
      if (el.getTotalLength) this.pathLength.set(el.getTotalLength());
      this.visible.set(true);
    });
    // Anima pathProgress em direção a progress (ou snap se animate=false).
    effect(() => {
      const target = this.progress();
      if (!this.animate()) {
        this.pathProgress.set(target);
        return;
      }
      this.animateTo(target);
    });
  }

  private animateTo(target: number): void {
    cancelAnimationFrame(this.rafId);
    const start = this.pathProgress();
    const duration = Math.max(1000 * (target - start), 250);
    let t0: number | undefined;
    const loop = (now: number) => {
      t0 ??= now;
      const elapsed = now - t0;
      let cur = Math.min((target - start) * (elapsed / duration) + start, 1);
      cur = Math.max(cur, 0);
      this.pathProgress.set(cur);
      if (elapsed <= duration) this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }
}

/** Arredonda para `digits` casas (espelha roundTo do original). */
function roundTo(n: number, digits = 0): number {
  const m = Math.pow(10, digits);
  return +(Math.round(parseFloat((n * m).toFixed(11))) / m).toFixed(digits);
}
