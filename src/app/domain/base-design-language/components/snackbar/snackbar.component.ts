import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injectable,
  Type,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { Spinner } from '../spinner/spinner.component';

// ── Types ──────────────────────────────────────────────────────────────────────

export type SnackbarPlacement =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'bottomRight'
  | 'bottom'
  | 'bottomLeft';

export const DURATION = {
  infinite: 0,
  short: 3000,
  medium: 5000,
  long: 7000,
} as const;

export type SnackbarDuration = (typeof DURATION)[keyof typeof DURATION];

export interface SnackbarProps {
  message: string;
  actionMessage?: string;
  actionOnClick?: () => void;
  startEnhancerComponent?: Type<unknown>;
  progress?: boolean;
  focus?: boolean;
}

// ── BuiSnackbarService ────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class BuiSnackbarService {
  private readonly _queue = signal<Array<{ props: SnackbarProps; duration: SnackbarDuration }>>([]);
  private _displayTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly _animating = signal(false);

  readonly current = computed(() => this._queue()[0] ?? null);
  readonly animating = this._animating.asReadonly();

  enqueue(props: SnackbarProps, duration: SnackbarDuration = DURATION.short): void {
    const wasEmpty = this._queue().length === 0;
    this._queue.update((q) => [...q, { props, duration }]);
    if (wasEmpty) this._enter(duration);
  }

  dequeue(): void {
    if (this._displayTimer !== null) {
      clearTimeout(this._displayTimer);
      this._displayTimer = null;
    }
    this._animating.set(true);
    setTimeout(() => {
      this._animating.set(false);
      this._queue.update((q) => {
        const next = q.slice(1);
        if (next.length > 0) this._enter(next[0].duration);
        return next;
      });
    }, 400);
  }

  private _enter(duration: SnackbarDuration): void {
    if (duration !== DURATION.infinite) {
      this._displayTimer = setTimeout(() => this.dequeue(), duration);
    }
  }
}

// ── BuiSnackbarElement ────────────────────────────────────────────────────────

@Component({
  selector: 'bui-snackbar-element',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgComponentOutlet, Spinner],
  styleUrl: './snackbar.component.scss',
  template: `
    @if (actionMessage()) {
      <div class="bui-sb__measure-wrap" aria-hidden="true">
        <button #actionMeasure class="bui-sb__action-btn bui-sb__action-btn--measure" tabindex="-1">
          {{ actionMessage() }}
        </button>
      </div>
    }

    <div #rootEl class="bui-sb__root" role="status" aria-live="polite" data-baseweb="snackbar">
      <div class="bui-sb__content">
        @if (startEnhancerComponent() || progress()) {
          <span class="bui-sb__start-enhancer" aria-hidden="true">
            @if (startEnhancerComponent()) {
              <ng-container *ngComponentOutlet="startEnhancerComponent()!; inputs: { size: '24', color: 'currentColor' }" />
            } @else {
              <bui-spinner size="medium" />
            }
          </span>
        }

        <p class="bui-sb__message" [class.bui-sb__message--has-action]="!!actionMessage() && !wrapActionButton()">
          {{ message() }}
        </p>

        @if (actionMessage() && !wrapActionButton()) {
          <button class="bui-sb__action-btn" (click)="handleActionClick()">
            {{ actionMessage() }}
          </button>
        }
      </div>

      @if (actionMessage() && wrapActionButton()) {
        <div class="bui-sb__wrap-action">
          <button class="bui-sb__action-btn" (click)="handleActionClick()">
            {{ actionMessage() }}
          </button>
        </div>
      }
    </div>
  `,
})
export class BuiSnackbarElement {
  readonly message = input.required<string>();
  readonly actionMessage = input<string>();
  readonly actionOnClick = input<() => void>();
  readonly startEnhancerComponent = input<Type<unknown>>();
  readonly progress = input(false, { transform: booleanAttribute });
  readonly focus = input(true, { transform: booleanAttribute });

  private readonly rootElRef = viewChild<ElementRef<HTMLElement>>('rootEl');
  private readonly actionMeasureRef = viewChild<ElementRef<HTMLElement>>('actionMeasure');

  protected readonly rootWidth = signal(0);
  protected readonly actionMeasureWidth = signal(0);

  protected readonly wrapActionButton = computed(
    () => this.actionMeasureWidth() > 0 && this.actionMeasureWidth() > this.rootWidth() / 2,
  );

  private rootObserver: ResizeObserver | null = null;
  private actionObserver: ResizeObserver | null = null;

  constructor() {
    afterNextRender(() => {
      if (typeof ResizeObserver === 'undefined') return;

      const root = this.rootElRef()?.nativeElement;
      if (root) {
        this.rootObserver = new ResizeObserver(([e]) => this.rootWidth.set(e.contentRect.width));
        this.rootObserver.observe(root);
      }

      const action = this.actionMeasureRef()?.nativeElement;
      if (action) {
        this.actionObserver = new ResizeObserver(([e]) =>
          this.actionMeasureWidth.set(e.contentRect.width),
        );
        this.actionObserver.observe(action);
      }
    });
  }

  ngOnDestroy(): void {
    this.rootObserver?.disconnect();
    this.actionObserver?.disconnect();
  }

  protected handleActionClick(): void {
    this.actionOnClick()?.();
  }
}

// ── BuiSnackbarOutlet ─────────────────────────────────────────────────────────

@Component({
  selector: 'bui-snackbar-outlet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiSnackbarElement],
  template: `
    @if (svc.current(); as snackbar) {
      <div
        class="bui-sb__placement"
        [class]="'bui-sb__placement--' + placement()"
        [class.bui-sb__placement--visible]="!svc.animating()"
      >
        <bui-snackbar-element
          [message]="snackbar.props.message"
          [actionMessage]="snackbar.props.actionMessage"
          [actionOnClick]="snackbar.props.actionOnClick"
          [startEnhancerComponent]="snackbar.props.startEnhancerComponent"
          [progress]="!!snackbar.props.progress"
          [focus]="snackbar.props.focus ?? true"
        />
      </div>
    }
  `,
})
export class BuiSnackbarOutlet {
  readonly placement = input<SnackbarPlacement>('bottom');
  protected readonly svc = inject(BuiSnackbarService);
}
