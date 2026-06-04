import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

export type DotColor = 'accent' | 'negative';

/** NotificationCircle — fiel ao baseui/badge (círculo com número). */
@Component({
  selector: 'bui-notification-circle',
  exportAs: 'buiNotificationCircle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  styles: `
    bui-notification-circle { display:inline-flex; align-items:center; justify-content:center; min-width:20px; height:20px; padding:0 6px; box-sizing:border-box; border-radius:999px; font:var(--bw-font-LabelXSmall); color:var(--bw-content-on-color); }
    bui-notification-circle[data-color="accent"] { background:var(--bw-background-accent); }
    bui-notification-circle[data-color="negative"] { background:var(--bw-background-negative); }
  `,
  host: { '[attr.data-color]': 'color()' },
})
export class NotificationCircle {
  readonly color = input<DotColor>('negative');
}

/** HintDot — fiel ao baseui/badge (ponto pequeno). */
@Component({
  selector: 'bui-hint-dot',
  exportAs: 'buiHintDot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '',
  styles: `
    bui-hint-dot { display:inline-block; width:8px; height:8px; border-radius:50%; }
    bui-hint-dot[data-color="accent"] { background:var(--bw-background-accent); }
    bui-hint-dot[data-color="negative"] { background:var(--bw-background-negative); }
  `,
  host: { '[attr.data-color]': 'color()' },
})
export class HintDot {
  readonly color = input<DotColor>('negative');
}

@Component({
  selector: 'bui-s-notification-circle', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [NotificationCircle],
  template: `<div style="display:flex; gap:16px; align-items:center;">
    <bui-notification-circle>1</bui-notification-circle>
    <bui-notification-circle>12</bui-notification-circle>
    <bui-notification-circle color="accent">99+</bui-notification-circle>
  </div>`,
})
export class NotificationCircleScenario {}

@Component({
  selector: 'bui-s-hint-dot', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [HintDot],
  template: `<div style="display:flex; gap:16px; align-items:center;">
    <bui-hint-dot /><bui-hint-dot color="accent" />
  </div>`,
})
export class HintDotScenario {}
