import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Button } from '../button/button.component';
import { BuiCheck, BuiChevronRight, BuiSearch } from '../icon/icon.component';
import { ArtworkSizeName, BuiListHeading, BuiListItem, BuiListItemLabel } from './list.component';

/** Scenarios portadas de `src/list/__tests__/*.scenario.tsx`. */

type End = 'action' | 'checks' | 'chevron' | 'label' | 'labelDesc' | 'labelSublist' | null;
interface Item {
  art: boolean;
  size?: ArtworkSizeName;
  end: End;
  desc: boolean;
  sublist: boolean;
}

/** Um bloco = 4 colunas (sem artwork, SMALL/default, default/MEDIUM, LARGE). */
function block(end: End, desc: boolean, sublist: boolean): Item[] {
  if (sublist) {
    return [
      { art: false, end, desc, sublist: true },
      { art: true, end, desc, sublist: true },
      { art: true, size: 'MEDIUM', end, desc, sublist: true },
      { art: true, size: 'LARGE', end, desc, sublist: true },
    ];
  }
  return [
    { art: false, end, desc, sublist: false },
    { art: true, size: 'SMALL', end, desc, sublist: false },
    { art: true, end, desc, sublist: false },
    { art: true, size: 'LARGE', end, desc, sublist: false },
  ];
}

/** 52 itens (blocos A–M) compartilhados pela story `item` e `item-rtl`. */
function buildItems(): Item[] {
  return [
    ...block('action', false, false),
    ...block('checks', false, false),
    ...block('chevron', false, false),
    ...block('label', false, false),
    ...block(null, false, false),
    ...block('action', true, false),
    ...block('checks', true, false),
    ...block('chevron', true, false),
    ...block('labelDesc', true, false),
    ...block(null, true, false),
    ...block('chevron', false, true),
    ...block('labelSublist', false, true),
    ...block(null, false, true),
  ];
}

const GRID =
  'display:grid;grid-column-gap:36px;grid-row-gap:16px;grid-template-columns:repeat(4, 325px);padding:24px';

/* ── list-item.scenario.tsx ───────────────────────────────────────────────── */
@Component({
  selector: 'bui-s-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiListItem, BuiListItemLabel, Button, BuiCheck, BuiChevronRight, BuiSearch],
  template: `
    <div [style]="grid" role="list">
      @for (it of items; track $index) {
        <li
          buiListItem
          [artwork]="it.art ? searchTpl : undefined"
          [artworkSize]="it.size"
          [sublist]="it.sublist"
          [endEnhancer]="
            it.end === 'action'
              ? actionTpl
              : it.end === 'checks'
                ? checksTpl
                : it.end === 'chevron'
                  ? chevronTpl
                  : it.end === 'label'
                    ? endLabelTpl
                    : it.end === 'labelDesc'
                      ? endLabelDescTpl
                      : it.end === 'labelSublist'
                        ? endLabelSublistTpl
                        : undefined
          "
        >
          @if (it.sublist) {
            <bui-list-item-label sublist>Label</bui-list-item-label>
          } @else if (it.desc) {
            <bui-list-item-label description="description">Label</bui-list-item-label>
          } @else {
            <bui-list-item-label>Label</bui-list-item-label>
          }
        </li>
      }

      <li buiListItem [artwork]="checkArtTpl" [endEnhancer]="roundShapeTpl" shape="ROUND" rootBackground="var(--bw-warning-200)">
        <bui-list-item-label>Label</bui-list-item-label>
      </li>
      <li buiListItem [artwork]="checkArtTpl" [endEnhancer]="defaultShapeTpl" rootBackground="var(--bw-warning-200)">
        <bui-list-item-label>Label</bui-list-item-label>
      </li>
    </div>

    <ng-template #searchTpl let-size><bui-search [size]="size" /></ng-template>
    <ng-template #checkArtTpl let-size><bui-check [size]="size" /></ng-template>
    <ng-template #actionTpl>
      <bui-button size="compact" kind="secondary" shape="pill">Action</bui-button>
    </ng-template>
    <ng-template #checksTpl>
      <bui-button shape="round" size="compact" kind="secondary"><bui-check /></bui-button>
      <div style="width:18px"></div>
      <bui-button shape="round" size="compact" kind="secondary"><bui-check /></bui-button>
    </ng-template>
    <ng-template #chevronTpl><bui-chevron-right /></ng-template>
    <ng-template #endLabelTpl><bui-list-item-label>Label</bui-list-item-label></ng-template>
    <ng-template #endLabelDescTpl>
      <bui-list-item-label description="description">Label</bui-list-item-label>
    </ng-template>
    <ng-template #endLabelSublistTpl><bui-list-item-label sublist>Label</bui-list-item-label></ng-template>
    <ng-template #roundShapeTpl><bui-list-item-label>Round Shape</bui-list-item-label></ng-template>
    <ng-template #defaultShapeTpl><bui-list-item-label>Default Shape</bui-list-item-label></ng-template>
  `,
})
export class ListItemScenario {
  protected readonly grid = GRID;
  protected readonly items = buildItems();
}

/* ── list-item-rtl.scenario.tsx (mesmos 52 itens, dir=rtl) ────────────────── */
@Component({
  selector: 'bui-s-list-item-rtl',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiListItem, BuiListItemLabel, Button, BuiCheck, BuiChevronRight, BuiSearch],
  template: `
    <div [style]="grid" role="list" dir="rtl">
      @for (it of items; track $index) {
        <li
          buiListItem
          [artwork]="it.art ? searchTpl : undefined"
          [artworkSize]="it.size"
          [sublist]="it.sublist"
          [endEnhancer]="
            it.end === 'action'
              ? actionTpl
              : it.end === 'checks'
                ? checksTpl
                : it.end === 'chevron'
                  ? chevronTpl
                  : it.end === 'labelSublist'
                    ? endLabelSublistTpl
                    : undefined
          "
        >
          @if (it.sublist) {
            <bui-list-item-label sublist>Label</bui-list-item-label>
          } @else if (it.desc) {
            <bui-list-item-label description="description">Label</bui-list-item-label>
          } @else {
            <bui-list-item-label>Label</bui-list-item-label>
          }
        </li>
      }
    </div>

    <ng-template #searchTpl let-size><bui-search [size]="size" /></ng-template>
    <ng-template #actionTpl>
      <bui-button size="compact" kind="secondary" shape="pill">Action</bui-button>
    </ng-template>
    <ng-template #checksTpl>
      <bui-button shape="round" size="compact" kind="secondary"><bui-check /></bui-button>
      <div style="width:18px"></div>
      <bui-button shape="round" size="compact" kind="secondary"><bui-check /></bui-button>
    </ng-template>
    <ng-template #chevronTpl><bui-chevron-right /></ng-template>
    <ng-template #endLabelSublistTpl><bui-list-item-label sublist>Label</bui-list-item-label></ng-template>
  `,
})
export class ListItemRtlScenario {
  protected readonly grid = GRID;
  protected readonly items = buildItems();
}

/* ── list-item-artwork-sizes.scenario.tsx ─────────────────────────────────── */
@Component({
  selector: 'bui-s-list-item-artwork-sizes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiListItem, BuiListItemLabel, BuiSearch],
  template: `
    <div style="width:375px;padding:24px;background-color:lightgreen;box-sizing:content-box" role="list">
      <li buiListItem><bui-list-item-label>No Artwork</bui-list-item-label></li>
      <li buiListItem [artwork]="searchTpl" artworkSize="SMALL">
        <bui-list-item-label>Small Artwork</bui-list-item-label>
      </li>
      <li buiListItem [artwork]="searchTpl" artworkSize="MEDIUM">
        <bui-list-item-label>Medium Artwork</bui-list-item-label>
      </li>
      <li buiListItem [artwork]="searchTpl" artworkSize="LARGE">
        <bui-list-item-label>Large Artwork</bui-list-item-label>
      </li>
      <li buiListItem [artwork]="box64Tpl" [artworkSize]="64">
        <bui-list-item-label>64px Artwork</bui-list-item-label>
      </li>
      <li buiListItem [artwork]="box96Tpl" [artworkSize]="96">
        <bui-list-item-label>96px Artwork</bui-list-item-label>
      </li>
    </div>

    <ng-template #searchTpl let-size><bui-search [size]="size" /></ng-template>
    <ng-template #box64Tpl>
      <div style="background-color:lightskyblue;width:64px;height:24px"></div>
    </ng-template>
    <ng-template #box96Tpl>
      <div style="background-color:lightskyblue;width:96px;height:24px"></div>
    </ng-template>
  `,
})
export class ListItemArtworkSizesScenario {}

/* ── list-item-artwork-min-width.scenario.tsx (idem, container 100px) ─────── */
@Component({
  selector: 'bui-s-list-item-artwork-min-width',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiListItem, BuiListItemLabel, BuiSearch],
  template: `
    <div style="width:100px;padding:24px;background-color:lightgreen;box-sizing:content-box" role="list">
      <li buiListItem><bui-list-item-label>No Artwork</bui-list-item-label></li>
      <li buiListItem [artwork]="searchTpl" artworkSize="SMALL">
        <bui-list-item-label>Small Artwork</bui-list-item-label>
      </li>
      <li buiListItem [artwork]="searchTpl" artworkSize="MEDIUM">
        <bui-list-item-label>Medium Artwork</bui-list-item-label>
      </li>
      <li buiListItem [artwork]="searchTpl" artworkSize="LARGE">
        <bui-list-item-label>Large Artwork</bui-list-item-label>
      </li>
      <li buiListItem [artwork]="box64Tpl" [artworkSize]="64">
        <bui-list-item-label>64px Artwork</bui-list-item-label>
      </li>
      <li buiListItem [artwork]="box96Tpl" [artworkSize]="96">
        <bui-list-item-label>96px Artwork</bui-list-item-label>
      </li>
    </div>

    <ng-template #searchTpl let-size><bui-search [size]="size" /></ng-template>
    <ng-template #box64Tpl>
      <div style="background-color:lightskyblue;width:64px;height:24px"></div>
    </ng-template>
    <ng-template #box96Tpl>
      <div style="background-color:lightskyblue;width:96px;height:24px"></div>
    </ng-template>
  `,
})
export class ListItemArtworkMinWidthScenario {}

/* ── list-item-overrides.scenario.tsx ─────────────────────────────────────── */
@Component({
  selector: 'bui-s-list-item-overrides',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiListItem, BuiListItemLabel],
  template: `
    <ul style="width:375px;padding:24px;background-color:lightskyblue;box-sizing:content-box">
      <li buiListItem>
        <bui-list-item-label>123</bui-list-item-label>
        <bui-list-item-label contentColor="var(--bw-positive)">ABC</bui-list-item-label>
      </li>
    </ul>
  `,
})
export class ListItemOverridesScenario {}

/* ── list-item-menu-adapter.scenario.tsx ──────────────────────────────────── */
@Component({
  selector: 'bui-s-list-item-menu-adapter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiListItem, BuiListItemLabel, BuiChevronRight, BuiSearch],
  template: `
    <ul
      class="bui-list-menu"
      style="height:300px;width:450px"
      role="listbox"
      aria-label="People"
      tabindex="0"
    >
      @for (i of ten; track $index) {
        <li buiListItem menuItem role="option" [artwork]="searchTpl" artworkSize="LARGE" [endEnhancer]="chevronTpl">
          <bui-list-item-label description="Senior Engineering Manager">Jane Smith</bui-list-item-label>
        </li>
      }
    </ul>

    <ng-template #searchTpl let-size><bui-search [size]="size" /></ng-template>
    <ng-template #chevronTpl><bui-chevron-right /></ng-template>
  `,
})
export class ListItemMenuAdapterScenario {
  protected readonly ten = Array(10).fill(undefined);
}

/* ── list-heading.scenario.tsx (16 headings) ──────────────────────────────── */
@Component({
  selector: 'bui-s-list-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiListHeading, Button],
  template: `
    <div
      style="display:grid;grid-column-gap:36px;grid-row-gap:28px;grid-template-columns:repeat(1, 325px);padding:24px"
    >
      <bui-list-heading heading="Heading" />
      <bui-list-heading heading="Heading" subHeading="Sub heading" />
      <bui-list-heading heading="Heading" endEnhancer="Enhancer Text" endEnhancerDescription="Description" />
      <bui-list-heading
        heading="Heading"
        subHeading="Sub heading"
        endEnhancer="Enhancer Text"
        endEnhancerDescription="Description"
      />

      <bui-list-heading
        heading="Overflow 1 line content is too long"
        endEnhancer="Enhancer Text"
        endEnhancerDescription="Description"
      />
      <bui-list-heading
        heading="Overflow 2 lines content is too long"
        endEnhancer="Enhancer Text"
        endEnhancerDescription="Description"
        [maxLines]="2"
      />
      <bui-list-heading
        heading="Overflow 1 line content is too long"
        subHeading="Sub heading"
        endEnhancer="Enhancer Text"
        endEnhancerDescription="Description"
      />
      <bui-list-heading
        heading="Overflow 2 lines content is too long shoo deee booo ooop"
        subHeading="Sub heading"
        endEnhancer="Enhancer Text"
        endEnhancerDescription="Description"
        [maxLines]="2"
      />
      <bui-list-heading
        heading="Overflow 2 lines content is far too long basically a full paragraph"
        subHeading="Sub heading content is also too long ya da da da doop be doo"
        endEnhancer="Enhancer Text is also too longer doo bee doo bee doo da doo"
        endEnhancerDescription="Description is also way too long"
        [maxLines]="2"
      />

      <bui-list-heading heading="Heading" subHeading="Sub heading" [endEnhancer]="btnTpl" />
      <bui-list-heading
        heading="Overflow 2 lines content is too long"
        subHeading="Sub heading"
        [endEnhancer]="btnTpl"
        [maxLines]="2"
      />
      <bui-list-heading
        heading="Overflow 2 lines content is too long"
        subHeading="Style overrides for endEnhancer"
        [endEnhancer]="btnTpl"
        [maxLines]="2"
        endEnhancerMinWidth="70px"
      />
      <bui-list-heading
        heading="Heading"
        subHeading="Description not rendered"
        [endEnhancer]="btnTpl"
        endEnhancerDescription="Description"
      />

      <bui-list-heading [heading]="spanHeadingTpl" [subHeading]="spanSubTpl" [endEnhancer]="btnTpl" />
      <bui-list-heading [heading]="fnHeadingTpl" [subHeading]="fnSubTpl" />

      <bui-list-heading
        heading="Short"
        subHeading="Short"
        endEnhancer="Very very very very loooooong way"
        endEnhancerDescription="Also Very very very long"
      />
    </div>

    <ng-template #btnTpl>
      <bui-button size="compact" kind="secondary" shape="pill">Action</bui-button>
    </ng-template>
    <ng-template #spanHeadingTpl><span>Heading in Span</span></ng-template>
    <ng-template #spanSubTpl><span>Sub heading in Span</span></ng-template>
    <ng-template #fnHeadingTpl><span>Heading component</span></ng-template>
    <ng-template #fnSubTpl><span>Sub heading component</span></ng-template>
  `,
})
export class ListHeadingScenario {}
