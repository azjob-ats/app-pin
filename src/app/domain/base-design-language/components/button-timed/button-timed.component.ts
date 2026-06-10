import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { Kind } from '../button/button.model';

function padTo2Digits(n: number) {
  return n.toString().padStart(2, '0');
}

function formatTime(totalMs: number): string {
  let totalSeconds = Math.floor(totalMs / 1000);
  if (totalMs % 1000 > 0) totalSeconds += 1;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${padTo2Digits(seconds)}`;
}

@Component({
  selector: 'bui-button-timed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './button-timed.component.scss',
  template: `
    <button
      data-baseweb="button-timed"
      [class]="btnClass()"
      [disabled]="isDisabled()"
      [attr.aria-disabled]="isDisabled() ? 'true' : null"
      (click)="onClick()"
    >
      <span class="bui-button__start"></span>
      <span class="bui-button__label"><ng-content /></span>
      <span class="bui-bt__timer bui-button__end">&nbsp;({{ displayTime() }})</span>
      <span class="bui-bt__bar" [style.transform]="barTransform()" aria-hidden="true"></span>
    </button>
  `,
})
export class BuiButtonTimed implements OnInit, OnDestroy {
  readonly initialTime = input.required<number>();
  readonly paused = input(false, { transform: booleanAttribute });
  readonly kind = input<Kind>('primary');

  readonly buttonTimedClick = output<void>();

  private readonly _timeRemaining = signal(0);
  private readonly _startTime = signal(Date.now());
  private _intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Keep startTime in sync when paused toggles off
    effect(() => {
      const p = this.paused();
      if (!p) {
        this._startTime.set(
          Date.now() - (this.initialTime() * 1000 - this._timeRemaining()),
        );
      }
    });
  }

  ngOnInit(): void {
    this._timeRemaining.set(this.initialTime() * 1000);
    this._intervalId = setInterval(() => this._tick(), 100);
  }

  ngOnDestroy(): void {
    if (this._intervalId !== null) clearInterval(this._intervalId);
  }

  private _tick(): void {
    if (!this.paused() && this._timeRemaining() > 0) {
      const elapsed = Date.now() - this._startTime();
      const remaining = Math.max(this.initialTime() * 1000 - elapsed, 0);
      this._timeRemaining.set(remaining);
      if (remaining === 0) this.buttonTimedClick.emit();
    }
  }

  readonly isDisabled = computed(() => this._timeRemaining() === 0);
  readonly displayTime = computed(() => formatTime(this._timeRemaining()));

  readonly barTransform = computed(() => {
    const rem = this._timeRemaining();
    const total = this.initialTime() * 1000;
    if (total <= 0) return 'translateX(100%) scaleX(0)';
    const ratio = rem / total;
    return `translateX(${(1 - ratio) * 100}%) scaleX(${ratio})`;
  });

  readonly btnClass = computed(
    () =>
      `bui-button bui-button--${this.kind()} bui-button--size-large bui-button--shape-default` +
      (this.isDisabled() ? ' bui-button--disabled' : ''),
  );

  onClick(): void {
    if (this.isDisabled()) return;
    this._timeRemaining.set(0);
    this.buttonTimedClick.emit();
  }
}
