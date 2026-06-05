import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, linkedSignal } from '@angular/core';

/** Gera as iniciais a partir do nome (1ª letra das 2 primeiras palavras, maiúsculas). */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Avatar — clone fiel do `baseui/avatar`. Mostra a imagem (círculo) quando ela carrega;
 * em falha/ausência de `src`, exibe as iniciais sobre fundo `backgroundInversePrimary`.
 * `size` aceita label de `theme.sizing` (`scale*`) ou valor CSS direto. Estilo via tokens.
 */
@Component({
  selector: 'bui-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './avatar.component.scss',
  template: `
    <img
      class="bui-avatar__img"
      [class.bui-avatar__img--loaded]="imageLoaded()"
      [attr.alt]="name()"
      [attr.src]="src() || null"
      [style.width]="dim()"
      [style.height]="dim()"
      (load)="imageLoaded.set(true)"
      (error)="imageLoaded.set(false)"
    />
    @if (!imageLoaded()) {
      <div class="bui-avatar__initials">{{ displayInitials() }}</div>
    }
  `,
  host: {
    'data-baseweb': 'avatar',
    class: 'bui-avatar',
    '[attr.role]': 'imageLoaded() ? null : "img"',
    '[attr.aria-label]': 'imageLoaded() ? null : name()',
    '[style.background-color]': 'imageLoaded() ? null : "var(--bw-background-inverse-primary)"',
    '[style.width]': 'imageLoaded() ? null : dim()',
    '[style.height]': 'imageLoaded() ? null : dim()',
  },
})
export class Avatar {
  /** Texto alternativo da imagem; base para as iniciais quando não há `initials`. */
  readonly name = input('');
  /** Sobrescreve a geração de iniciais a partir do `name`. */
  readonly initials = input<string>();
  /** Largura/altura: label `theme.sizing` (`scale*`) ou valor CSS. Default `scale1000`. */
  readonly size = input<string>('scale1000');
  /** Imagem a exibir. */
  readonly src = input<string>();

  /** Reinicia em `false` sempre que `src` muda; o evento `load` o promove a `true`. */
  protected readonly imageLoaded = linkedSignal<string | undefined, boolean>({
    source: () => this.src(),
    computation: () => false,
  });

  protected readonly dim = computed(() => {
    const s = this.size();
    return /^scale\d+$/.test(s) ? `var(--bw-sizing-${s})` : s;
  });
  protected readonly displayInitials = computed(() => this.initials() || getInitials(this.name()));
}
