import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

/** Tooltip — fiel ao baseui/tooltip (balão em hover/focus). CSS-only (placement top/bottom). */
@Component({
  selector: 'bui-tooltip',
  exportAs: 'buiTooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content />
    <span class="bui-tt__pop" role="tooltip">{{ content() }}</span>
  `,
  styles: `
    bui-tooltip { position:relative; display:inline-flex; }
    .bui-tt__pop {
      position:absolute; z-index:var(--bw-z-modal); left:50%; transform:translateX(-50%) translateY(4px);
      bottom:calc(100% + 6px); padding:var(--bw-sizing-scale200) var(--bw-sizing-scale400);
      border-radius:var(--bw-radius-200); background:var(--bw-background-inverse-primary); color:var(--bw-content-inverse-primary);
      font:var(--bw-font-ParagraphXSmall); white-space:nowrap; opacity:0; pointer-events:none;
      transition:opacity var(--bw-timing-150) var(--bw-ease-out), transform var(--bw-timing-150) var(--bw-ease-out);
    }
    bui-tooltip[data-placement="bottom"] .bui-tt__pop { bottom:auto; top:calc(100% + 6px); transform:translateX(-50%) translateY(-4px); }
    bui-tooltip:hover .bui-tt__pop, bui-tooltip:focus-within .bui-tt__pop { opacity:1; transform:translateX(-50%); pointer-events:auto; }
  `,
  host: { '[attr.data-placement]': 'placement()' },
})
export class Tooltip {
  readonly content = input<string>('');
  readonly placement = input<'top' | 'bottom'>('top');
}

@Component({
  selector: 'bui-s-tooltip', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Tooltip],
  template: `<div style="display:flex; gap:24px; padding:32px;">
    <bui-tooltip content="Tooltip no topo"><button style="padding:8px 16px; border:1px solid var(--bw-border-opaque); border-radius:8px; background:var(--bw-background-primary)">Hover me</button></bui-tooltip>
    <bui-tooltip content="Tooltip embaixo" placement="bottom"><button style="padding:8px 16px; border:1px solid var(--bw-border-opaque); border-radius:8px; background:var(--bw-background-primary)">Bottom</button></bui-tooltip>
  </div>`,
})
export class TooltipScenario {}
