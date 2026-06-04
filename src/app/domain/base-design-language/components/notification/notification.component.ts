import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';

export type NotificationKind = 'info' | 'positive' | 'warning' | 'negative';

/** Notification — fiel ao baseui/notification (kind, closeable). */
@Component({
  selector: 'bui-notification',
  exportAs: 'buiNotification',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-notif__msg"><ng-content /></div>
    @if (closeable()) { <button type="button" class="bui-notif__close" aria-label="Close" (click)="closed.emit()"><span class="material-symbols-rounded">close</span></button> }
  `,
  styles: `
    bui-notification { display:inline-flex; align-items:center; gap:var(--bw-sizing-scale400); padding:var(--bw-sizing-scale400) var(--bw-sizing-scale600); border-radius:var(--bw-radius-300); font:var(--bw-font-ParagraphSmall); }
    bui-notification[data-kind="info"] { background:var(--bw-background-accent-light); color:var(--bw-content-accent); }
    bui-notification[data-kind="positive"] { background:var(--bw-background-positive-light); color:var(--bw-content-positive); }
    bui-notification[data-kind="warning"] { background:var(--bw-background-warning-light); color:var(--bw-content-warning); }
    bui-notification[data-kind="negative"] { background:var(--bw-background-negative-light); color:var(--bw-content-negative); }
    .bui-notif__close { border:none; background:transparent; color:inherit; cursor:pointer; line-height:0; span { font-size:18px; } }
  `,
  host: { role: 'status', '[attr.data-kind]': 'kind()' },
})
export class Notification {
  readonly kind = input<NotificationKind>('info');
  readonly closeable = input(false);
  readonly closed = output<void>();
}

@Component({
  selector: 'bui-s-notification', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Notification],
  template: `<div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
    <bui-notification kind="info">Info notification</bui-notification>
    <bui-notification kind="positive" [closeable]="true">Saved successfully</bui-notification>
    <bui-notification kind="warning">Heads up</bui-notification>
    <bui-notification kind="negative">Something failed</bui-notification>
  </div>`,
})
export class NotificationScenario {}
