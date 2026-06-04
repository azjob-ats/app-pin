import { ChangeDetectionStrategy, Component, ViewEncapsulation, model, signal } from '@angular/core';

/** Sheet — fiel ao baseui/sheet (bottom sheet com grabber). */
@Component({
  selector: 'bui-sheet',
  exportAs: 'buiSheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (open()) {
      <div class="bui-sheet__backdrop" (click)="open.set(false)"></div>
      <div class="bui-sheet__panel" role="dialog" aria-modal="true">
        <div class="bui-sheet__grabber"></div>
        <div class="bui-sheet__body"><ng-content /></div>
      </div>
    }
  `,
  styles: `
    .bui-sheet__backdrop { position:fixed; inset:0; z-index:var(--bw-z-modal); background:var(--bw-background-overlay); }
    .bui-sheet__panel { position:fixed; z-index:calc(var(--bw-z-modal) + 1); bottom:0; left:0; right:0; max-height:80vh; overflow:auto; padding:var(--bw-sizing-scale400) var(--bw-sizing-scale700) var(--bw-sizing-scale800); border-top-left-radius:var(--bw-radius-400); border-top-right-radius:var(--bw-radius-400); background:var(--bw-background-primary); box-shadow:var(--bw-shadow-700); animation:bui-sheet-in var(--bw-timing-250) var(--bw-ease-out); }
    .bui-sheet__grabber { width:40px; height:4px; border-radius:999px; background:var(--bw-border-opaque); margin:0 auto var(--bw-sizing-scale600); }
    .bui-sheet__body { font:var(--bw-font-ParagraphMedium); color:var(--bw-content-primary); }
    @keyframes bui-sheet-in { from { transform:translateY(100%); } to { transform:translateY(0); } }
  `,
  host: { '(document:keydown.escape)': 'open.set(false)' },
})
export class Sheet {
  readonly open = model(false);
}

@Component({
  selector: 'bui-s-sheet', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Sheet],
  template: `
    <button style="padding:8px 16px; border:1px solid var(--bw-border-opaque); border-radius:8px; background:var(--bw-background-secondary); cursor:pointer" (click)="show.set(true)">Open sheet</button>
    <bui-sheet [open]="show()" (openChange)="show.set($event)">
      <h3 style="font:var(--bw-font-HeadingSmall); margin:0 0 8px">Bottom sheet</h3>
      Conteúdo do bottom sheet.
    </bui-sheet>
  `,
})
export class SheetScenario { protected readonly show = signal(false); }
