import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, model, signal } from '@angular/core';

export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

/** Drawer — fiel ao baseui/drawer (painel ancorado deslizante + backdrop). */
@Component({
  selector: 'bui-drawer',
  exportAs: 'buiDrawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (open()) {
      <div class="bui-drawer__backdrop" (click)="open.set(false)"></div>
      <div class="bui-drawer__panel" [attr.data-anchor]="anchor()" role="dialog" aria-modal="true">
        @if (closeable()) { <button type="button" class="bui-drawer__close" aria-label="Close" (click)="open.set(false)"><span class="material-symbols-rounded">close</span></button> }
        <div class="bui-drawer__body"><ng-content /></div>
      </div>
    }
  `,
  styles: `
    .bui-drawer__backdrop { position:fixed; inset:0; z-index:var(--bw-z-modal); background:var(--bw-background-overlay); }
    .bui-drawer__panel { position:fixed; z-index:calc(var(--bw-z-modal) + 1); background:var(--bw-background-primary); box-shadow:var(--bw-shadow-700); padding:var(--bw-sizing-scale800); overflow:auto; animation:bui-drawer-in var(--bw-timing-250) var(--bw-ease-out); }
    .bui-drawer__panel[data-anchor="right"] { top:0; right:0; bottom:0; width:min(420px,92vw); }
    .bui-drawer__panel[data-anchor="left"] { top:0; left:0; bottom:0; width:min(420px,92vw); }
    .bui-drawer__panel[data-anchor="top"] { top:0; left:0; right:0; max-height:80vh; }
    .bui-drawer__panel[data-anchor="bottom"] { bottom:0; left:0; right:0; max-height:80vh; }
    .bui-drawer__close { position:absolute; top:var(--bw-sizing-scale500); right:var(--bw-sizing-scale500); border:none; background:transparent; color:var(--bw-content-secondary); cursor:pointer; line-height:0; span { font-size:22px; } }
    .bui-drawer__body { font:var(--bw-font-ParagraphMedium); color:var(--bw-content-primary); }
    @keyframes bui-drawer-in { from { opacity:0; } to { opacity:1; } }
  `,
  host: { '(document:keydown.escape)': 'open.set(false)' },
})
export class Drawer {
  readonly open = model(false);
  readonly anchor = input<DrawerAnchor>('right');
  readonly closeable = input(true);
}

@Component({
  selector: 'bui-s-drawer', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Drawer],
  template: `
    <button style="padding:8px 16px; border:1px solid var(--bw-border-opaque); border-radius:8px; background:var(--bw-background-secondary); cursor:pointer" (click)="show.set(true)">Open drawer</button>
    <bui-drawer [open]="show()" (openChange)="show.set($event)" anchor="right">
      <h3 style="font:var(--bw-font-HeadingSmall); margin:0 0 12px">Drawer</h3>
      Conteúdo do drawer ancorado à direita.
    </bui-drawer>
  `,
})
export class DrawerScenario { protected readonly show = signal(false); }
