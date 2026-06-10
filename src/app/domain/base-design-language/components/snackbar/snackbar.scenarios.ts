import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BuiUpload } from '../icon/icon.component';
import {
  BuiSnackbarElement,
  BuiSnackbarOutlet,
  BuiSnackbarService,
  DURATION,
  type SnackbarPlacement,
} from './snackbar.component';

// snackbar--snackbar-element
@Component({
  selector: 'bui-snackbar-element-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiSnackbarElement, BuiUpload],
  template: `
    <div style="padding:16px;display:flex;flex-direction:column;gap:8px;max-width:560px">
      <bui-snackbar-element message="Simple snackbar message" />
      <bui-snackbar-element message="With action button" actionMessage="Undo" />
      <bui-snackbar-element message="With start icon" [startEnhancerComponent]="uploadIcon" />
      <bui-snackbar-element message="With progress spinner" [progress]="true" />
      <bui-snackbar-element
        message="With all: icon, message and action"
        actionMessage="Undo"
        [startEnhancerComponent]="uploadIcon"
      />
      <bui-snackbar-element
        message="A longer message that spans multiple lines. This is a long message to show how the snackbar handles overflow text with line clamping."
        actionMessage="Undo"
        [startEnhancerComponent]="uploadIcon"
      />
      <bui-snackbar-element
        message="Action wraps because its label is very long"
        actionMessage="Very Long Action Label Text"
      />
      <bui-snackbar-element
        message="Short"
        actionMessage="Short action"
      />
      <bui-snackbar-element message="Snackbar with progress and action" [progress]="true" actionMessage="Retry" />
    </div>
  `,
})
export class SnackbarElementScenario {
  readonly uploadIcon = BuiUpload;
}

// snackbar--snackbar-element-overrides (approximation)
@Component({
  selector: 'bui-snackbar-element-overrides-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiSnackbarElement],
  template: `
    <div style="padding:16px;display:flex;flex-direction:column;gap:8px;max-width:560px">
      <bui-snackbar-element message="Custom styled snackbar" actionMessage="Dismiss" />
      <bui-snackbar-element message="Another override example" />
    </div>
  `,
})
export class SnackbarElementOverridesScenario {}

// snackbar--snackbar-element-rtl
@Component({
  selector: 'bui-snackbar-element-rtl-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiSnackbarElement, BuiUpload],
  template: `
    <div dir="rtl" style="padding:16px;display:flex;flex-direction:column;gap:8px;max-width:560px">
      <bui-snackbar-element message="رسالة قصيرة" />
      <bui-snackbar-element message="مع زر الإجراء" actionMessage="تراجع" />
      <bui-snackbar-element message="مع رمز البداية" [startEnhancerComponent]="uploadIcon" />
    </div>
  `,
})
export class SnackbarElementRtlScenario {
  readonly uploadIcon = BuiUpload;
}

// snackbar--snackbar-provider
@Component({
  selector: 'bui-snackbar-provider-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiSnackbarOutlet],
  template: `
    <div style="padding:16px">
      <p style="margin-bottom:8px">Click a button to show a snackbar:</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button (click)="enqueueShort()">Enqueue short (3s)</button>
        <button (click)="enqueueMedium()">Enqueue medium (5s)</button>
        <button (click)="enqueueLong()">Enqueue long (7s)</button>
        <button (click)="enqueueInfinite()">Enqueue infinite</button>
        <button (click)="dequeue()">Dequeue</button>
      </div>
      <bui-snackbar-outlet placement="bottom" />
    </div>
  `,
})
export class SnackbarProviderScenario {
  private readonly svc = inject(BuiSnackbarService);

  enqueueShort(): void {
    this.svc.enqueue({ message: 'Short message — auto-dismisses in 3s' }, DURATION.short);
  }

  enqueueMedium(): void {
    this.svc.enqueue(
      { message: 'Medium message — auto-dismisses in 5s', actionMessage: 'Undo' },
      DURATION.medium,
    );
  }

  enqueueLong(): void {
    this.svc.enqueue({ message: 'Long message — auto-dismisses in 7s' }, DURATION.long);
  }

  enqueueInfinite(): void {
    this.svc.enqueue(
      { message: 'Infinite message — click Dequeue to dismiss', actionMessage: 'Dismiss' },
      DURATION.infinite,
    );
  }

  dequeue(): void {
    this.svc.dequeue();
  }
}

// snackbar--snackbar-placement
@Component({
  selector: 'bui-snackbar-placement-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiSnackbarOutlet],
  template: `
    <div style="padding:16px">
      <p style="margin-bottom:8px">Selected placement: <strong>{{ placement }}</strong></p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
        @for (p of placements; track p) {
          <button
            (click)="setPlacement(p)"
            [style.font-weight]="placement === p ? 'bold' : 'normal'"
          >{{ p }}</button>
        }
      </div>
      <button (click)="show()">Show snackbar</button>
      <bui-snackbar-outlet [placement]="placement" />
    </div>
  `,
})
export class SnackbarPlacementScenario {
  private readonly svc = inject(BuiSnackbarService);

  placement: SnackbarPlacement = 'bottom';

  readonly placements: SnackbarPlacement[] = [
    'topLeft',
    'top',
    'topRight',
    'bottomRight',
    'bottom',
    'bottomLeft',
  ];

  setPlacement(p: SnackbarPlacement): void {
    this.placement = p;
  }

  show(): void {
    this.svc.enqueue({ message: `Snackbar at ${this.placement}` }, DURATION.short);
  }
}

// snackbar--snackbar-async
@Component({
  selector: 'bui-snackbar-async-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiSnackbarOutlet],
  template: `
    <div style="padding:16px">
      <p style="margin-bottom:8px">Simulates async operations with snackbar feedback:</p>
      <div style="display:flex;gap:8px">
        <button (click)="runAsync()">Start async task</button>
      </div>
      <bui-snackbar-outlet placement="bottom" />
    </div>
  `,
})
export class SnackbarAsyncScenario {
  private readonly svc = inject(BuiSnackbarService);
  private running = false;

  runAsync(): void {
    if (this.running) return;
    this.running = true;
    this.svc.enqueue({ message: 'Processing…', progress: true }, DURATION.infinite);
    setTimeout(() => {
      this.svc.dequeue();
      setTimeout(() => {
        this.svc.enqueue({ message: 'Task complete!' }, DURATION.medium);
        this.running = false;
      }, 500);
    }, 3000);
  }
}

// snackbar--snackbar-provider-overrides (approximation)
@Component({
  selector: 'bui-snackbar-provider-overrides-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiSnackbarOutlet],
  template: `
    <div style="padding:16px">
      <button (click)="show()">Show snackbar with action</button>
      <bui-snackbar-outlet placement="bottom" />
    </div>
  `,
})
export class SnackbarProviderOverridesScenario {
  private readonly svc = inject(BuiSnackbarService);

  show(): void {
    this.svc.enqueue(
      {
        message: 'Override example',
        actionMessage: 'Dismiss',
        actionOnClick: () => this.svc.dequeue(),
      },
      DURATION.infinite,
    );
  }
}
