import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Link } from './link.component';

/** Scenario portada de `src/link/__tests__/link.scenario.tsx`.
    `Block font="font450"` (18px/24px/500) = token `LabelLarge`; os links herdam size/lh. */
@Component({
  selector: 'bui-s-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Link],
  template: `<div style="font:var(--bw-font-LabelLarge);color:var(--bw-content-primary)">
    <a buiLink href="#">I am a Link!</a>
    <br />
    <br />
    <a buiLink animateUnderline href="#">animate underline</a>
  </div>`,
})
export class LinkScenario {}
