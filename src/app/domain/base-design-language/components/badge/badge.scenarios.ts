import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BuiBadge, BuiNotificationCircle, BuiHintDot } from './badge.component';
import { BuiCheck, BuiUpload, BuiAlert } from '../icon/icon.component';
import { BuiTag } from '../tag/tag.component';
import { Button } from '../button/button.component';

/** Scenarios portadas de `src/badge/__tests__/*.scenario.tsx`. */
const LAYOUT = 'display:flex;justify-content:space-between;margin-bottom:50px';
const BOX =
  'background:var(--bw-primary-a);color:white;display:flex;justify-content:center;align-items:center;flex-direction:column;border-top-left-radius:var(--bw-surface-border-radius);border-top-right-radius:var(--bw-surface-border-radius)';
const BOX_BADGE = `${BOX};height:140px;width:220px`;
const BOX_NC = `${BOX};height:100px;width:150px`;

// badge.scenario.tsx — todas as placements (corner/edge) + offsets.
@Component({
  selector: 'bui-s-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiBadge],
  template: `<div>
    <div style="${LAYOUT}">
      <bui-badge placement="topLeft" content="Badge"><div style="${BOX_BADGE}">topLeft</div></bui-badge>
      <bui-badge placement="topRight" content="Badge"><div style="${BOX_BADGE}">topRight</div></bui-badge>
      <bui-badge placement="bottomRight" content="Badge"><div style="${BOX_BADGE}">bottomRight</div></bui-badge>
      <bui-badge placement="bottomLeft" content="Badge"><div style="${BOX_BADGE}">bottomLeft</div></bui-badge>
    </div>
    <div style="${LAYOUT}">
      <bui-badge placement="topLeftEdge" content="Badge"><div style="${BOX_BADGE}">topLeftEdge</div></bui-badge>
      <bui-badge placement="topEdge" content="Badge"><div style="${BOX_BADGE}">topEdge</div></bui-badge>
      <bui-badge placement="topRightEdge" content="Badge"><div style="${BOX_BADGE}">topRightEdge</div></bui-badge>
    </div>
    <div style="${LAYOUT}">
      <bui-badge placement="bottomRightEdge" content="Badge"><div style="${BOX_BADGE}">bottomRightEdge</div></bui-badge>
      <bui-badge placement="bottomEdge" content="Badge"><div style="${BOX_BADGE}">bottomEdge</div></bui-badge>
      <bui-badge placement="bottomLeftEdge" content="Badge"><div style="${BOX_BADGE}">bottomLeftEdge</div></bui-badge>
    </div>
    <div style="${LAYOUT}">
      <bui-badge placement="leftTopEdge" content="Badge"><div style="${BOX_BADGE}">leftTopEdge</div></bui-badge>
      <bui-badge placement="rightTopEdge" content="Badge"><div style="${BOX_BADGE}">rightTopEdge</div></bui-badge>
      <bui-badge placement="rightBottomEdge" content="Badge"><div style="${BOX_BADGE}">rightBottomEdge</div></bui-badge>
      <bui-badge placement="leftBottomEdge" content="Badge"><div style="${BOX_BADGE}">leftBottomEdge</div></bui-badge>
    </div>
    <div style="${LAYOUT}">
      <bui-badge placement="topLeft" content="Badge" horizontalOffset="0" verticalOffset="0">
        <div style="${BOX_BADGE}"><div>topLeft</div><div>Offsets: 0, 0</div></div>
      </bui-badge>
      <bui-badge placement="topRight" content="Badge" horizontalOffset="0" verticalOffset="-10px">
        <div style="${BOX_BADGE}"><div>topRight</div><div>Offsets: 0, -10px</div></div>
      </bui-badge>
      <bui-badge placement="bottomLeft" content="Badge" horizontalOffset="10%" verticalOffset="10%">
        <div style="${BOX_BADGE}"><div>bottomLeft</div><div>Offsets: 10%, 10%</div></div>
      </bui-badge>
      <bui-badge placement="bottomRight" content="Badge" verticalOffset="30px">
        <div style="${BOX_BADGE}"><div>bottomRight</div><div>Offsets: default, 30px</div></div>
      </bui-badge>
    </div>
  </div>`,
})
export class BadgeScenario {}

// inline-badge.scenario.tsx — chips inline (rect/secondary/pill) + NotificationCircle.
@Component({
  selector: 'bui-s-inline-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiBadge, BuiNotificationCircle, BuiCheck],
  template: `<div>
    <div style="${LAYOUT}">
      <bui-badge content="Rect" />
      <bui-badge content="Rect" color="primary" />
      <bui-badge content="Rect" color="positive" />
      <bui-badge content="Rect" color="negative" />
      <bui-badge content="Rect" color="warning" />
    </div>
    <div style="${LAYOUT}">
      <bui-badge content="Rect" hierarchy="secondary" />
      <bui-badge content="Rect" hierarchy="secondary" color="primary" />
      <bui-badge content="Rect" hierarchy="secondary" color="positive" />
      <bui-badge content="Rect" hierarchy="secondary" color="negative" />
      <bui-badge content="Rect" hierarchy="secondary" color="warning" />
    </div>
    <div style="${LAYOUT}">
      <bui-badge content="Pill" shape="pill" />
      <bui-badge content="Pill" shape="pill" color="primary" />
      <bui-badge content="Pill" shape="pill" color="positive" />
      <bui-badge content="Pill" shape="pill" color="negative" />
      <bui-badge content="Pill" shape="pill" color="warning" />
    </div>
    <div style="${LAYOUT}">
      <bui-notification-circle [content]="5" />
      <bui-notification-circle [content]="8" color="primary" />
      <bui-notification-circle [content]="24" color="positive" />
      <bui-notification-circle [content]="5" color="negative" />
      <bui-notification-circle [content]="34" color="warning" />
    </div>
    <div style="${LAYOUT}">
      <bui-notification-circle><bui-check badgeContent [size]="16" /></bui-notification-circle>
      <bui-notification-circle color="primary"><bui-check badgeContent [size]="16" /></bui-notification-circle>
      <bui-notification-circle color="positive"><bui-check badgeContent [size]="16" /></bui-notification-circle>
      <bui-notification-circle color="negative"><bui-check badgeContent [size]="16" /></bui-notification-circle>
      <bui-notification-circle color="warning"><bui-check badgeContent [size]="16" /></bui-notification-circle>
    </div>
  </div>`,
})
export class InlineBadgeScenario {}

// notification-circle.scenario.tsx — círculos anexados em Box e em Tag.
@Component({
  selector: 'bui-s-notification-circle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiNotificationCircle, BuiCheck, BuiTag],
  template: `<div>
    <div style="${LAYOUT}">
      <bui-notification-circle placement="topLeft">
        <bui-check badgeContent [size]="16" /><div style="${BOX_NC}">Top Left</div>
      </bui-notification-circle>
      <bui-notification-circle placement="topRight">
        <bui-check badgeContent [size]="16" /><div style="${BOX_NC}">Top Right</div>
      </bui-notification-circle>
      <bui-notification-circle placement="topLeft" [content]="7" horizontalOffset="0px" verticalOffset="0px">
        <bui-tag size="large" [closeable]="false">Ipsum Lorem</bui-tag>
      </bui-notification-circle>
      <bui-notification-circle placement="topRight" [content]="19" horizontalOffset="0px" verticalOffset="0px">
        <bui-tag size="large" [closeable]="false">Ipsum Lorem</bui-tag>
      </bui-notification-circle>
    </div>
  </div>`,
})
export class NotificationCircleScenario {}

// hint-dot.scenario.tsx — dots em Tags (offsets/sizes), texto, ícones e botão.
@Component({
  selector: 'bui-s-hint-dot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiHintDot, BuiTag, BuiUpload, BuiAlert, Button],
  template: `<div>
    <div style="${LAYOUT}">
      @for (c of colors; track c) {
        <bui-hint-dot [color]="c"><bui-tag [closeable]="false" size="medium">Default</bui-tag></bui-hint-dot>
      }
    </div>
    <div style="${LAYOUT}">
      @for (c of colors; track c) {
        <bui-hint-dot [color]="c" horizontalOffset="2px" verticalOffset="2px">
          <bui-tag [closeable]="false" size="medium">2px, 2px</bui-tag>
        </bui-hint-dot>
      }
    </div>
    <div style="${LAYOUT}">
      @for (c of colors; track c) {
        <bui-hint-dot [color]="c" horizontalOffset="3px" verticalOffset="3px">
          <bui-tag [closeable]="false" size="large">3px, 3px</bui-tag>
        </bui-hint-dot>
      }
    </div>
    <div style="${LAYOUT}">
      @for (c of colors; track c) {
        <bui-hint-dot [color]="c" horizontalOffset="1px" verticalOffset="1px">
          <bui-tag [closeable]="false" size="small">1px, 1px</bui-tag>
        </bui-hint-dot>
      }
    </div>
    <div style="${LAYOUT}">
      <bui-hint-dot stringAnchor>This is some text</bui-hint-dot>
    </div>
    <div style="${LAYOUT}">
      <bui-hint-dot><bui-upload [size]="64" /></bui-hint-dot>
      <bui-hint-dot><bui-upload [size]="32" /></bui-hint-dot>
      <bui-hint-dot><bui-alert [size]="64" /></bui-hint-dot>
      <bui-hint-dot><bui-alert [size]="32" /></bui-hint-dot>
    </div>
    <div style="${LAYOUT}">
      <bui-hint-dot><bui-button>Button</bui-button></bui-hint-dot>
    </div>
  </div>`,
})
export class HintDotScenario {
  protected readonly colors = ['negative', 'positive', 'accent', 'warning', 'primary'] as const;
}
