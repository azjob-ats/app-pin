import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';

/** Tile — fiel ao baseui/tile (bloco selecionável; leadingContent, label, body). */
@Component({
  selector: 'bui-tile',
  exportAs: 'buiTile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="bui-tile__leading"><ng-content select="[buiLeading]" /></span>
    <span class="bui-tile__label"><ng-content /></span>
  `,
  styles: `
    bui-tile {
      display:flex; align-items:center; gap:var(--bw-sizing-scale400);
      padding:var(--bw-sizing-scale600); border-radius:var(--bw-radius-300);
      background:var(--bw-background-primary); cursor:pointer;
      box-shadow: inset 0 0 0 2px var(--bw-border-opaque);
      transition: box-shadow var(--bw-timing-200) var(--bw-ease-out);
    }
    bui-tile:hover { box-shadow: inset 0 0 0 2px var(--bw-border-selected); }
    bui-tile[data-selected] { box-shadow: inset 0 0 0 2px var(--bw-border-accent); background:var(--bw-background-accent-light); }
    bui-tile[data-disabled] { cursor:not-allowed; opacity:var(--bw-opacity-disabled); }
    .bui-tile__leading { display:inline-flex; color:var(--bw-content-secondary); &:empty { display:none; } }
    .bui-tile__label { font:var(--bw-font-LabelMedium); color:var(--bw-content-primary); }
  `,
  host: {
    role: 'button',
    tabindex: '0',
    '[attr.data-selected]': 'selected() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.aria-pressed]': 'selected()',
    '(click)': 'toggle()',
    '(keydown.enter)': 'toggle()',
    '(keydown.space)': 'toggle()',
  },
})
export class Tile {
  readonly selected = input(false);
  readonly disabled = input(false);
  readonly selectedChange = output<boolean>();
  protected toggle(): void { if (!this.disabled()) this.selectedChange.emit(!this.selected()); }
}

@Component({
  selector: 'bui-tile-group',
  exportAs: 'buiTileGroup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  styles: `bui-tile-group { display:grid; grid-template-columns:repeat(auto-fill, minmax(180px,1fr)); gap:var(--bw-sizing-scale400); }`,
})
export class TileGroup {}

@Component({
  selector: 'bui-s-tile', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Tile, TileGroup],
  template: `<bui-tile-group style="width:480px;">
    <bui-tile [selected]="true"><span buiLeading class="material-symbols-rounded">bolt</span>Selected</bui-tile>
    <bui-tile><span buiLeading class="material-symbols-rounded">star</span>Default</bui-tile>
    <bui-tile [disabled]="true"><span buiLeading class="material-symbols-rounded">block</span>Disabled</bui-tile>
  </bui-tile-group>`,
})
export class TileScenario {}
