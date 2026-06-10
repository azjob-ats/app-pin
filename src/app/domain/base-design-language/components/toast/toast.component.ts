import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

// ── Types ──────────────────────────────────────────────────────────────────────

export type ToastKind = 'info' | 'positive' | 'warning' | 'negative';
export type ToastPlacement =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'bottomRight'
  | 'bottom'
  | 'bottomLeft';

export interface ToastItem {
  key: string;
  message: string;
  kind: ToastKind;
  autoHideDuration?: number;
  closeable?: boolean;
  isVisible?: boolean;
}

// ── BuiToasterService ─────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class BuiToasterService {
  private readonly _toasts = signal<ToastItem[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private _key = 0;
  private _timers = new Map<string, ReturnType<typeof setTimeout>>();

  info(message: string, opts: Partial<Omit<ToastItem, 'key' | 'message' | 'kind'>> & { key?: string } = {}): string {
    return this._add(message, 'info', opts);
  }

  positive(message: string, opts: Partial<Omit<ToastItem, 'key' | 'message' | 'kind'>> & { key?: string } = {}): string {
    return this._add(message, 'positive', opts);
  }

  warning(message: string, opts: Partial<Omit<ToastItem, 'key' | 'message' | 'kind'>> & { key?: string } = {}): string {
    return this._add(message, 'warning', opts);
  }

  negative(message: string, opts: Partial<Omit<ToastItem, 'key' | 'message' | 'kind'>> & { key?: string } = {}): string {
    return this._add(message, 'negative', opts);
  }

  dismiss(key: string): void {
    this._animate(key);
  }

  private _add(message: string, kind: ToastKind, opts: Partial<ToastItem> & { key?: string }): string {
    const key = opts.key ?? `__toast__${++this._key}`;
    // if key already exists, update and reset timer
    const existing = this._toasts().find((t) => t.key === key);
    if (existing) {
      this._toasts.update((ts) => ts.map((t) => t.key === key ? { ...t, message, kind, isVisible: true } : t));
      if (this._timers.has(key)) {
        clearTimeout(this._timers.get(key)!);
        this._timers.delete(key);
      }
    } else {
      const item: ToastItem = { key, message, kind, isVisible: false, ...opts };
      this._toasts.update((ts) => [...ts, item]);
    }

    // animate in
    setTimeout(() => {
      this._toasts.update((ts) => ts.map((t) => t.key === key ? { ...t, isVisible: true } : t));
    }, 0);

    const duration = opts.autoHideDuration ?? 0;
    if (duration > 0) {
      const timer = setTimeout(() => this._animate(key), duration);
      this._timers.set(key, timer);
    }

    return key;
  }

  private _animate(key: string): void {
    if (this._timers.has(key)) {
      clearTimeout(this._timers.get(key)!);
      this._timers.delete(key);
    }
    this._toasts.update((ts) => ts.map((t) => t.key === key ? { ...t, isVisible: false } : t));
    setTimeout(() => {
      this._toasts.update((ts) => ts.filter((t) => t.key !== key));
    }, 600);
  }
}

// ── BuiToast ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'bui-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './toast.component.scss',
  template: `
    <div
      class="bui-toast__body"
      [class]="'bui-toast__body--' + kind()"
      [class.bui-toast__body--visible]="isVisible()"
      role="alert"
      aria-atomic="true"
      data-baseweb="toast"
    >
      <div class="bui-toast__inner">
        <ng-content />
      </div>
      @if (closeable()) {
        <button
          class="bui-toast__close"
          aria-label="Close notification"
          (click)="handleClose()"
          (keydown.enter)="handleClose()"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      }
    </div>
  `,
})
export class BuiToast {
  readonly kind = input<ToastKind>('info');
  readonly closeable = input(true, { transform: booleanAttribute });
  readonly autoHideDuration = input(0);

  protected readonly isVisible = signal(false);
  private _hideTimer: ReturnType<typeof setTimeout> | null = null;
  private _removeTimer: ReturnType<typeof setTimeout> | null = null;

  readonly toastClose = output<void>();

  constructor() {
    afterNextRender(() => {
      // animate in
      setTimeout(() => this.isVisible.set(true), 0);
      const duration = this.autoHideDuration();
      if (duration > 0) {
        this._hideTimer = setTimeout(() => this.dismiss(), duration);
      }
    });
  }

  ngOnDestroy(): void {
    if (this._hideTimer) clearTimeout(this._hideTimer);
    if (this._removeTimer) clearTimeout(this._removeTimer);
  }

  protected handleClose(): void {
    this.dismiss();
  }

  dismiss(): void {
    if (this._hideTimer) { clearTimeout(this._hideTimer); this._hideTimer = null; }
    this.isVisible.set(false);
    this._removeTimer = setTimeout(() => this.toastClose.emit(), 600);
  }
}

// ── BuiToasterContainer ───────────────────────────────────────────────────────

@Component({
  selector: 'bui-toaster-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiToast],
  template: `
    <div
      class="bui-toaster__root"
      [class]="'bui-toaster__root--' + placement()"
      aria-live="polite"
      aria-atomic="false"
    >
      @for (toast of svc.toasts(); track toast.key) {
        <bui-toast
          [kind]="toast.kind"
          [closeable]="toast.closeable ?? closeable()"
          [autoHideDuration]="toast.autoHideDuration ?? autoHideDuration()"
          (toastClose)="dismiss(toast.key)"
        >
          {{ toast.message }}
        </bui-toast>
      }
    </div>
  `,
})
export class BuiToasterContainer {
  readonly placement = input<ToastPlacement>('bottomRight');
  readonly closeable = input(true, { transform: booleanAttribute });
  readonly autoHideDuration = input(0);
  protected readonly svc = inject(BuiToasterService);

  dismiss(key: string): void {
    this.svc.dismiss(key);
  }
}
