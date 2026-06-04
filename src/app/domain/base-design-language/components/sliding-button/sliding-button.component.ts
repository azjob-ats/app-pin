import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output, signal } from '@angular/core';

/** SlidingButton — fiel ao baseui/sliding-button (deslizar para confirmar). */
@Component({
  selector: 'bui-sliding-button',
  exportAs: 'buiSlidingButton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-slb__track">
      <span class="bui-slb__label">{{ done() ? 'Confirmed' : label() }}</span>
      <button
        type="button"
        class="bui-slb__thumb"
        [style.transform]="'translateX(' + x() + 'px)'"
        (pointerdown)="onDown($event)"
        aria-label="Slide to confirm"
      ><span class="material-symbols-rounded">{{ done() ? 'check' : 'chevron_right' }}</span></button>
    </div>
  `,
  styles: `
    .bui-slb__track { position:relative; display:flex; align-items:center; justify-content:center; width:280px; height:48px; border-radius:999px; background:var(--bw-background-secondary); overflow:hidden; }
    .bui-slb__label { font:var(--bw-font-LabelMedium); color:var(--bw-content-secondary); }
    .bui-slb__thumb { position:absolute; left:4px; top:4px; width:40px; height:40px; border:none; border-radius:50%; background:var(--bw-content-primary); color:var(--bw-content-inverse-primary); cursor:grab; touch-action:none; display:flex; align-items:center; justify-content:center; }
    .bui-slb__thumb:active { cursor:grabbing; }
  `,
})
export class SlidingButton {
  readonly label = input<string>('Slide to confirm');
  readonly completed = output<void>();
  protected readonly x = signal(0);
  protected readonly done = signal(false);
  private max = 232; // 280 - 40 - 8

  protected onDown(e: PointerEvent): void {
    if (this.done()) return;
    const startX = e.clientX - this.x();
    const move = (ev: PointerEvent) => this.x.set(Math.max(0, Math.min(this.max, ev.clientX - startX)));
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      if (this.x() >= this.max * 0.9) { this.x.set(this.max); this.done.set(true); this.completed.emit(); }
      else { this.x.set(0); }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }
}

@Component({
  selector: 'bui-s-sliding-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [SlidingButton],
  template: `<bui-sliding-button />`,
})
export class SlidingButtonScenario {}
