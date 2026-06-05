import { ChangeDetectionStrategy, Component, Directive, ElementRef, computed, inject, input } from '@angular/core';

/**
 * Margens de bloco padrão do user-agent (em `em`, relativas ao font-size próprio).
 * O Base Web não reseta margens — h1–h6/p carregam as do browser. O app-pin tem um
 * reset universal (`* { margin: 0 }`), então restauramos esses valores aqui para
 * fidelidade pixel-a-pixel (mesma métrica do original: ex. h1 0.67em·40px = 26.8px).
 */
const UA_BLOCK_MARGIN: Record<string, string> = {
  h1: '0.67em', h2: '0.83em', h3: '1em', h4: '1.33em', h5: '1.67em', h6: '2.33em', p: '1em',
};

/**
 * Escalas de tipografia do Base Web (espelham `themes/shared/typography.ts`).
 * Cada nome resolve a um token `--bw-font-<Escala>` (shorthand `font:`).
 */
export type BwTypoScale =
  | 'DisplayLarge' | 'DisplayMedium' | 'DisplaySmall' | 'DisplayXSmall'
  | 'HeadingXXLarge' | 'HeadingXLarge' | 'HeadingLarge' | 'HeadingMedium' | 'HeadingSmall' | 'HeadingXSmall'
  | 'LabelLarge' | 'LabelMedium' | 'LabelSmall' | 'LabelXSmall'
  | 'ParagraphLarge' | 'ParagraphMedium' | 'ParagraphSmall' | 'ParagraphXSmall'
  | 'MonoDisplayLarge' | 'MonoDisplayMedium' | 'MonoDisplaySmall' | 'MonoDisplayXSmall'
  | 'MonoHeadingXXLarge' | 'MonoHeadingXLarge' | 'MonoHeadingLarge' | 'MonoHeadingMedium' | 'MonoHeadingSmall' | 'MonoHeadingXSmall'
  | 'MonoLabelLarge' | 'MonoLabelMedium' | 'MonoLabelSmall' | 'MonoLabelXSmall'
  | 'MonoParagraphLarge' | 'MonoParagraphMedium' | 'MonoParagraphSmall' | 'MonoParagraphXSmall';

/**
 * Diretiva de tipografia — clone do `Block` tipográfico do Base Web.
 * Aplica em tags semânticas nativas (p, h1–h6, div, span). Define `font` via token,
 * cor `contentPrimary` por padrão e o atributo `data-baseweb="typo-<escala>"`
 * (mesma assinatura do original, usada nas comparações de fidelidade).
 *
 * Uso: `<p buiTypo="ParagraphMedium">…</p>`
 */
@Directive({
  selector: '[buiTypo]',
  host: {
    '[style.font]': 'fontVar()',
    '[style.color]': 'colorVar()',
    '[style.margin-block]': 'uaMargin',
    '[attr.data-baseweb]': 'dataBaseweb()',
  },
})
export class BwTypography {
  private readonly tag = (inject(ElementRef).nativeElement as HTMLElement).tagName.toLowerCase();

  /** Escala tipográfica (ex.: `ParagraphMedium`, `DisplayLarge`, `MonoLabelSmall`). */
  readonly buiTypo = input.required<BwTypoScale>();
  /** Token de cor do conteúdo (default: contentPrimary). */
  readonly color = input<string>('content-primary');
  /** Override de cor crua (CSS), espelha `$style={{ color }}` do Base Web. Tem precedência. */
  readonly colorOverride = input<string | undefined>(undefined);

  protected readonly fontVar = computed(() => `var(--bw-font-${this.buiTypo()})`);
  protected readonly colorVar = computed(() => this.colorOverride() ?? `var(--bw-${this.color()})`);
  protected readonly dataBaseweb = computed(() => `typo-${this.buiTypo().toLowerCase()}`);
  /** Restaura a margem de bloco do UA (h1–h6/p); demais tags ficam sem margem. */
  protected readonly uaMargin = UA_BLOCK_MARGIN[this.tag] ?? null;
}

/**
 * Página/preview do componente Typography no Ladle — lista de exemplos vivos
 * espelhando o que o baseweb.design exibe (não é story; só conveniência de catálogo).
 */
@Component({
  selector: 'bui-s-typography',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BwTypography],
  template: `
    <div style="display:flex;flex-direction:column;gap:8px">
      <div buiTypo="DisplayLarge">Display Large</div>
      <div buiTypo="HeadingMedium">Heading Medium</div>
      <p buiTypo="ParagraphMedium">Paragraph Medium</p>
      <div buiTypo="LabelMedium">Label Medium</div>
      <div buiTypo="MonoParagraphMedium">Mono Paragraph Medium</div>
    </div>
  `,
})
export class TypographyScenario {}
