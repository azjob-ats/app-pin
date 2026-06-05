import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';

/** Tamanhos nomeados (Base Web SIZE). */
export type SpinnerSize = 'small' | 'medium' | 'large';

const NAMED_BOX: Record<string, string> = { small: '24px', medium: '32px', large: '40px' };
const NAMED_BORDER: Record<string, string> = { small: '2px', medium: '4px', large: '8px' };
const isSizingToken = (v: string): boolean => /^scale\d+$/.test(v);

/** Resolve a dimensão da caixa: nome→token; sizing-token→var; número→px; px-string→literal. */
function resolveBox(size: SpinnerSize | string | number): string {
  if (typeof size === 'number') return `${size}px`;
  if (size in NAMED_BOX) return NAMED_BOX[size];
  if (isSizingToken(size)) return `var(--bw-sizing-${size})`;
  return size;
}

/**
 * Resolve a espessura da borda a partir de `borderWidth ?? size`.
 * Quando a chave é uma px-string (ex.: `'20px'` herdada do size), o Base Web devolve
 * `undefined` → o browser cai no `border-width: medium` (= **3px**). Reproduzimos isso
 * retornando `null` (binding removido → default do UA).
 */
function resolveBorder(borderWidth: string | number | undefined, size: SpinnerSize | string | number): string | null {
  const key = borderWidth ?? size;
  if (typeof key === 'number') return `${key}px`;
  if (key in NAMED_BORDER) return NAMED_BORDER[key];
  if (isSizingToken(key)) return `var(--bw-sizing-${key})`;
  return null;
}

/**
 * Spinner — clone fiel do `baseui/spinner`. Indicador circular animado
 * (`<i role="progressbar">`): borda superior na cor de destaque, demais em
 * `backgroundTertiary`, girando 360° em 1s linear. Estilo via tokens `--bw-*`.
 */
@Component({
  selector: 'bui-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '',
  styleUrl: './spinner.component.scss',
  host: {
    class: 'bui-spinner',
    role: 'progressbar',
    'aria-label': 'loading',
    'aria-busy': 'true',
    '[style.width]': 'box()',
    '[style.height]': 'box()',
    '[style.border-top-width]': 'border()',
    '[style.border-right-width]': 'border()',
    '[style.border-bottom-width]': 'border()',
    '[style.border-left-width]': 'border()',
    '[style.border-top-color]': 'color()',
  },
})
export class Spinner {
  /** Altura/largura da caixa (nome `small|medium|large`, sizing-token, número px ou string). */
  readonly size = input<SpinnerSize | string | number>('medium');
  /** Espessura do traço. Default: derivado do `size`. */
  readonly borderWidth = input<string | number | undefined>(undefined);
  /** Cor do indicador (borda superior). Default: `contentAccent`. */
  readonly color = input<string>('var(--bw-content-accent)');

  protected readonly box = computed(() => resolveBox(this.size()));
  protected readonly border = computed(() => resolveBorder(this.borderWidth(), this.size()));
}
