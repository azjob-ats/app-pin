import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  numberAttribute,
} from '@angular/core';

/**
 * Skeleton — clone fiel do `baseui/skeleton`. Placeholder de carregamento.
 * Sem `rows` (ou `rows=0`): o próprio host é o bloco (cor `backgroundTertiary` ou shimmer
 * animado). Com `rows>0`: host vira flex-column e renderiza N linhas (flex-basis 15px,
 * gap 10px). `animation` liga o gradiente shimmer; `autoSizeRows` faz as linhas crescerem.
 * `height`/`width` aplicam-se ao container. Estilo extra (raio, margem) via `style` no host.
 */
@Component({
  selector: 'bui-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './skeleton.component.scss',
  template: `
    @for (r of rowArray(); track $index; let last = $last) {
      <div
        class="bui-skeleton__row"
        [class.bui-skeleton--anim]="animation()"
        [class.bui-skeleton--solid]="!animation()"
        [style.flex-grow]="autoSizeRows() ? 1 : 0"
        [style.margin-bottom]="last ? '0px' : '10px'"
      ></div>
    }
  `,
  host: {
    class: 'bui-skeleton',
    testid: 'loader',
    '[class.bui-skeleton--col]': 'rows() > 0',
    '[class.bui-skeleton--anim]': 'rows() === 0 && animation()',
    '[class.bui-skeleton--solid]': 'rows() === 0 && !animation()',
    '[style.height]': 'height()',
    '[style.width]': 'width()',
  },
})
export class Skeleton {
  /** Nº de linhas. `0` (default) = bloco único no próprio host. */
  readonly rows = input(0, { transform: numberAttribute });
  /** Liga o shimmer animado (default `false`). */
  readonly animation = input(false, { transform: booleanAttribute });
  /** Altura do container (CSS). */
  readonly height = input<string>();
  /** Largura do container (CSS). */
  readonly width = input<string>();
  /** Linhas crescem para preencher a altura (flex-grow). */
  readonly autoSizeRows = input(false, { transform: booleanAttribute });

  protected readonly rowArray = computed(() => Array(this.rows()).fill(undefined));
}
