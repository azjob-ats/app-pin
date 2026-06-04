import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, model } from '@angular/core';

/** PageControl — fiel ao baseui/page-control (dots de carrossel). */
@Component({
  selector: 'bui-page-control',
  exportAs: 'buiPageControl',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-pc" role="tablist">
      @for (d of dots(); track d) {
        <button type="button" class="bui-pc__dot" [class.bui-pc__dot--active]="d === current()" [attr.aria-label]="'Page ' + d" (click)="current.set(d)"></button>
      }
    </div>
  `,
  styles: `
    .bui-pc { display:inline-flex; align-items:center; gap:var(--bw-sizing-scale300); }
    .bui-pc__dot { width:8px; height:8px; padding:0; border:none; border-radius:50%; background:var(--bw-border-opaque); cursor:pointer; transition:background var(--bw-timing-200) var(--bw-ease-out), width var(--bw-timing-200) var(--bw-ease-out); }
    .bui-pc__dot--active { background:var(--bw-content-primary); width:20px; border-radius:999px; }
  `,
})
export class PageControl {
  readonly numPages = input<number>(4);
  readonly current = model<number>(1);
  protected readonly dots = computed(() => Array.from({ length: this.numPages() }, (_, i) => i + 1));
}

@Component({
  selector: 'bui-s-page-control', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [PageControl],
  template: `<bui-page-control [numPages]="5" [current]="1" />`,
})
export class PageControlScenario {}
