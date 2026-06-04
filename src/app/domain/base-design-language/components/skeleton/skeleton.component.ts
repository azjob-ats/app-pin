import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

/** Skeleton — fiel ao baseui/skeleton (bloco com shimmer; rows opcional). */
@Component({
  selector: 'bui-skeleton',
  exportAs: 'buiSkeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (rows() > 0) {
      @for (r of rowsArray(); track r) {
        <div class="bui-skeleton__row" [class.bui-skeleton__row--anim]="animation()"></div>
      }
    }
  `,
  styles: `
    bui-skeleton { display:block; }
    bui-skeleton:not(:has(.bui-skeleton__row)) {
      width: var(--bui-skeleton-w, 100%); height: var(--bui-skeleton-h, 16px);
      border-radius: var(--bw-radius-200); background: var(--bw-background-tertiary);
    }
    bui-skeleton[data-anim="true"]:not(:has(.bui-skeleton__row)) { background-image: var(--bui-shimmer); background-size:200% 100%; animation: bui-shimmer 1.6s linear infinite; }
    .bui-skeleton__row { height:16px; border-radius:var(--bw-radius-200); background:var(--bw-background-tertiary); margin-bottom:12px; }
    .bui-skeleton__row:last-child { margin-bottom:0; width:70%; }
    .bui-skeleton__row--anim { background-image: linear-gradient(90deg, var(--bw-background-tertiary) 0%, var(--bw-background-secondary) 50%, var(--bw-background-tertiary) 100%); background-size:200% 100%; animation: bui-shimmer 1.6s linear infinite; }
    @keyframes bui-shimmer { from { background-position:200% 0; } to { background-position:-200% 0; } }
  `,
  host: {
    '[style.--bui-skeleton-w]': 'width()',
    '[style.--bui-skeleton-h]': 'height()',
    '[style.--bui-shimmer]': '"linear-gradient(90deg, var(--bw-background-tertiary) 0%, var(--bw-background-secondary) 50%, var(--bw-background-tertiary) 100%)"',
    '[attr.data-anim]': 'animation()',
  },
})
export class Skeleton {
  readonly width = input<string>('100%');
  readonly height = input<string>('16px');
  readonly rows = input<number>(0);
  readonly animation = input(false);

  protected rowsArray(): number[] {
    return Array.from({ length: this.rows() }, (_, i) => i);
  }
}

@Component({
  selector: 'bui-s-skeleton', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Skeleton],
  template: `<div style="display:flex; flex-direction:column; gap:24px; width:280px;">
    <bui-skeleton width="280px" height="180px" [animation]="true" />
    <bui-skeleton [rows]="4" [animation]="true" />
  </div>`,
})
export class SkeletonScenario {}
