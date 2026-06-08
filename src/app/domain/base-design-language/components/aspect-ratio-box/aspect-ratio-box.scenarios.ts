import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { AspectRatioBox, AspectRatioBoxBody } from './aspect-ratio-box.component';

/** Scenario portada de `src/aspect-ratio-box/__tests__/aspect-ratio-box.scenario.tsx`.
    Body com flex centralizado + borda 2px grey (props/overrides do original → style inline). */
const BODY = 'display:flex;align-items:center;justify-content:center;border:2px solid grey';

@Component({
  selector: 'bui-s-aspect-ratio-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [AspectRatioBox, AspectRatioBoxBody],
  template: `
    <bui-aspect-ratio-box>
      <bui-aspect-ratio-box-body style="${BODY}">Square by default</bui-aspect-ratio-box-body>
    </bui-aspect-ratio-box>
    <bui-aspect-ratio-box [aspectRatio]="16 / 9">
      <bui-aspect-ratio-box-body style="${BODY}">16:9 aspect ratio</bui-aspect-ratio-box-body>
    </bui-aspect-ratio-box>
  `,
})
export class AspectRatioBoxScenario {}
