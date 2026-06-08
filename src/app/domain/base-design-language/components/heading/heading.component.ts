import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  Optional,
  SkipSelf,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';

/**
 * Nível semântico de cabeçalho corrente (1–6), provido pela árvore de `BuiHeadingLevel`.
 * Substitui o `LevelContext` (React context) do Base Web por DI hierárquico do Angular.
 * Raiz (sem provedor acima) = 0; cada `BuiHeadingLevel` provê `pai + 1`.
 */
export const BUI_HEADING_LEVEL = new InjectionToken<number>('BUI_HEADING_LEVEL', {
  factory: () => 0,
});

/**
 * Escala tipográfica por nível — espelha `FONTS` do `baseui/heading`:
 * `['', font1050, font950, font850, font750, font650, font550]`, que no tema mapeiam para
 * `HeadingXXLarge…HeadingXSmall`. Indexado por nível (1–6).
 */
const SCALE_BY_LEVEL = [
  '',
  'HeadingXXLarge', // L1 — font1050 (40/52)
  'HeadingXLarge', //  L2 — font950  (36/44)
  'HeadingLarge', //   L3 — font850  (32/40)
  'HeadingMedium', //  L4 — font750  (28/36)
  'HeadingSmall', //   L5 — font650  (24/32)
  'HeadingXSmall', //  L6 — font550  (20/28)
] as const;

/**
 * Margens de bloco do user-agent para h1–h6 (em `em`, relativas ao próprio font-size).
 * O Base Web não reseta margens; o app-pin tem reset universal (`* { margin: 0 }`), então
 * restauramos para fidelidade (mesmas métricas do original — ex. h1 0.67em·40px = 26.8px).
 */
const UA_MARGIN = ['', '0.67em', '0.83em', '1em', '1.33em', '1.67em', '2.33em'] as const;

/**
 * HeadingLevel — clone do `baseui/heading` `HeadingLevel`. Não renderiza box próprio
 * (`display: contents`); apenas incrementa o nível semântico provido aos `BuiHeading`
 * descendentes. Aninhe para descer de h1 → h6.
 */
@Component({
  selector: 'bui-heading-level',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  host: { style: 'display: contents' },
  providers: [
    {
      provide: BUI_HEADING_LEVEL,
      useFactory: (parent: number | null) => (parent ?? 0) + 1,
      deps: [[new Optional(), new SkipSelf(), BUI_HEADING_LEVEL]],
    },
  ],
})
export class BuiHeadingLevel {}

/**
 * Heading — clone do `baseui/heading` `Heading`. Renderiza `<h{level}>` (nível semântico
 * vindo do `BuiHeadingLevel` ancestral) com a escala tipográfica do nível, cor
 * `contentPrimary` e margem UA. `styleLevel` fixa a escala **visual** (1–6) sem mudar a
 * tag semântica. Deve ser descendente de `BuiHeadingLevel`.
 */
@Component({
  selector: 'bui-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet],
  host: { style: 'display: contents' },
  // Um único `<ng-content>` (no ng-template) — múltiplos slots default fariam o compilador
  // projetar só no último. O `ngTemplateOutlet` estampa o conteúdo na tag do nível corrente.
  template: `
    @switch (level()) {
      @case (1) { <h1 data-baseweb="heading" [style.font]="font()" [style.color]="color" [style.margin-block]="margin()"><ng-container [ngTemplateOutlet]="c" /></h1> }
      @case (2) { <h2 data-baseweb="heading" [style.font]="font()" [style.color]="color" [style.margin-block]="margin()"><ng-container [ngTemplateOutlet]="c" /></h2> }
      @case (3) { <h3 data-baseweb="heading" [style.font]="font()" [style.color]="color" [style.margin-block]="margin()"><ng-container [ngTemplateOutlet]="c" /></h3> }
      @case (4) { <h4 data-baseweb="heading" [style.font]="font()" [style.color]="color" [style.margin-block]="margin()"><ng-container [ngTemplateOutlet]="c" /></h4> }
      @case (5) { <h5 data-baseweb="heading" [style.font]="font()" [style.color]="color" [style.margin-block]="margin()"><ng-container [ngTemplateOutlet]="c" /></h5> }
      @case (6) { <h6 data-baseweb="heading" [style.font]="font()" [style.color]="color" [style.margin-block]="margin()"><ng-container [ngTemplateOutlet]="c" /></h6> }
    }
    <ng-template #c><ng-content /></ng-template>
  `,
})
export class BuiHeading {
  /** Nível semântico (1–6) herdado da árvore de `BuiHeadingLevel`. */
  protected readonly level = computed(() => Math.min(Math.max(this.injectedLevel, 1), 6));
  /** Fixa a escala visual (1–6) independente do nível semântico — espelha `styleLevel`. */
  readonly styleLevel = input<1 | 2 | 3 | 4 | 5 | 6 | undefined>(undefined);

  protected readonly color = 'var(--bw-content-primary)';
  protected readonly font = computed(
    () => `var(--bw-font-${SCALE_BY_LEVEL[this.styleLevel() ?? this.level()]})`,
  );
  protected readonly margin = computed(() => UA_MARGIN[this.level()]);

  private readonly injectedLevel = inject(BUI_HEADING_LEVEL);
}
