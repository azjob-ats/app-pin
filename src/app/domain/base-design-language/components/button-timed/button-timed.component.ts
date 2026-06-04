import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output, signal } from '@angular/core';

/** ButtonTimed — fiel ao baseui/button-timed (botão com preenchimento de progresso até confirmar). */
@Component({
  selector: 'bui-button-timed',
  exportAs: 'buiButtonTimed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button type="button" class="bui-bt" (click)="start()">
      <span class="bui-bt__fill" [style.width.%]="progress()"></span>
      <span class="bui-bt__label">{{ progress() >= 100 ? 'Done' : label() }}</span>
    </button>
  `,
  styles: `
    .bui-bt { position:relative; overflow:hidden; min-height:48px; padding:0 var(--bw-sizing-scale700); border:none; border-radius:var(--bw-button-border-radius); background:var(--bw-button-secondary-fill); color:var(--bw-button-secondary-text); font:var(--bw-font-LabelMedium); cursor:pointer; }
    .bui-bt__fill { position:absolute; inset:0 auto 0 0; background:var(--bw-button-primary-fill); opacity:0.16; transition:width 50ms linear; }
    .bui-bt__label { position:relative; }
  `,
})
export class ButtonTimed {
  readonly label = input<string>('Hold to confirm');
  readonly duration = input<number>(2000);
  readonly completed = output<void>();
  protected readonly progress = signal(0);
  private timer: ReturnType<typeof setInterval> | null = null;

  protected start(): void {
    if (this.timer) return;
    const step = 100 / (this.duration() / 50);
    this.timer = setInterval(() => {
      this.progress.update((p) => Math.min(100, p + step));
      if (this.progress() >= 100) { clearInterval(this.timer!); this.timer = null; this.completed.emit(); }
    }, 50);
  }
}

@Component({
  selector: 'bui-s-button-timed', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [ButtonTimed],
  template: `<bui-button-timed label="Click to confirm" [duration]="1500" />`,
})
export class ButtonTimedScenario {}
