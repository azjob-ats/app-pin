import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, signal } from '@angular/core';

/** Popover — fiel ao baseui/popover (painel acionado por clique; fecha por scrim/Esc). */
@Component({
  selector: 'bui-popover',
  exportAs: 'buiPopover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="bui-pop__trigger" (click)="toggle()"><ng-content select="[buiTrigger]" /></span>
    @if (open()) {
      <div class="bui-pop__scrim" (click)="open.set(false)"></div>
      <div class="bui-pop__panel" [attr.data-placement]="placement()" role="dialog">
        <ng-content select="[buiContent]" />
      </div>
    }
  `,
  styles: `
    bui-popover { position:relative; display:inline-flex; }
    .bui-pop__trigger { display:inline-flex; }
    .bui-pop__scrim { position:fixed; inset:0; z-index:var(--bw-z-modal); }
    .bui-pop__panel {
      position:absolute; z-index:calc(var(--bw-z-modal) + 1); top:calc(100% + 8px); left:0; min-width:180px;
      padding:var(--bw-sizing-scale500); border-radius:var(--bw-popover-border-radius);
      background:var(--bw-background-primary); box-shadow:var(--bw-shadow-600); color:var(--bw-content-primary);
    }
    .bui-pop__panel[data-placement="bottom-right"] { left:auto; right:0; }
  `,
  host: { '(document:keydown.escape)': 'open.set(false)' },
})
export class Popover {
  readonly placement = input<'bottom-left' | 'bottom-right'>('bottom-left');
  readonly open = signal(false);
  protected toggle(): void { this.open.update((v) => !v); }
}

@Component({
  selector: 'bui-s-popover', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Popover],
  template: `<div style="padding:32px;">
    <bui-popover>
      <button buiTrigger style="padding:8px 16px; border:1px solid var(--bw-border-opaque); border-radius:8px; background:var(--bw-background-primary)">Open popover</button>
      <div buiContent style="font:var(--bw-font-ParagraphSmall); color:var(--bw-content-primary)">
        <strong>Popover</strong><br />Conteúdo flutuante acionado por clique.
      </div>
    </bui-popover>
  </div>`,
})
export class PopoverScenario {}
