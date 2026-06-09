import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

/* ── Constantes (clone de list/constants.ts) ──────────────────────────────── */
export const ARTWORK_SIZES = { SMALL: 'SMALL', MEDIUM: 'MEDIUM', LARGE: 'LARGE' } as const;
export const SHAPE = { DEFAULT: 'DEFAULT', ROUND: 'ROUND' } as const;

export type ArtworkSizeName = 'SMALL' | 'MEDIUM' | 'LARGE';
export type ArtworkSize = ArtworkSizeName | number;
export type ListShape = 'DEFAULT' | 'ROUND';

/** Clone de list/utils.ts — mapeia o nome do artwork para o valor numérico (px). */
export function artworkSizeToValue(size: ArtworkSizeName, isSublist: boolean): number {
  if (isSublist) {
    switch (size) {
      case 'LARGE':
        return 24;
      case 'SMALL':
      default:
        return 16;
    }
  }
  switch (size) {
    case 'SMALL':
      return 16;
    case 'LARGE':
      return 36;
    case 'MEDIUM':
    default:
      return 24;
  }
}

/**
 * ListItem — clone fiel do `baseui/list` ListItem. O **host é o próprio `<li>`** (seletor de
 * atributo `li[buiListItem]`) para o item ser filho direto do `<ul>`/container — sem elemento
 * intermediário, preservando a semântica de lista (AXE `list`/`listitem`). Flex com Artwork
 * opcional (container 64px centrado se ≤36px; padding lateral se >36px) + Content (borda
 * inferior `border100`, min-height `scale1600`=64px, ou `initial` em sublist). `artwork` e
 * `endEnhancer` são `TemplateRef`s — o artwork recebe o tamanho resolvido via `$implicit`
 * (espelha a render-prop do React, que aliasa MEDIUM→SMALL em sublist). `menuItem` liga o
 * realce de hover (usado dentro de um menu).
 */
@Component({
  selector: 'li[buiListItem]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './list.component.scss',
  imports: [NgTemplateOutlet],
  host: {
    class: 'bui-li__root',
    '[class.bui-li__root--round]': "shape() === 'ROUND'",
    '[class.bui-li__root--menu]': 'menuItem()',
    '[style.background-color]': 'rootBackground() || null',
    '[attr.aria-label]': 'ariaLabel() ?? null',
    '[attr.aria-selected]': 'ariaSelected() ?? null',
    '[attr.role]': 'role() ?? null',
  },
  template: `
    @if (artwork(); as art) {
      <div class="bui-li__artwork" [class.bui-li__artwork--wide]="artworkPx() > 36">
        <ng-container [ngTemplateOutlet]="art" [ngTemplateOutletContext]="{ $implicit: artworkPx() }" />
      </div>
    }

    <div
      class="bui-li__content"
      [class.bui-li__content--mleft]="!artwork()"
      [class.bui-li__content--sublist]="sublist()"
    >
      <ng-content />
      @if (endEnhancer(); as end) {
        <div class="bui-li__end">
          <ng-container [ngTemplateOutlet]="end" />
        </div>
      }
    </div>
  `,
})
export class BuiListItem {
  /** Template do artwork; recebe o tamanho resolvido (px) via `$implicit`. */
  readonly artwork = input<TemplateRef<{ $implicit: number }>>();
  /** Template do enhancer final (botão, ícone, label...). */
  readonly endEnhancer = input<TemplateRef<unknown>>();
  /** Tamanho do artwork: nome (`SMALL`/`MEDIUM`/`LARGE`) ou número (px). */
  readonly artworkSize = input<ArtworkSize>();
  /** Item de sublista: Content sem min-height; artwork menor (MEDIUM→SMALL). */
  readonly sublist = input(false, { transform: booleanAttribute });
  /** Forma: `DEFAULT` (cantos retos) ou `ROUND` (radius400). */
  readonly shape = input<ListShape>('DEFAULT');
  /** Realce de hover (usado pelo MenuAdapter dentro de um menu). */
  readonly menuItem = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();
  readonly ariaSelected = input<boolean>();
  readonly role = input<string>();
  /** Cor de fundo do Root (override `Root.style.backgroundColor` das stories). */
  readonly rootBackground = input<string>();

  /** Tamanho do artwork resolvido em px (com aliasing MEDIUM→SMALL em sublist). */
  protected readonly artworkPx = computed(() => {
    const sublist = this.sublist();
    const raw = this.artworkSize();
    let size: ArtworkSize = raw ?? (sublist ? 'SMALL' : 'MEDIUM');
    if (sublist && size === 'MEDIUM') size = 'SMALL';
    return typeof size === 'number' ? size : artworkSizeToValue(size, sublist);
  });
}

/**
 * ListItemLabel — clone fiel do `baseui/list` ListItemLabel. Renderiza o LabelRoot
 * (LabelContent `LabelMedium` + LabelDescription `ParagraphSmall` opcional). Em `sublist`,
 * vira um único parágrafo `LabelMedium` com margens verticais `scale500`. `contentColor`
 * cobre o override de cor do LabelContent (story `overrides`).
 */
@Component({
  selector: 'bui-list-item-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './list.component.scss',
  imports: [NgTemplateOutlet],
  host: { style: 'display: contents' },
  template: `
    <ng-template #children><ng-content /></ng-template>
    @if (sublist()) {
      <p class="bui-li-label__sublist"><ng-container [ngTemplateOutlet]="children" /></p>
    } @else {
      <div class="bui-li-label__root">
        <p class="bui-li-label__content" [style.color]="contentColor() || null">
          <ng-container [ngTemplateOutlet]="children" />
        </p>
        @if (description()) {
          <p class="bui-li-label__desc">{{ description() }}</p>
        }
      </div>
    }
  `,
})
export class BuiListItemLabel {
  readonly description = input<string>();
  readonly sublist = input(false, { transform: booleanAttribute });
  /** Override de cor do LabelContent (ex.: `var(--bw-positive)`). */
  readonly contentColor = input<string>();
}

/**
 * ListHeading — clone fiel do `baseui/list` ListHeading. Linha superior (heading + enhancer)
 * e inferior opcional (sub-heading + descrição do enhancer). `heading`/`subHeading`/`endEnhancer`
 * aceitam texto **ou** um `TemplateRef`. Quando `endEnhancer` é texto, alinha à direita
 * (`flex-end`) e mostra a `endEnhancerDescription`; quando é nó, alinha ao centro e a descrição
 * é ignorada (igual ao original). `maxLines` (1 ou 2) controla o line-clamp.
 */
@Component({
  selector: 'bui-list-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './list.component.scss',
  imports: [NgTemplateOutlet],
  host: { style: 'display: contents' },
  template: `
    <div class="bui-lh__root">
      <div class="bui-lh__content">
        <div class="bui-lh__row">
          <p class="bui-lh__heading" [style.-webkit-line-clamp]="clampLines()">
            @if (isTpl(heading())) {
              <ng-container [ngTemplateOutlet]="$any(heading())" />
            } @else {
              {{ heading() }}
            }
          </p>
          @if (endEnhancer()) {
            <div
              class="bui-lh__end"
              [class.bui-lh__end--text]="isEndText()"
              [style.min-width]="endEnhancerMinWidth() || null"
            >
              @if (isTpl(endEnhancer())) {
                <ng-container [ngTemplateOutlet]="$any(endEnhancer())" />
              } @else {
                {{ endEnhancer() }}
              }
            </div>
          }
        </div>

        @if (hasBottomRow()) {
          <div class="bui-lh__row">
            <p class="bui-lh__subheading" [style.-webkit-line-clamp]="clampLines()">
              @if (subHeading()) {
                @if (isTpl(subHeading())) {
                  <ng-container [ngTemplateOutlet]="$any(subHeading())" />
                } @else {
                  {{ subHeading() }}
                }
              }
            </p>
            @if (endEnhancerDescription() && isEndText()) {
              <p class="bui-lh__end-desc">{{ endEnhancerDescription() }}</p>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class BuiListHeading {
  readonly heading = input<string | TemplateRef<unknown>>();
  readonly subHeading = input<string | TemplateRef<unknown>>();
  readonly endEnhancer = input<string | TemplateRef<unknown>>();
  readonly endEnhancerDescription = input<string>();
  readonly maxLines = input(1, { transform: numberAttribute });
  /** Override `EndEnhancerContainer.style.minWidth` (story de overrides). */
  readonly endEnhancerMinWidth = input<string>();

  protected readonly isEndText = computed(() => typeof this.endEnhancer() === 'string');
  protected readonly clampLines = computed(() => {
    const m = this.maxLines();
    return m === 1 || m === 2 ? m : 1;
  });
  /** Linha inferior aparece se houver sub-heading ou descrição do enhancer (qualquer tipo). */
  protected readonly hasBottomRow = computed(
    () => Boolean(this.subHeading()) || Boolean(this.endEnhancerDescription()),
  );

  protected isTpl(v: unknown): v is TemplateRef<unknown> {
    return v instanceof TemplateRef;
  }
}
/**
 * MenuAdapter — no Base Web é um ListItem adaptado para opção de menu (realce + pointer). Como
 * o host do `BuiListItem` já é o `<li>`, o adapter é apenas `<li buiListItem menuItem role="option">`
 * direto no `<ul role="listbox">` — sem componente extra (que reintroduziria um wrapper entre o
 * `<ul>` e o `<li>` e quebraria `aria-required-parent`).
 */
